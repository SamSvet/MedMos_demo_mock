import { Request, Response } from "express";
import { CAMPAIGNS, WRONG_CAMPAIGNS } from "../data/campaigns/campaign-list";
import { checkStatusAccess } from "../share/check-status-access";
import { getErrorModal, ErrorCode, CampaignStatus } from "../share/constants";
import { createErrorResponse } from "../share/response";
import {
  campaignsListResponse,
  respond as campaignListRespond,
} from "./campaigns-list";

const campaignsDeactivateResponse = (
  id: string,
  params: any,
  req: Request,
  resp: Response
) => {
  const foundCampaign = CAMPAIGNS.find(
    (x) => x.campaign_id == params.campaigns.campaign_id
  );

  if (!foundCampaign) {
    const { code, modal, message } = getErrorModal(ErrorCode.NOT_FOUND)!;
    const listResponse = campaignsListResponse(id, params);
    return {
      ...listResponse,
      result: {
        ...listResponse.result,
        popup: modal,
        code,
        message,
      },
    };
  }
  if (foundCampaign.campaign_id === "locked_campaign") {
    const { code, modal, message } = getErrorModal(ErrorCode.LOCKED)!;
    return createErrorResponse(id, code, message, modal);
  }
  if (foundCampaign.campaign_id === "system_error") {
    const { code, modal, message } = getErrorModal(ErrorCode.SYSTEM_ERROR)!;
    return createErrorResponse(id, code, message, modal);
  }
  const wrongCampaign = WRONG_CAMPAIGNS.find(
    (wrongCamp) => foundCampaign.campaign_id === wrongCamp.campaign_id
  );
  if (!!wrongCampaign) {
    const listResp = campaignsListResponse(id, params);
    const { code, modal, message, popup } = getErrorModal(
      wrongCampaign.popup,
      "popup"
    )!;
    return {
      ...listResp,
      result: { ...listResp.result, modal, popup, message, code },
    };
  }

  if (
    !checkStatusAccess(
      foundCampaign.campaign_status_cd as unknown as CampaignStatus,
      CampaignStatus.DEACTIVATE
    )
  ) {
    const { code, modal, message } = getErrorModal(
      ErrorCode.INVALID_OPERATION
    )!;
    return createErrorResponse(id, code, message, modal);
  }

  foundCampaign.campaign_status_cd = CampaignStatus.DEACTIVATE;
  foundCampaign.close_reason = params.close_reason;

  return campaignListRespond(req, resp);
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = campaignsDeactivateResponse(id, params, req, resp);
  resp.json(responseBody);
};
