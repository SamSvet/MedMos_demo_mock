import { Request, Response } from "express";
import {
  createResponse,
  DELTA_ACTION,
  RESPONSE_STATUS,
} from "../share/response";
import { sanitize } from "../share/sanitize";
import { getPage } from "../share/get-page";
import { ORDERS } from "../data/orders/orders";
import {
  filterContainers,
  filterOrders,
  filterPositions,
  getOrdersListDict,
  ordersCombinePositions,
  sortOrdersPositions,
} from "../data/orders/order-utils";
import {
  FilterDataOrder,
  OrderPositionGroups,
  Position,
  ScreenData,
} from "../share/interfaces";
import { ErrorCode, getErrorModal, Screen } from "../share/constants";
import { defaultPosition, POSITIONGROUPS } from "../data/positions/positions";
import { CONTAINERS } from "../data/containers/containers";

export const ordersListResponse = (id: string, params: any) => {
  const { page, count: pageSize } = params.screen_data || {};

  const filteredContainers = filterContainers(CONTAINERS, params.filter_data);

  const positions = POSITIONGROUPS.filter((el) =>
    filterPositions(el, params.filter_data)
  );

  const filteredList = filterOrders(
    ORDERS,
    params.filter_data,
    positions,
    defaultPosition
  );

  //const ordersID = filteredList.map((camp) => camp.order_id);

  const orderPositions = ordersCombinePositions(
    filteredList,
    positions,
    defaultPosition
  ).filter((el) =>
    params.filter_data.containers
      ? el.position.container.some((c) =>
          filteredContainers.map((cont) => cont.id).includes(c)
        )
      : true
  );

  // const orderPositions = ordersCombinePositions(
  //   filteredList,
  //   positions,
  //   defaultPosition
  // ).filter((el) => el.position.container);

  const pageData = getPage({
    allData: sortOrdersPositions(orderPositions, params.sort_data),
    page,
    pageSize,
  });

  let ordersList: OrderPositionGroups[];
  let screen_data: ScreenData;
  if (!filteredList.length) {
    ordersList = [];
    screen_data = {
      page: 1,
      count: pageSize,
      pages: 1,
      total: pageSize,
    };
  } else if (!pageData.success) {
    const firstPageData = getPage({
      allData: orderPositions,
      page: 1,
      pageSize,
    });
    const { code, modal } = getErrorModal(ErrorCode.NO_PAGE)!;
    return createResponse({
      id,
      screen: Screen.ORDERS_LIST,
      response: RESPONSE_STATUS.OK,
      code,
      message: "The page you selected is missing.",
      popup: modal,
      delta: {},
      delta_action: DELTA_ACTION.OVERRIDE,
      ...(firstPageData.success && {
        data: {
          orders: firstPageData.items,
          ...getOrdersListDict(
            firstPageData.items,
            POSITIONGROUPS,
            params.filter_data
          ),
        },
        screen_data: {
          page: firstPageData.page,
          count: pageSize,
          pages: firstPageData.pages,
          total: firstPageData.total,
        },
        filter_data: params.filter_data,
        screen: Screen.ORDERS_LIST,
      }),
    });
  } else {
    ordersList = pageData.items;
    screen_data = {
      page: pageData.page,
      count: pageSize,
      pages: pageData.pages,
      total: pageData.total,
    };
  }

  const data = {
    orderpos: ordersList,
    ...getOrdersListDict(
      ordersList.map((el) => el.order),
      POSITIONGROUPS,
      params.filter_data
    ),
  };
  const filter_data = sanitize(params.filter_data);
  const delta_action = DELTA_ACTION.OVERRIDE;
  const screen = Screen.ORDERS_LIST;
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
  const responseBody = ordersListResponse(id, params);
  resp.json(responseBody);
};
