import supertest from 'supertest'
import app from '../../../app'
import { client } from '../../../database'
import { configureTestDatabase } from '../../configs/configTestsDatabase'
import { createTokenData, createUsersData } from '../../configs/loadData'

describe('Testando rota de listagem dos dados do perfil do usuário logado', () => {
    let tokenAdmin: string
    let tokenNotAdmin: string

    beforeAll(async () => {
        await client.connect()
        await configureTestDatabase(client)
        await createUsersData(client)
        const token = await createTokenData(client)
        tokenAdmin = token.tokenAdmin
        tokenNotAdmin = token.tokenNotAdmin
    })

    afterAll(async () => {
        await client.end()
    })

    it('GET /users/profile - Sucesso: Listando perfil do usuário.', async () => {
        const response = await supertest(app)
            .get('/users/profile')
            .set('Authorization', `Bearer ${tokenAdmin}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('email')
        expect(response.body).toHaveProperty('admin')
        expect(response.body).toHaveProperty('active')
        expect(response.body).not.toHaveProperty('password')
    })

    it('GET /users/profile - Erro: Listandos perfil do usuário sem enviar token.', async () => {
        const response = await supertest(app).get('/users/profile')

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Missing Bearer Token')
    })

    it('GET /users/profile - Erro: Listandos perfil do usuário enviando token incorreto.', async () => {
        const response = await supertest(app)
            .get('/users/profile')
            .set('Authorization', `Bearer 1234`)

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message')
    })
})
