import { Request, Response } from "express";
import { Paths } from "../share/constants";
import { respond as usersGetValueRespond } from "./users-get-value";
import { respond as usersGetTeamsRespond } from "./users-get-teams";
import { respond as usersGetInfo } from "./users-get-info";

const respond = (req: Request, resp: Response) => {
  const { method } = req.body;
  switch (method) {
    case "users-get-value":
      usersGetValueRespond(req, resp);
      break;
    case "users-get-teams":
      usersGetTeamsRespond(req, resp);
      break;
    case "users-get-info":
      usersGetInfo(req, resp);
      break;
    default:
      break;
  }
};

export default {
  path: Paths.USERS,
  method: "POST",
  respond,
};
