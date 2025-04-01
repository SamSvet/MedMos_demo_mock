import { Request, Response } from "express";
import { USERS } from "../data/users/users";
import { DELTA_ACTION, createResponse } from "../share/response";

const usersGetInfo = (id: string, params: unknown) => {
  const currentUsers = USERS[0];

  const data = { users: [currentUsers] };
  const delta_action = DELTA_ACTION.OVERRIDE;
  return createResponse({ id, data, delta_action });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;

  const responseBody = usersGetInfo(id, params);

  resp.json(responseBody);
};