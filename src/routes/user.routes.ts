import { Router } from "express";
import {
  createUsersController,
  deactivateUserController,
  listUsersController,
  recoverUserController,
  retrieveUsersProfileController,
  updateUsersController,
} from "../controllers/users.controllers";
import ensureEmailNotExistsMiddleware from "../middlewares/ensureEmailNotExists.middleware";
import ensureUserExistsMiddleware from "../middlewares/ensureUserExists.middleware";
import ensureBodyIsValidMiddleware from "../middlewares/ensureBodyIsValid.middleware";
import { requestUserSchema, updateUserSchema } from "../schemas/users.schema";
import ensureTokenIsValidMiddleware from "../middlewares/ensureTokenIsValid.middleware";
import ensureAdminExistsMiddleware from "../middlewares/ensureAdminExists.middleware";
import ensureItIsAdminOrOwnerMiddleware from "../middlewares/ensureIfItIsAdminOrOwner.middleware";
import ensureUserIsActiveMiddleware from "../middlewares/ensureUserIsActive.middleware";

const userRoutes: Router = Router();

userRoutes.post(
  "",
  ensureBodyIsValidMiddleware(requestUserSchema),
  ensureEmailNotExistsMiddleware,
  createUsersController
);

userRoutes.get(
  "",
  ensureTokenIsValidMiddleware,
  ensureAdminExistsMiddleware,
  listUsersController
);

userRoutes.get(
  "/:profile",
  ensureTokenIsValidMiddleware,
  retrieveUsersProfileController
);

userRoutes.patch(
  "/:id",
  ensureTokenIsValidMiddleware,
  ensureUserExistsMiddleware,
  ensureItIsAdminOrOwnerMiddleware,
  ensureBodyIsValidMiddleware(updateUserSchema),
  ensureEmailNotExistsMiddleware,
  updateUsersController
);

userRoutes.delete(
  "/:id",
  ensureTokenIsValidMiddleware,
  ensureUserExistsMiddleware,
  ensureItIsAdminOrOwnerMiddleware,
  deactivateUserController
);

userRoutes.put(
  "/:id/recover",
  ensureTokenIsValidMiddleware,
  ensureAdminExistsMiddleware,
  ensureUserIsActiveMiddleware,
  recoverUserController
);

export default userRoutes;
