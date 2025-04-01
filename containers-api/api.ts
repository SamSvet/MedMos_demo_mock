import { Request, Response } from "express";
import { Paths } from "../share/constants";
import { respond as containersGetValueRespond } from "./containers-get-value";
import { respond as containersCreateRespond } from "./containers-create";

const respond = (req: Request, resp: Response) => {
  const { method } = req.body;
  switch (method) {
    case "containers-get-value":
      containersGetValueRespond(req, resp);
      break;
    case "containers-create":
      containersCreateRespond(req, resp);

      break;
    default:
      break;
  }
};

export default {
  path: Paths.CONTAINERS,
  method: "POST",
  respond,
};
