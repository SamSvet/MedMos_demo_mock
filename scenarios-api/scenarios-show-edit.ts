import { Request, Response } from "express";
import { v4 } from "uuid";
import { CAMPAIGNS } from "../data/campaigns/campaign-list";
import { validateCampaign } from "../data/campaigns/campaign-utils";
import { ACTIVITY_TYPES } from "../data/refbooks/activity-types";
import { CAMPAIGN_STATUSES } from "../data/refbooks/campaign-statuses";
import { CHANNELS } from "../data/refbooks/channels";
import { MODEL_NAMES } from "../data/refbooks/model-names";
import { PRODUCTS } from "../data/refbooks/products";
import { SEGMENTS } from "../data/refbooks/segments";
import { UPLOADING_TYPES } from "../data/refbooks/uploading-types";
import { SCENARIOS } from "../data/scenarios/scenarios";
import { TAGS } from "../data/tags/tags";
import {
  CampaignStatus,
  getErrorModal,
  ErrorCode,
  RefCode,
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

/* eslint-disable @typescript-eslint/no-explicit-any */
const scenariosShowEditResponse = (id: string, params: any) => {
  const { scenarios, campaigns } = params;

  const status_updated = currentDate();
  const updated = currentDate();
  const campaign_status_cd = CampaignStatus.EDIT;

  /// поиск кампании
  const prevCampaignData = CAMPAIGNS.find(
    (camp) => camp.campaign_id == campaigns.campaign_id
  ) as Campaign;
  const index = CAMPAIGNS.indexOf(prevCampaignData);
  const updatedCampaignData = {
    ...prevCampaignData,
    ...campaigns,
    status_updated,
    updated,
    campaign_status_cd,
    // campaign_id: v4(),
  };

  updatedCampaignData.tags = updatedCampaignData.tags.map((tagName: string) => {
    const foundTag = TAGS.find((t) => t.name === tagName);
    if (foundTag) {
      return foundTag.id;
    }
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
      "Please check that the form is filled out correctly.",
      modal,
      popup
    );
    return {
      ...errResponse,
      result: {
        ...errResponse.result,
        bad_attributes: { campaigns: [sanitize({ ...badParamsCampaign })] },
      },
    };
  }

  // обновление кампании
  CAMPAIGNS[index] = updatedCampaignData;

  // поиск нужного сценария
  const scenario = SCENARIOS.find(
    (scenario) => scenario.base_scenario_id == scenarios.base_scenario_id
  );
  // console.log(scenario);

  const dictionaries = {
    [RefCode.ACTIVITY_TYPE]:
      ACTIVITY_TYPES.filter(
        (x) => scenario?.activity_type_cd === x.internal_code
      ) || [],
    [RefCode.CAMPAIGN_STATUS]:
      CAMPAIGN_STATUSES.filter((x) =>
        updatedCampaignData?.campaign_status_cd?.includes(x.internal_code)
      ) || [],
    [RefCode.PRODUCT]:
      PRODUCTS.filter((x) => scenario?.product_cd?.includes(x.internal_code)) ||
      [],
    [RefCode.CHANNEL]:
      CHANNELS.filter((x) => scenario?.channel_cd?.includes(x.internal_code)) ||
      [],
    [RefCode.SEGMENT]:
      SEGMENTS.filter((x) => scenario?.segment_cd?.includes(x.internal_code)) ||
      [],
    [RefCode.UPLOADING_TYPE]:
      UPLOADING_TYPES.filter(
        (x) => scenario?.uploading_type_cd === x.internal_code
      ) || [],
    [RefCode.MODEL]:
      MODEL_NAMES.filter((x) =>
        scenario?.model_cd?.includes(x.internal_code)
      ) || [],
  };

  const data = {
    scenarios: [scenario],
    ...dictionaries, // только справочники сценариев и статус кампании
  };

  return createResponse({
    id,
    filter_data: null,
    screen_data: null,
    data,
    delta_action: DELTA_ACTION.OVERRIDE,
    screen: Screen.SCENARIOS_EDIT,
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = scenariosShowEditResponse(id, params);
  resp.json(responseBody);
};
