import { Request, Response } from "express";
import {
  getOrdersListDict,
  validateOrder,
  validatePositions,
} from "../data/orders/order-utils";
import { ORDERS, WRONG_ORDERS } from "../data/orders/orders";
import {
  createErrorResponse,
  createResponse,
  DELTA_ACTION,
} from "../share/response";
import { ordersListResponse } from "./orders-list";
import { getErrorModal, ErrorCode, Screen } from "../share/constants";
import { POSITIONGROUPS } from "../data/positions/positions";

const orderViewResponse = (id: string, params: any) => {
  const { order_id } = params.orders;
  const order = ORDERS.find((x) => x.order_id === order_id);

  if (!order) {
    const { popup, message, code } = getErrorModal(
      ErrorCode.NOT_FOUND,
      "popup"
    )!;
    const listResp = ordersListResponse(id, params);
    return {
      ...listResp,
      result: { ...listResp.result, popup, message, code },
    };
  }

  if (order.order_id === "system_error") {
    const { code, modal, message } = getErrorModal(ErrorCode.SYSTEM_ERROR)!;
    return createErrorResponse(id, code, message, modal);
  }
  const wrongOrder = WRONG_ORDERS.find((wo) => order.order_id === wo.order_id);
  if (!!wrongOrder) {
    const listResp = ordersListResponse(id, params);
    const { code, modal, message, popup } = getErrorModal(
      wrongOrder.popup,
      "popup"
    )!;
    return {
      ...listResp,
      result: { ...listResp.result, modal, popup, message, code },
    };
  }

  const positions = POSITIONGROUPS.filter((el) => el.order_id === order_id);
  // const positions: PositionItemGrouped2[] = getOrderPositionsFilter(order_id);
  const badParamsOrder = validateOrder(order);
  const badParamsPositions = validatePositions(positions);
  const data = {
    orders: [order],
    positions,
    ...getOrdersListDict([order], positions),
  };
  const screen = Screen.ORDERS_SHOW;
  const delta_action = DELTA_ACTION.OVERRIDE;

  return createResponse({
    id,
    filter_data: null,
    screen_data: null,
    data,
    delta_action,
    screen,
    bad_attributes: {
      orders: [badParamsOrder].filter(Boolean),
      positions: badParamsPositions.filter(Boolean),
    },
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = orderViewResponse(id, params);
  resp.json(responseBody);
};
