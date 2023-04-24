import supertest from 'supertest'
import app from '../../../app'
import { client } from '../../../database'
import { configureTestDatabase } from '../../configs/configTestsDatabase'
import { createTokenData, createUsersData } from '../../configs/loadData'
import { TUser } from '../../mocks/interfaces'
import { QueryResult } from 'pg'

describe('Testando rota de recuperação de usuário', () => {
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

    it('PUT /users/:id/recover - Error: Recuperando usuário com token de não admin.', async () => {
        const response = await supertest(app)
            .put(`/users/${userNotAdmin.id}/recover`)
            .set('Authorization', `Bearer ${tokenNotAdmin}`)

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Insufficient Permission')
    })

    it('PUT /users/:id/recover - Sucesso: Recuperando usuário usando o token de admin.', async () => {
        const queryResultNotAdmin: QueryResult = await client.query(
            `
                    UPDATE
                        users
                    SET 
                        active = false
                    WHERE
                        id = $1;
                `,
            [userNotAdmin.id]
        )
        const response = await supertest(app)
            .put(`/users/${userNotAdmin.id}/recover`)
            .set('Authorization', `Bearer ${tokenAdmin}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('email')
        expect(response.body).toHaveProperty('admin')
        expect(response.body).toHaveProperty('active')
        expect(response.body).not.toHaveProperty('password')
        expect(response.body.admin).toEqual(userNotAdmin.admin)
    })

    it('PUT /users/:id/recover - Error: Ativando usuário já ativo.', async () => {
        const response = await supertest(app)
            .put(`/users/${userNotAdmin.id}/recover`)
            .set('Authorization', `Bearer ${tokenAdmin}`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('User already active')
    })
})
