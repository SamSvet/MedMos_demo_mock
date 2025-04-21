import { Request, Response } from "express";
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
import { Campaign, Scenario } from "../share/interfaces";
import {
  createErrorResponse,
  createResponse,
  DELTA_ACTION,
} from "../share/response";
import { sanitize } from "../share/sanitize";
import { currentDate, randomString } from "../share/utils";
import { v4 } from "uuid";

const scenariosCreateResponse = (id: string, params: any) => {
  const { scenarios } = params;

  const campaign_id = scenarios.campaign_id;
  const findScenarios: Scenario[] = [];

  const scenario_id = v4();

  const updatedScenarioData = {
    ...scenarios,
    campaign_id,
    scenario_id,
    base_scenario_id: scenario_id,
    scenario_status_cd: CampaignStatus.NEW,
    created: currentDate(),
    updated: currentDate(),
    scenario_version: 1,
    sas_camp_code: randomString(5),
  };

  //проверка на bad_params атрибутов сценария
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

  SCENARIOS.push(updatedScenarioData);

  // поиск нужных сценариев
  SCENARIOS.forEach((scenario) => {
    if (scenario?.campaign_id !== campaign_id) return;
    findScenarios.push(scenario);
  });

  // поиск кампании
  const findCampaign = CAMPAIGNS.find(
    (camp) => camp.campaign_id == campaign_id
  ) as Campaign;

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
  const responseBody = scenariosCreateResponse(id, params);
  resp.json(responseBody);
};
