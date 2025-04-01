import { Request, Response } from "express";
import { respond as campaignShowEditRespond } from "../campaigns-api/campaigns-show-edit";

const scenariosCancelCreateResponse = (
  id: string,
  params: any,
  req: Request,
  resp: Response
) => {
  return campaignShowEditRespond(req, resp);
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = scenariosCancelCreateResponse(id, params, req, resp);
  resp.json(responseBody);
};
