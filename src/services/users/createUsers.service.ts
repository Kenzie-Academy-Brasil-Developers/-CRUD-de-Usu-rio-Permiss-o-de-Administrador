import format from "pg-format";
import { responseUserSchema } from "../../schemas/users.schema";
import { QueryResult } from "pg";
import { client } from "../../database";
import {
  TUser,
  TUserRequest,
  TUserResponse,
} from "../../interfaces/users.interface";
import * as bcrypt from "bcryptjs";

const createUsersService = async (
  payload: TUserRequest
): Promise<TUserResponse> => {
  payload.password = await bcrypt.hash(payload.password, 10);

  const queryString: string = format(
    `
      INSERT INTO
          users(%I)
      VALUES
          (%L)
      RETURNING
          *;
    `,
    Object.keys(payload),
    Object.values(payload)
  );
  const queryResult: QueryResult<TUser> = await client.query(queryString);
  const newUser: TUserResponse = responseUserSchema.parse(queryResult.rows[0]);

  return newUser;
};

export default createUsersService;
