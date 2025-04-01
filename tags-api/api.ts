import { Request, Response } from "express";
import { Paths } from "../share/constants";
import { respond as tagsGetValueRespond } from "./tags-get-value";

const respond = (req: Request, resp: Response) => {
  const { method } = req.body;
  switch (method) {
    case "tags-get-value":
      tagsGetValueRespond(req, resp);
      break;
    default:
      break;
  }
};

export default {
  path: Paths.TAGS,
  method: "POST",
  respond,
};
