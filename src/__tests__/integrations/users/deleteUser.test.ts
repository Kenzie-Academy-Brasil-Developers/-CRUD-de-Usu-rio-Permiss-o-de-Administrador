import supertest from 'supertest'
import app from '../../../app'
import { client } from '../../../database'
import { configureTestDatabase } from '../../configs/configTestsDatabase'
import { createTokenData, createUsersData } from '../../configs/loadData'
import { TUser } from '../../mocks/interfaces'
import { QueryResult } from 'pg'

describe('Testando rota de deleção de usuário', () => {
    let tokenAdmin: string
    let tokenNotAdmin: string
    let userNotAdmin: TUser
    let userAdmin: TUser

    beforeAll(async () => {
        await client.connect()
        await configureTestDatabase(client)
        const users = await createUsersData(client)
        const token = await createTokenData(client)
        tokenAdmin = token.tokenAdmin
        tokenNotAdmin = token.tokenNotAdmin
        userAdmin = users.admin
        userNotAdmin = users.notAdmin
    })

    afterAll(async () => {
        await client.end()
    })

    it('DELETE /users/:id - Error: Deletando usuário admin com token de não admin.', async () => {
        const response = await supertest(app)
            .delete(`/users/${userAdmin.id}`)
            .set('Authorization', `Bearer ${tokenNotAdmin}`)

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Insufficient Permission')
    })

    it('DELETE /users/:id - Sucesso: Deletando usuário não admin com token de não admin.', async () => {
        const response = await supertest(app)
            .delete(`/users/${userNotAdmin.id}`)
            .set('Authorization', `Bearer ${tokenNotAdmin}`)

        expect(response.status).toBe(204)
        const queryResultNotAdmin: QueryResult = await client.query(
            `
                    SELECT
                        *
                    FROM
                        users
                    WHERE
                        id = $1;
                `,
            [userNotAdmin.id]
        )
        expect(queryResultNotAdmin.rows[0].active).toBe(false)
    })

    it('DELETE /users/:id - Error: Deletando usuário com id errado.', async () => {
        const response = await supertest(app)
            .delete(`/users/1234`)
            .set('Authorization', `Bearer ${tokenAdmin}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('User not found')
    })
})
