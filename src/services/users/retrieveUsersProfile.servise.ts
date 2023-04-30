import { QueryConfig, QueryResult } from "pg";
import { TUserResponse } from "../../interfaces/users.interface";
import { responseUserSchema } from "../../schemas/users.schema";
import { client } from "../../database";

const retrieveUsersProfileService = async (
  userId: number
): Promise<TUserResponse> => {
  const id: number = Number(userId);
  const queryString: string = `
      SELECT
          *
      From  
          users
      WHERE 
          id=$1
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TUserResponse> = await client.query(
    queryConfig
  );

  const users: TUserResponse = responseUserSchema.parse(queryResult.rows[0]);

  return users;
};

export default retrieveUsersProfileService;
