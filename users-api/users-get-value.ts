import { Request, Response } from "express";
import { createResponse, DELTA_ACTION } from "../share/response";
import { USERS } from "../data/users/users";

const usersGetValue = (id: string, substring: string) => {
  const currentUsers = USERS.filter((it) => {
    const name = (it.last_name || "").toLowerCase().trim();
    const search = (substring || "").toLowerCase().trim();
    return name.includes(search);
  });

  const data = { users: currentUsers };
  const delta_action = DELTA_ACTION.OVERRIDE;
  return createResponse({ id, data, delta_action });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const { users } = params;
  const { substring } = users;

  const responseBody = usersGetValue(id, substring);

  resp.json(responseBody);
};
