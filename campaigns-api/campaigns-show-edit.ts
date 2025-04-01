import { Request, Response } from "express";
import { CAMPAIGNS } from "../data/campaigns/campaign-list";
import {
  validateCampaign,
  validateScenarios,
  getCampaignsListDict,
} from "../data/campaigns/campaign-utils";
import { SCENARIOS } from "../data/scenarios/scenarios";
import { getErrorModal, ErrorCode, Screen } from "../share/constants";
import { Scenario } from "../share/interfaces";
import {
  createErrorResponse,
  DELTA_ACTION,
  createResponse,
} from "../share/response";
import { campaignsListResponse } from "./campaigns-list";

const campaignShowEditResponse = (id: string, params: any) => {
  const { screen_data, filter_data } = params;
  const { campaign_id } = params.campaigns;
  const campaign = CAMPAIGNS.find((x) => x.campaign_id === campaign_id);

  if (!campaign) {
    const { code, modal, message } = getErrorModal(ErrorCode.NOT_FOUND)!;
    return createErrorResponse(id, code, message, modal);
  }

  if (campaign.campaign_id === "locked_campaign") {
    const { code, modal, message } = getErrorModal(ErrorCode.LOCKED)!;
    return createErrorResponse(id, code, message, modal);
  }

  if (campaign.campaign_id === "notfound_campaign") {
    const { modal: popup, message } = getErrorModal(ErrorCode.NOT_FOUND)!;
    const r = campaignsListResponse(id, params);
    return {
      ...r,
      result: {
        ...r.result,
        popup,
        message,
      },
    };
  }

  const scenarios: Scenario[] = [];

  SCENARIOS.forEach((scenario) => {
    if (scenario?.campaign_id !== campaign?.campaign_id) return;
    scenarios.push(scenario);
  });

  // проверка на bad_params атрибутов кампании
  const badParamsCampaign = validateCampaign(campaign);
  const badParamsScenarios = validateScenarios(scenarios);

  const locked_till = new Date();
  locked_till.setHours(locked_till.getHours() + 3);
  locked_till.setMinutes(locked_till.getMinutes() + 1);

  const data = {
    campaigns: [{ ...campaign, locked_till: locked_till.toISOString() }],
    scenarios,
    ...getCampaignsListDict([campaign]),
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
    bad_attributes: {
      campaigns: [badParamsCampaign].filter(Boolean),
      scenarios: badParamsScenarios.filter(Boolean),
    },
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = campaignShowEditResponse(id, params);
  resp.json(responseBody);
};
