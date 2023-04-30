import { Request, Response, NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { TUser, TUserResponse } from "../interfaces/users.interface";
import { AppError } from "../error";

const ensureUserExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const userId: number = parseInt(req.params.id);

  const queryString: string = `
        SELECT
            *
        FROM
            users
        WHERE
            id = $1;
   `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [userId],
  };
  const queryResult: QueryResult<TUserResponse> = await client.query(
    queryConfig
  );

  if (queryResult.rowCount === 0) {
    throw new AppError("User not found", 404);
  }

  return next();
};

export default ensureUserExistsMiddleware;
