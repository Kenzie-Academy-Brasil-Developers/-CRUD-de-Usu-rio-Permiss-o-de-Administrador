import { Request, Response, NextFunction } from "express";
import { AppError } from "../error";

const ensureItIsAdminOrOwnerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const admin = res.locals.token.admin;

  if (!admin && Number(req.params.id) !== res.locals.token.id) {
    throw new AppError("Insufficient Permission", 403);
  }

  return next();
};

export default ensureItIsAdminOrOwnerMiddleware;
