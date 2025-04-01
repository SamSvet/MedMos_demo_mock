import { Request, Response } from "express";
import { createResponse, DELTA_ACTION } from "../share/response";

const campaignsLockProlongResponse = (id: string, params: any) => {
  const locked_till = new Date();
  locked_till.setHours(locked_till.getHours() + 3);
  locked_till.setSeconds(locked_till.getSeconds() + 10);
  return createResponse({
    id,
    filter_data: null,
    screen_data: null,
    data: {
      campaigns: [
        {
          campaign_id: params.campaigns.campaign_id,
          locked_by: "unknown",
          locked_till: locked_till.toISOString(),
        },
      ],
    },
    delta_action: DELTA_ACTION.MERGE,
    screen: null,
    delta: {},
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = campaignsLockProlongResponse(id, params);
  resp.json(responseBody);
};
