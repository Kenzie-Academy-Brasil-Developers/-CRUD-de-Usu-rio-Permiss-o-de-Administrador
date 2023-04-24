import supertest from 'supertest'
import app from '../../../app'
import { client } from '../../../database'
import { configureTestDatabase } from '../../configs/configTestsDatabase'
import { createTokenData, createUsersData } from '../../configs/loadData'
import { TUser } from '../../mocks/interfaces'

describe('Testando rota de atualização de usuário', () => {
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

    it('PATCH /users/:id - Sucesso: Atualizando usuário admin com token de admin.', async () => {
        const response = await supertest(app)
            .patch(`/users/${userAdmin.id}`)
            .send({ name: 'Ugo Atualizado' })
            .set('Authorization', `Bearer ${tokenAdmin}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('email')
        expect(response.body).toHaveProperty('admin')
        expect(response.body).toHaveProperty('active')
        expect(response.body).not.toHaveProperty('password')
        expect(response.body.name).toBe('Ugo Atualizado')
        expect(response.body.email).toBe('ugo@kenzie.com.br')
    })

    it('PATCH /users/:id - Sucesso: Atualizando usuário não admin com token de admin.', async () => {
        const response = await supertest(app)
            .patch(`/users/${userNotAdmin.id}`)
            .send({ name: 'Fabio Atualizado' })
            .set('Authorization', `Bearer ${tokenAdmin}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('email')
        expect(response.body).toHaveProperty('admin')
        expect(response.body).toHaveProperty('active')
        expect(response.body).not.toHaveProperty('password')
        expect(response.body.name).toBe('Fabio Atualizado')
        expect(response.body.email).toBe('fabio@kenzie.com.br')
    })

    it('PATCH /users/:id - Sucesso: Atualizando usuário não admin com token de não admin.', async () => {
        const response = await supertest(app)
            .patch(`/users/${userNotAdmin.id}`)
            .send({ email: 'fabio.atualizado@kenzie.com.br' })
            .set('Authorization', `Bearer ${tokenNotAdmin}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('email')
        expect(response.body).toHaveProperty('admin')
        expect(response.body).toHaveProperty('active')
        expect(response.body).not.toHaveProperty('password')
        expect(response.body.name).toBe('Fabio Atualizado')
        expect(response.body.email).toBe('fabio.atualizado@kenzie.com.br')
    })

    it('PATCH /users/:id - Error: Atualizando usuário admin com token de não admin.', async () => {
        const response = await supertest(app)
            .patch(`/users/${userAdmin.id}`)
            .send({ email: 'fabio.atualizado@kenzie.com.br' })
            .set('Authorization', `Bearer ${tokenNotAdmin}`)

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Insufficient Permission')
    })

    it('PATCH /users/:id - Error: Usuário com id não encontrado.', async () => {
        const response = await supertest(app)
            .patch(`/users/123`)
            .send({ name: 'Fabio Atualizado' })
            .set('Authorization', `Bearer ${tokenAdmin}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('User not found')
    })

    it('PATCH /users/:id - Error: Tentando atualizar usuários com keys inválidas.', async () => {
        const response = await supertest(app)
            .patch(`/users/${userAdmin.id}`)
            .send({ name: 1234, email: 'joaoerrado' })
            .set('Authorization', `Bearer ${tokenAdmin}`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('email')
    })
})
