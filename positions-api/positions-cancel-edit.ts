import { Request, Response } from "express";
import { respond as orderViewRespond } from "../orders-api/orders-view";

const positionsCancelEditResponse = (
  id: string,
  params: any,
  req: Request,
  resp: Response
) => {
  return orderViewRespond(req, resp);
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = positionsCancelEditResponse(id, params, req, resp);
  resp.json(responseBody);
};
