import { QueryConfig, QueryResult } from "pg";
import { TUser, TUserResponse } from "../../interfaces/users.interface";
import { client } from "../../database";
import { responseUserSchema } from "../../schemas/users.schema";
import { AppError } from "../../error";

const recoverUserService = async (userId: number): Promise<TUserResponse> => {
  const id: number = userId;

  const queryString: string = `
    UPDATE
        users
    SET
        active=true
    WHERE   
        id=$1
    AND 
        active = false
    RETURNING *;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<TUser> = await client.query(queryConfig);

  const user = queryResult.rows[0];

  return responseUserSchema.parse(user);
};

export default recoverUserService;
