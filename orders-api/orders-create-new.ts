import { Request, Response } from "express";
import { v4 } from "uuid";
import { ORDERS } from "../data/orders/orders";
import { validateOrder, getOrdersListDict } from "../data/orders/order-utils";
import { getErrorModal, ErrorCode, Screen } from "../share/constants";
import {
  createErrorResponse,
  DELTA_ACTION,
  createResponse,
} from "../share/response";
import { sanitize } from "../share/sanitize";
import { currentDate } from "../share/utils";
import { POSITIONGROUPS } from "../data/positions/positions";

const ordersCreateNewResponse = (id: string, params: any) => {
  const { screen_data, filter_data } = params;
  const order = params.orders;

  let neworder;

  const order_id = v4();
  const created = currentDate();
  const updated = currentDate();

  if (order.order_name === "systemError") {
    const { code, modal, message } = getErrorModal(ErrorCode.SYSTEM_ERROR)!;
    return createErrorResponse(id, code, message, modal);
  }

  const badParamsorder = validateOrder(order);
  if (!!badParamsorder) {
    const { code, modal, popup } = getErrorModal(
      ErrorCode.BAD_PARAMS,
      "popup"
    )!;
    const errResponse = createErrorResponse(
      id,
      code,
      "Check that the form is filled out correctly",
      modal,
      popup
    );
    return {
      ...errResponse,
      result: {
        ...errResponse.result,
        bad_attributes: { orders: [sanitize({ ...badParamsorder })] },
      },
    };
  }

  neworder = {
    ...order,
    order_id,
    created,
    updated,
  };

  ORDERS.push(neworder);
  const data = {
    orders: [neworder],
    ...getOrdersListDict([neworder], POSITIONGROUPS),
  };

  const screen = Screen.ORDERS_SHOW;
  const delta_action = DELTA_ACTION.OVERRIDE;

  return createResponse({
    id,
    filter_data,
    screen_data,
    data,
    delta_action,
    screen,
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = ordersCreateNewResponse(id, params);
  resp.json(responseBody);
};
