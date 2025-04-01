import { Request, Response } from "express";
import {
  filterCampaigns,
  sortCampaigns,
  getCampaignsListDict,
} from "../data/campaigns/campaign-utils";
import { CAMPAIGNS } from "../data/campaigns/campaign-list";
import { SCENARIOS } from "../data/scenarios/scenarios";
import { getPage } from "../share/get-page";
import { ErrorCode, getErrorModal, Screen } from "../share/constants";
import { Campaign, Scenario, ScreenData } from "../share/interfaces";
import {
  createResponse,
  DELTA_ACTION,
  RESPONSE_STATUS,
} from "../share/response";
import { sanitize } from "../share/sanitize";

export const campaignsListResponse = (id: string, params: any) => {
  const { page, count: pageSize } = params.screen_data || {};

  const filteredList = filterCampaigns(CAMPAIGNS, params.filter_data);

  const pageData = getPage({
    allData: sortCampaigns(filteredList, params.filter_data?.ordering),
    page,
    pageSize,
  });

  let campaigns: Campaign[];
  let screen_data: ScreenData;
  if (!filteredList.length) {
    campaigns = [];
    screen_data = {
      page: 1,
      count: pageSize,
      pages: 1,
    };
  } else if (!pageData.success) {
    const firstPageData = getPage({
      allData: sortCampaigns(CAMPAIGNS, "-created"),
      page: 1,
      pageSize,
    });
    const { code, modal } = getErrorModal(ErrorCode.NO_PAGE)!;
    return createResponse({
      id,
      screen: Screen.CAMPAIGNS_LIST,
      response: RESPONSE_STATUS.OK,
      code,
      message: "Выбранная вами страница отсутствует.",
      popup: modal,
      delta: {},
      delta_action: DELTA_ACTION.OVERRIDE,
      ...(firstPageData.success && {
        data: {
          campaigns: firstPageData.items,
          ...getCampaignsListDict(firstPageData.items, params.filter_data),
        },
        screen_data: {
          page: firstPageData.page,
          count: pageSize,
          pages: firstPageData.pages,
        },
        filter_data: params.filter_data,
        screen: Screen.CAMPAIGNS_LIST,
      }),
    });
  } else {
    campaigns = pageData.items;
    screen_data = {
      page: pageData.page,
      count: pageSize,
      pages: pageData.pages,
    };
  }

  const campaignsID = campaigns.map((camp) => camp.campaign_id);
  const scenarios = SCENARIOS.filter((el: Scenario) =>
    campaignsID.includes(el.campaign_id!)
  );
  const data = {
    campaigns,
    scenarios,
    ...getCampaignsListDict(campaigns, params.filter_data),
  };
  const filter_data = sanitize(params.filter_data);
  const delta_action = DELTA_ACTION.OVERRIDE;
  const screen = Screen.CAMPAIGNS_LIST;
  const delta = sanitize(params.delta);

  return createResponse({
    id,
    filter_data,
    screen_data,
    data,
    delta_action,
    screen,
    delta,
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = campaignsListResponse(id, params);
  resp.json(responseBody);
};
