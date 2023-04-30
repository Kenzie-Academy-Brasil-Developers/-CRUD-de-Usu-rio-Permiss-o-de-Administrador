import { z } from "zod";
import {
  requestLoginSchema,
  responseLoginSchema,
} from "../schemas/login.schemas";

type TLoginRequest = z.infer<typeof requestLoginSchema>;

type TLoginResponse = z.infer<typeof responseLoginSchema>;

export { TLoginRequest, TLoginResponse };
