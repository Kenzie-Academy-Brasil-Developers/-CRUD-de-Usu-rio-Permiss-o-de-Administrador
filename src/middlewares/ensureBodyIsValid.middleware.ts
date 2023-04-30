import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
import { AppError } from "../error";

const ensureBodyIsValidMiddleware =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    if (Object.keys(req.body).length === 0) {
      throw new AppError("No data received.", 400);
    }

    const validatedBody = schema.parse(req.body);

    req.body = validatedBody;

    return next();
  };

export default ensureBodyIsValidMiddleware;
