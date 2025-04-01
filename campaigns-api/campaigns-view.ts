import { Request, Response } from "express";
import { CAMPAIGNS, WRONG_CAMPAIGNS } from "../data/campaigns/campaign-list";
import { ACTIVITY_GROUPS } from "../data/refbooks/activity-groups";
import { ACTIVITY_TYPES } from "../data/refbooks/activity-types";
import { CAMPAIGN_KINDS } from "../data/refbooks/campaign-kinds";
import { CAMPAIGN_STATUSES } from "../data/refbooks/campaign-statuses";
import { CHANNELS } from "../data/refbooks/channels";
import { MODEL_NAMES } from "../data/refbooks/model-names";
import { PRODUCTS } from "../data/refbooks/products";
import { SEGMENTS } from "../data/refbooks/segments";
import { UPLOADING_TYPES } from "../data/refbooks/uploading-types";
import { SCENARIOS } from "../data/scenarios/scenarios";
import { TAGS } from "../data/tags/tags";
import { TEAMS } from "../data/users/teams";
import { USERS } from "../data/users/users";
import { getErrorModal, ErrorCode, RefCode, Screen } from "../share/constants";
import {
  createErrorResponse,
  DELTA_ACTION,
  createResponse,
} from "../share/response";
import { campaignsListResponse } from "./campaigns-list";

const campaignViewResponse = (id: string, params: any) => {
  const { campaign_id } = params.campaigns;
  const campaign = CAMPAIGNS.find((x) => x.campaign_id === campaign_id);

  if (!campaign) {
    const { popup, message, code } = getErrorModal(
      ErrorCode.NOT_FOUND,
      "popup"
    )!;
    const listResp = campaignsListResponse(id, params);
    return {
      ...listResp,
      result: { ...listResp.result, popup, message, code },
    };
  }

  if (campaign.campaign_id === "system_error") {
    const { code, modal, message } = getErrorModal(ErrorCode.SYSTEM_ERROR)!;
    return createErrorResponse(id, code, message, modal);
  }
  const wrongCampaign = WRONG_CAMPAIGNS.find(
    (wrongCamp) => campaign.campaign_id === wrongCamp.campaign_id
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

  const scenarios = SCENARIOS.filter((el) => el.campaign_id === campaign_id);
  const dictionaries = {
    [RefCode.ACTIVITY_GROUP]: ACTIVITY_GROUPS.filter((x) =>
      campaign.activity_group_cd?.includes(x.internal_code)
    ),
    [RefCode.ACTIVITY_TYPE]: ACTIVITY_TYPES.filter((x) =>
      scenarios
        .map((scenario) => scenario.activity_type_cd)
        .includes(x.internal_code)
    ),
    [RefCode.CAMPAIGN_KIND]: CAMPAIGN_KINDS.filter((x) =>
      campaign.campaign_kind_cd?.includes(x.internal_code)
    ),
    [RefCode.USERS]: USERS.filter((x) =>
      [
        campaign.campaign_manager,
        campaign.updated_by,
        campaign.created_by,
      ].includes(x.id)
    ),
    [RefCode.TEAM]: TEAMS.filter((x) => campaign.team_cd?.includes(x.code)),
    [RefCode.TAGS]: TAGS.filter((x) => campaign.tags?.includes(x.id)),
    [RefCode.CAMPAIGN_STATUS]: CAMPAIGN_STATUSES.filter(
      (x) => campaign.campaign_status_cd == x.internal_code
    ),
    [RefCode.PRODUCT]: PRODUCTS.filter((x) =>
      scenarios
        .map((scenario) => scenario.product_cd)
        .flat()
        .includes(x.internal_code)
    ),
    [RefCode.CHANNEL]: CHANNELS.filter((x) =>
      scenarios
        .flatMap((scenario) => scenario.channel_cd)
        .includes(x.internal_code)
    ),
    [RefCode.SEGMENT]: SEGMENTS.filter((x) =>
      scenarios
        .map((scenario) => scenario.segment_cd)
        .flat()
        .includes(x.internal_code)
    ),
    [RefCode.UPLOADING_TYPE]: UPLOADING_TYPES.filter((x) =>
      scenarios
        .map((scenario) => scenario.uploading_type_cd)
        .includes(x.internal_code)
    ),
    [RefCode.MODEL]: MODEL_NAMES.filter((x) =>
      scenarios
        .flatMap((scenario) => scenario.model_cd)
        .includes(x.internal_code)
    ),
  };

  const data = {
    campaigns: [campaign],
    scenarios,
    ...dictionaries,
  };

  const screen = Screen.CAMPAIGNS_VIEW;
  const delta_action = DELTA_ACTION.OVERRIDE;

  return createResponse({
    id,
    filter_data: null,
    screen_data: null,
    data,
    delta_action,
    screen,
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = campaignViewResponse(id, params);
  resp.json(responseBody);
};