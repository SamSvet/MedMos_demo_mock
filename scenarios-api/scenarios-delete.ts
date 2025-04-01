import { Request, Response } from "express";
import { v4 } from "uuid";
import { CAMPAIGNS } from "../data/campaigns/campaign-list";
import {
  validateCampaign,
  getCampaignsListDict,
} from "../data/campaigns/campaign-utils";
import { SCENARIOS } from "../data/scenarios/scenarios";
import { TAGS } from "../data/tags/tags";
import {
  CampaignStatus,
  getErrorModal,
  ErrorCode,
  Screen,
} from "../share/constants";
import { Campaign, Scenario } from "../share/interfaces";
import {
  createErrorResponse,
  createResponse,
  DELTA_ACTION,
} from "../share/response";
import { sanitize } from "../share/sanitize";
import { currentDate } from "../share/utils";

const scenariosDeleteResponse = (id: string, params: any) => {
  const { scenarios, campaigns } = params;

  const necessaryScenarioDelete = SCENARIOS.find(
    (sc) => sc.base_scenario_id == scenarios.base_scenario_id
  ) as Scenario;
  const scenarioIndex = SCENARIOS.indexOf(necessaryScenarioDelete);
  SCENARIOS.splice(scenarioIndex, 1);

  const findScenarios = SCENARIOS.filter(
    (sc) => sc.campaign_id == campaigns.campaign_id
  );

  /// поиск кампании
  const prevCampaignData = CAMPAIGNS.find(
    (camp) => camp.campaign_id == campaigns.campaign_id
  ) as Campaign;
  const index = CAMPAIGNS.indexOf(prevCampaignData);
  const updatedCampaignData = {
    ...prevCampaignData,
    ...campaigns,
    status_updated: currentDate(),
    updated: currentDate(),
    campaign_status_cd: CampaignStatus.EDIT,
  };

  updatedCampaignData.tags = updatedCampaignData.tags.map((tagName: string) => {
    const foundTag = TAGS.find((t) => t.name === tagName);
    if (foundTag) return foundTag.id;
    const newTagId = v4();
    TAGS.push({ name: tagName, id: newTagId });
    return newTagId;
  });

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
    screen: Screen.CAMPAIGNS_EDIT,
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = scenariosDeleteResponse(id, params);
  resp.json(responseBody);
};
