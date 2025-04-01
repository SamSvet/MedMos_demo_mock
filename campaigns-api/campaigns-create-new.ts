import { Request, Response } from "express";
import { v4 } from "uuid";
import { CAMPAIGNS } from "../data/campaigns/campaign-list";
import {
  validateCampaign,
  getCampaignsListDict,
} from "../data/campaigns/campaign-utils";
import { TAGS } from "../data/tags/tags";
import {
  CampaignStatus,
  getErrorModal,
  ErrorCode,
  Screen,
} from "../share/constants";
import {
  createErrorResponse,
  DELTA_ACTION,
  createResponse,
} from "../share/response";
import { sanitize } from "../share/sanitize";
import { currentDate } from "../share/utils";

const campaignsCreateNewResponse = (id: string, params: any) => {
  const { screen_data, filter_data } = params;
  const campaign = params.campaigns;

  let newCampaign;

  const campaign_id = v4();
  const campaign_status_cd = CampaignStatus.NEW;
  const status_updated = currentDate();
  const created = currentDate();
  const updated = currentDate();
  const campaign_version = 1;

  if (campaign.campaign_name === "systemError") {
    const { code, modal, message } = getErrorModal(ErrorCode.SYSTEM_ERROR)!;
    return createErrorResponse(id, code, message, modal);
  }

  const badParamsCampaign = validateCampaign(campaign);
  if (!!badParamsCampaign) {
    const { code, modal, popup } = getErrorModal(
      ErrorCode.BAD_PARAMS,
      "popup"
    )!;
    const errResponse = createErrorResponse(
      id,
      code,
      "Проверьте корректность заполнения формы.",
      modal,
      popup
    );
    return {
      ...errResponse,
      result: {
        ...errResponse.result,
        bad_attributes: sanitize({ ...badParamsCampaign }),
      },
    };
  }

  newCampaign = {
    ...campaign,
    campaign_id,
    base_campaign_id: campaign_id,
    campaign_version,
    campaign_status_cd,
    status_updated,
    created,
    updated,
  };

  newCampaign.tags =
    newCampaign.tags?.map((tagName: string) => {
      const foundTag = TAGS.find((t) => t.name === tagName);
      if (foundTag) return foundTag.id;
      const newTagId = v4();
      TAGS.push({ name: tagName, id: newTagId });
      return newTagId;
    }) || null;

  CAMPAIGNS.push(newCampaign);
  const data = {
    campaigns: [newCampaign],
    ...getCampaignsListDict([newCampaign]),
  };

  const screen = Screen.CAMPAIGNS_EDIT;
  const delta_action = DELTA_ACTION.OVERRIDE;

  return createResponse({
    id,
    filter_data,
    screen_data,
    data,
    delta_action,
    screen,
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = campaignsCreateNewResponse(id, params);
  resp.json(responseBody);
};
