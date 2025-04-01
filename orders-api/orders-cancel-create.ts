import { Request, Response } from "express";
import { respond as orederListRespond } from "./orders-list";

const ordersCancelCreateResponse = (
  id: string,
  params: any,
  req: Request,
  resp: Response
) => {
  return orederListRespond(req, resp);
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = ordersCancelCreateResponse(id, params, req, resp);
  resp.json(responseBody);
};
