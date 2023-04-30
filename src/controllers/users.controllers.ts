import { Request, Response } from "express";
import listUsersService from "../services/users/listUsers.service";
import updateUsersService from "../services/users/updateUsers.service";
import {
  TUserRequest,
  TUserResponse,
  TUserUpdated,
} from "../interfaces/users.interface";
import createUsersService from "../services/users/createUsers.service";
import retrieveUsersProfileService from "../services/users/retrieveUsersProfile.servise";
import recoverUserService from "../services/users/recoverUser.service";
import deleteUsersService from "../services/users/deleteUsers.service";

const createUsersController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const payload: TUserRequest = req.body;

  const newUser: TUserResponse = await createUsersService(payload);

  return res.status(201).json(newUser);
};

const listUsersController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const users: TUserResponse[] = await listUsersService();

  return res.status(200).json(users);
};

const retrieveUsersProfileController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId: number = res.locals.token.id;
  const user: TUserResponse = await retrieveUsersProfileService(userId);

  return res.json(user);
};

const updateUsersController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const userData: TUserUpdated = req.body;

  const updatedUser: TUserResponse = await updateUsersService(id, userData);

  return res.status(200).json(updatedUser);
};

const deactivateUserController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId: number = parseInt(req.params.id);
  const userToken: number = res.locals.token.id;

  const userData = await deleteUsersService(userId, userToken);

  return res.status(204).json(userData);
};

const recoverUserController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId: number = parseInt(req.params.id);

  const user: TUserResponse = await recoverUserService(userId);

  return res.status(200).json(user);
};

export {
  createUsersController,
  listUsersController,
  retrieveUsersProfileController,
  updateUsersController,
  deactivateUserController,
  recoverUserController,
};
