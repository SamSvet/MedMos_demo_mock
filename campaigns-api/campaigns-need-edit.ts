import { Request, Response } from "express";
import { CAMPAIGNS, WRONG_CAMPAIGNS } from "../data/campaigns/campaign-list";
import { USERS } from "../data/users/users";
import { checkStatusAccess } from "../share/check-status-access";
import { getErrorModal, ErrorCode, CampaignStatus } from "../share/constants";
import { Campaign } from "../share/interfaces";
import { getRandomItem } from "../share/get-random-items-from-array";
import { createErrorResponse } from "../share/response";
import {
  campaignsListResponse,
  respond as campaignListRespond,
} from "./campaigns-list";

const user = getRandomItem(USERS);

const campaignsNeedEditResponse = (
  id: string,
  params: any,
  req: Request,
  resp: Response
) => {
  const foundCampaign = CAMPAIGNS.find(
    (x) => x.campaign_id == params.campaigns.campaign_id
  ) as Campaign;

  if (!foundCampaign) {
    const { code, modal } = getErrorModal(ErrorCode.NOT_FOUND)!;
    return createErrorResponse(
      id,
      code,
      "Объект не существует. Возможно, он был удалён.",
      modal
    );
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
      foundCampaign.campaign_status_cd as CampaignStatus,
      CampaignStatus.NEED_EDIT
    )
  ) {
    const { code, modal } = getErrorModal(ErrorCode.INVALID_OPERATION)!;
    return createErrorResponse(
      id,
      code,
      "Операция не может быть выполнена с записью в этом статусе",

      modal
    );
  }
  foundCampaign.campaign_status_cd = CampaignStatus.NEED_EDIT;
  foundCampaign.approve_note = params.approve_note;

  return campaignListRespond(req, resp);
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = campaignsNeedEditResponse(id, params, req, resp);
  resp.json(responseBody);
};
