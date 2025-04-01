import { Request, Response } from "express";
import { Screen } from "../share/constants";
import { ScreenData } from "../share/interfaces";
import { createResponse, DELTA_ACTION } from "../share/response";
import { sanitize } from "../share/sanitize";

const campaignsShowCreateResponse = (id: string, params: any) => {
  const { screen_data, filter_data } = params;

  return createResponse({
    id,
    filter_data: sanitize(filter_data),
    screen_data: sanitize(screen_data) as unknown as ScreenData,
    data: {},
    delta_action: DELTA_ACTION.OVERRIDE,
    screen: Screen.CAMPAIGNS_CREATE,
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = campaignsShowCreateResponse(id, params);
  resp.json(responseBody);
};
