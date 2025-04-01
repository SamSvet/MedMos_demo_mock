import { Request, Response } from "express";
import { ORDERS } from "../data/orders/orders";
import {
  validateOrder,
  validatePositions,
  getOrdersListDict,
} from "../data/orders/order-utils";
import { POSITIONGROUPS } from "../data/positions/positions";
import { getErrorModal, ErrorCode, Screen } from "../share/constants";

import {
  createErrorResponse,
  DELTA_ACTION,
  createResponse,
} from "../share/response";
import { ordersListResponse } from "./orders-list";

const orderShowEditResponse = (id: string, params: any) => {
  const { screen_data, filter_data } = params;
  const { order_id } = params.orders;
  const order = ORDERS.find((x) => x.order_id === order_id);
  if (!order) {
    const { code, modal, message } = getErrorModal(ErrorCode.NOT_FOUND)!;
    return createErrorResponse(id, code, message, modal);
  }

  if (order.order_id === "locked_order") {
    const { code, modal, message } = getErrorModal(ErrorCode.LOCKED)!;
    return createErrorResponse(id, code, message, modal);
  }

  if (order.order_id === "notfound_order") {
    const { modal: popup, message } = getErrorModal(ErrorCode.NOT_FOUND)!;
    const r = ordersListResponse(id, params);
    return {
      ...r,
      result: {
        ...r.result,
        popup,
        message,
      },
    };
  }

  const positions = POSITIONGROUPS.filter((pos) => pos.order_id === order_id);
  // const positions: PositionItemGrouped2[] = getOrderPositionsFilter(order_id);

  // проверка на bad_params атрибутов кампании
  const badParamsOrder = validateOrder(order);
  const badParamsPositions = validatePositions(positions);

  const locked_till = new Date();
  locked_till.setHours(locked_till.getHours() + 3);
  locked_till.setMinutes(locked_till.getMinutes() + 1);

  const data = {
    orders: [{ ...order, locked_till: locked_till.toISOString() }],
    positions,
    ...getOrdersListDict([order], positions),
  };
  const screen = Screen.ORDERS_EDIT;
  const delta_action = DELTA_ACTION.OVERRIDE;

  return createResponse({
    id,
    filter_data,
    screen_data,
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
  const responseBody = orderShowEditResponse(id, params);
  resp.json(responseBody);
};
