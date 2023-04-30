import { z } from "zod";

import {
  requestUserSchema,
  responseUserSchema,
  updateUserSchema,
  userSchema,
} from "../schemas/users.schema";

type TUser = z.infer<typeof userSchema>;

type TUserRequest = z.infer<typeof requestUserSchema>;

type TUserResponse = z.infer<typeof responseUserSchema>;

type TUserUpdated = z.infer<typeof updateUserSchema>;

export { TUser, TUserRequest, TUserResponse, TUserUpdated };
