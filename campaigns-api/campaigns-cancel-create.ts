import { Request, Response } from "express";
import { respond as campaignListRespond } from "./campaigns-list";

const campaignsCancelCreateResponse = (
  id: string,
  params: any,
  req: Request,
  resp: Response
) => {
  return campaignListRespond(req, resp);
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = campaignsCancelCreateResponse(id, params, req, resp);
  resp.json(responseBody);
};
