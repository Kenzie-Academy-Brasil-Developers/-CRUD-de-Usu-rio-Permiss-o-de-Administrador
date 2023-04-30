import format from "pg-format";
import {
  TLoginRequest,
  TLoginResponse,
} from "../../interfaces/login.interfaces";
import { QueryResult } from "pg";
import { TUser } from "../../interfaces/users.interface";
import { client } from "../../database";
import { AppError } from "../../error";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const createLoginService = async (payload: TLoginRequest): Promise<string> => {
  const queryString: string = `
        SELECT
            * 
        FROM 
            users 
        WHERE 
            email = $1;
    `;

  const queryResult: QueryResult<TUser> = await client.query(queryString, [
    payload.email,
  ]);

  const userExist: TUser = queryResult.rows[0];

  if (!userExist) {
    throw new AppError("Wrong email/password", 401);
  }

  if (!userExist.active) {
    throw new AppError("Wrong email/password", 401);
  }

  const comparePassword: boolean = await bcrypt.compare(
    payload.password,
    userExist.password
  );

  if (!comparePassword) {
    throw new AppError("Wrong email/password", 401);
  }

  const token: string = jwt.sign(
    {
      email: userExist.email,
    },
    process.env.SECRET_KEY!,
    {
      subject: userExist.id.toString(),
      expiresIn: process.env.EXPIRES_IN,
    }
  );

  return token;
};

export default createLoginService;
