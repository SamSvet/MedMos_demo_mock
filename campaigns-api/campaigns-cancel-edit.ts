import { Request, Response } from "express";
import { respond as campaignViewRespond } from "./campaigns-view";

const campaignsCancelEditResponse = (
  id: string,
  params: any,
  req: Request,
  resp: Response
) => {
  return campaignViewRespond(req, resp);
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = campaignsCancelEditResponse(id, params, req, resp);
  resp.json(responseBody);
};
