import { Request, Response } from "express";
import { Campaign, Scenario } from "../share/interfaces";
import { CAMPAIGNS } from "../data/campaigns/campaign-list";
import {
  validateScenario,
  getCampaignsListDict,
} from "../data/campaigns/campaign-utils";
import { SCENARIOS } from "../data/scenarios/scenarios";
import {
  CampaignStatus,
  getErrorModal,
  ErrorCode,
  Screen,
} from "../share/constants";
import {
  createErrorResponse,
  createResponse,
  DELTA_ACTION,
} from "../share/response";
import { sanitize } from "../share/sanitize";
import { currentDate } from "../share/utils";

const scenariosUpdateResponse = (id: string, params: any) => {
  const { scenarios, campaigns } = params;

  const scenario_status_cd = CampaignStatus.NEW;
  const status_updated = currentDate();
  const updated = currentDate();

  /// поиск сценария
  const prevScenarioData = SCENARIOS.find(
    (sc) => sc.scenario_id == scenarios.scenario_id
  ) as Scenario;
  const index = SCENARIOS.indexOf(prevScenarioData);
  const updatedScenarioData = {
    ...prevScenarioData,
    ...scenarios,
    updated: currentDate(),
    status_updated: currentDate(),
  };

  // проверка на bad_params атрибутов сценария
  const badParamsScenario = validateScenario(updatedScenarioData);
  if (!!badParamsScenario) {
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
          scenarios: [sanitize({ ...badParamsScenario })],
        },
      },
    };
  }

  SCENARIOS[index] = updatedScenarioData;

  // поиск кампании
  const findCampaign = CAMPAIGNS.find(
    (camp) => camp.base_campaign_id == campaigns.base_campaign_id
  ) as Campaign;

  //  поиск всех сценариев
  const findScenarios = SCENARIOS.filter(
    (scenario) => scenario.campaign_id == findCampaign.campaign_id
  );

  const data = {
    campaigns: [findCampaign],
    scenarios: findScenarios,
    ...getCampaignsListDict([findCampaign]),
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
  const responseBody = scenariosUpdateResponse(id, params);
  resp.json(responseBody);
};
