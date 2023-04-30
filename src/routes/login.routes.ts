import { Router } from "express";
import { createLoginController } from "../controllers/login.controllers";
import ensureBodyIsValidMiddleware from "../middlewares/ensureBodyIsValid.middleware";
import { requestLoginSchema } from "../schemas/login.schemas";

const loginRoutes = Router();

loginRoutes.post(
  "",
  ensureBodyIsValidMiddleware(requestLoginSchema),
  createLoginController
);

export default loginRoutes;
