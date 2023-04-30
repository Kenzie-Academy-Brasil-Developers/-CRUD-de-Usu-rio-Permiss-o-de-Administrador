import { QueryConfig, QueryResult } from "pg";
import { client } from "../../database";
import { TUser, TUserResponse } from "../../interfaces/users.interface";

const deleteUsersService = async (
  userId: number,
  token: number
): Promise<TUserResponse> => {
  const id = userId;
  const userToken = token;

  if (userToken !== id) {
    throw new Error("Usuário não autorizado a excluir esta conta.");
  }
  const queryString: string = `
      UPDATE
          users
      SET
          active = false
      WHERE
          id = $1
      AND
          active = true
      RETURNING *;
      `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TUser> = await client.query(queryConfig);

  const user = queryResult.rows[0];

  return user;
};

export default deleteUsersService;
