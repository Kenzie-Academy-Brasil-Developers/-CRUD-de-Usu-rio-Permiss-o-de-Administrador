import { Request, Response } from "express";
import { TLoginRequest, TLoginResponse } from "../interfaces/login.interfaces";
import createLoginService from "../services/login/createLogin.service";

const createLoginController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const payload: TLoginRequest = req.body;
  const token = await createLoginService(payload);

  return res.status(200).json({ token });
};

export { createLoginController };
