import { Request, Response } from "express";
import { v4 } from "uuid";
import { CAMPAIGNS } from "../data/campaigns/campaign-list";
import {
  validateCampaign,
  validateScenarios,
  getCampaignsListDict,
} from "../data/campaigns/campaign-utils";
import { SCENARIOS } from "../data/scenarios/scenarios";
import { TAGS } from "../data/tags/tags";
import {
  getErrorModal,
  ErrorCode,
  CampaignStatus,
  Screen,
} from "../share/constants";
import {
  createErrorResponse,
  createResponse,
  DELTA_ACTION,
} from "../share/response";
import { sanitize } from "../share/sanitize";
import { currentDate } from "../share/utils";

const campaignUpdateApproveResponse = (id: string, params: any) => {
  const { campaigns } = params;

  const prevCampaignData = CAMPAIGNS.find(
    (camp) => camp.campaign_id == campaigns.campaign_id
  );

  if (!prevCampaignData) {
    const { code, modal, message } = getErrorModal(ErrorCode.NOT_FOUND)!;
    return createErrorResponse(id, code, message, modal);
  }

  const index = CAMPAIGNS.indexOf(prevCampaignData);
  const updatedCampaignData = {
    ...prevCampaignData,
    ...campaigns,
    updated: currentDate(),
    campaign_status_cd: CampaignStatus.EDIT,
    status_updated: currentDate(),
  };

  updatedCampaignData.tags = updatedCampaignData.tags.map((tagName: string) => {
    const foundTag = TAGS.find((t) => t.name === tagName);
    if (foundTag) return foundTag.id;
    const newTagId = v4();
    TAGS.push({ name: tagName, id: newTagId });
    return newTagId;
  });

  const badParamsCampaign = validateCampaign(updatedCampaignData);
  if (!!badParamsCampaign) {
    const { code, modal, popup } = getErrorModal(
      ErrorCode.BAD_PARAMS,
      "modal"
    )!;
    const errResponse = createErrorResponse(
      id,
      code,
      "Please check that the form is filled out correctly.",
      modal,
      popup
    );
    return {
      ...errResponse,
      result: {
        ...errResponse.result,
        bad_attributes: {
          campaigns: [badParamsCampaign].filter(Boolean),
          scenarios: [],
        },
      },
    };
  }

  CAMPAIGNS[index] = updatedCampaignData;
  // Поиск необходимых сценариев
  const findScenarios = SCENARIOS.filter(
    (sc) => sc.campaign_id == campaigns.campaign_id
  );

  const badParamsScenarios = validateScenarios(findScenarios);
  if (!!badParamsScenarios) {
    const { code, modal, popup } = getErrorModal(
      ErrorCode.BAD_PARAMS,
      "modal"
    )!;
    const errResponse = createErrorResponse(
      id,
      code,
      "Please check that the form is filled out correctly.",
      modal,
      popup
    );
    return {
      ...errResponse,
      result: {
        ...errResponse.result,
        bad_attributes: {
          campaigns: [sanitize({ ...badParamsCampaign! })].filter(Boolean),
          scenarios: badParamsScenarios.filter(Boolean),
        },
      },
    };
  }

  const data = {
    campaigns: [updatedCampaignData],
    scenarios: findScenarios,
    ...getCampaignsListDict([updatedCampaignData]),
  };

  return createResponse({
    id,
    filter_data: null,
    screen_data: null,
    data,
    delta_action: DELTA_ACTION.OVERRIDE,
    screen: Screen.CAMPAIGNS_VIEW,
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = campaignUpdateApproveResponse(id, params);
  resp.json(responseBody);
};
