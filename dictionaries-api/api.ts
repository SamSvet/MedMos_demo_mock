import { Request, Response } from "express";
import { Paths } from "../share/constants";
import { respond as directoryGetValueRespond } from "./directory-get-value";

const respond = (req: Request, resp: Response) => {
  const { method } = req.body;
  switch (method) {
    case "directory-get-value":
      directoryGetValueRespond(req, resp);
      break;
    default:
      break;
  }
};

export default {
  path: Paths.DICTIONARIES,
  method: "POST",
  respond,
};
