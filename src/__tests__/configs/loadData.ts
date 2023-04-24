import { Client, QueryResult } from 'pg'
import { createUserAdmin, createUserNotAdmin } from '../mocks/users/users.mocks'
import { hash } from 'bcryptjs'
import format from 'pg-format'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { client } from '../../database'

const createUsersData = async (client: Client) => {
    createUserNotAdmin.password = await hash(createUserNotAdmin.password, 10)

    const queryResultNotAdmin: QueryResult = await client.query(
        format(
            `
                INSERT INTO
                    "users"(%I)
                values
                    (%L)
                RETURNING *;
            `,
            Object.keys(createUserNotAdmin),
            Object.values(createUserNotAdmin)
        )
    )

    createUserAdmin.password = await hash(createUserNotAdmin.password, 10)

    const queryResultAdmin: QueryResult = await client.query(
        format(
            `
                INSERT INTO
                    "users"(%I)
                values
                    (%L)
                RETURNING *;
            `,
            Object.keys(createUserAdmin),
            Object.values(createUserAdmin)
        )
    )

    return {
        admin: queryResultAdmin.rows[0],
        notAdmin: queryResultNotAdmin.rows[0],
    }
}

const createTokenData = async (client: Client) => {
    const userAdminData: QueryResult = await client.query(
        `
        SELECT
            *
        FROM
            users
        WHERE
            email = $1;
    `,
        [createUserAdmin.email]
    )

    const tokenAdmin = jwt.sign(
        {
            admin: createUserAdmin.admin,
        },
        process.env.SECRET_KEY!,
        {
            subject: String(userAdminData.rows[0].id),
        }
    )

    const userNotAdminData: QueryResult = await client.query(
        `
        SELECT
            *
        FROM
            users
        WHERE
            email = $1;
    `,
        [createUserNotAdmin.email]
    )

    const tokenNotAdmin = jwt.sign(
        {
            admin: createUserNotAdmin.admin,
        },
        process.env.SECRET_KEY!,
        {
            subject: String(userNotAdminData.rows[0].id),
        }
    )

    return {
        tokenAdmin,
        tokenNotAdmin,
    }
}

export { createUsersData, createTokenData }
