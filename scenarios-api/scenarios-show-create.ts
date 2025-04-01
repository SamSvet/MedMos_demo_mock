import { Request, Response } from "express";
import { v4 } from "uuid";
import { CAMPAIGNS } from "../data/campaigns/campaign-list";
import { SCENARIOS } from "../data/scenarios/scenarios";
import { validateCampaign } from "../data/campaigns/campaign-utils";
import { TAGS } from "../data/tags/tags";
import {
  CampaignStatus,
  getErrorModal,
  ErrorCode,
  Screen,
} from "../share/constants";
import { Campaign } from "../share/interfaces";
import {
  createErrorResponse,
  createResponse,
  DELTA_ACTION,
} from "../share/response";
import { sanitize } from "../share/sanitize";
import { currentDate } from "../share/utils";

const scenariosShowCreateResponse = (id: string, params: any) => {
  const campaign = params.campaigns;

  const status_updated = currentDate();
  const updated = currentDate();
  const campaign_status_cd = CampaignStatus.EDIT;

  /// поиск кампании
  const prevCampaignData = CAMPAIGNS.find(
    (camp) => camp.campaign_id == campaign.campaign_id
  ) as Campaign;
  const index = CAMPAIGNS.indexOf(prevCampaignData);
  const updatedCampaignData = {
    ...prevCampaignData,
    ...campaign,
    status_updated,
    updated,
    campaign_status_cd,
    // campaign_id: v4(),
  };

  updatedCampaignData.tags = updatedCampaignData.tags.map((tagName: string) => {
    const foundTag = TAGS.find((t) => t.name === tagName);
    if (foundTag) return foundTag.id;
    const newTagId = v4();
    TAGS.push({ name: tagName, id: newTagId });
    return newTagId;
  });

  const scenarios = SCENARIOS.filter(s => s.campaign_id === prevCampaignData.campaign_id);

  // проверка на bad_params атрибутов кампании
  const badParamsCampaign = validateCampaign(updatedCampaignData);
  if (!!badParamsCampaign) {
    const { code, modal, popup } = getErrorModal(
      ErrorCode.BAD_PARAMS,
      "modal"
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

  // обновление кампании
  CAMPAIGNS[index] = updatedCampaignData;

  return createResponse({
    id,
    filter_data: null,
    screen_data: null,
    data: {
      campaigns: [updatedCampaignData],
      scenarios: scenarios,
    },
    delta_action: DELTA_ACTION.OVERRIDE,
    screen: Screen.SCENARIOS_CREATE,
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = scenariosShowCreateResponse(id, params);
  resp.json(responseBody);
};