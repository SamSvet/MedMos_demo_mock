import { Request, Response } from "express";
import {
  getErrorModal,
  ErrorCode,
  Screen,
  RefCodeOrder,
} from "../share/constants";
import {
  createErrorResponse,
  createResponse,
  DELTA_ACTION,
} from "../share/response";
import { sanitize } from "../share/sanitize";
import { currentDate } from "../share/utils";
import { ORDERS } from "../data/orders/orders";
import { POSITIONGROUPS } from "../data/positions/positions";
import { COLORS } from "../data/refbooks/colors";
import { POSITION_ITEM_STATUS } from "../data/refbooks/position-item-status";
import { CONTAINERS } from "../data/refbooks/containers";
import { MODELS } from "../data/refbooks/models";
import { validateOrder } from "../data/orders/order-utils";
import { CONTAINERS as CONT } from "../data/containers/containers";

/* eslint-disable @typescript-eslint/no-explicit-any */
const positionsShowReserveResponse = (id: string, params: any) => {
  const { positions, orders } = params;

  const updated = currentDate();

  const prevOrderData = ORDERS.find((ord) => ord.order_id == orders.order_id);

  const index = ORDERS.indexOf(prevOrderData);
  const updatedOrderData = {
    ...prevOrderData,
    ...orders,
    updated,
  };

  const badParamsOrder = validateOrder(updatedOrderData);
  if (!!badParamsOrder) {
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
        bad_attributes: { orders: [sanitize({ ...badParamsOrder })] },
      },
    };
  }

  ORDERS[index] = updatedOrderData;

  const positionsFound = POSITIONGROUPS.filter(
    (pos) =>
      pos.position_id == positions.position_id &&
      pos.position_item_id == positions.position_item_id
  );

  const dictionaries = {
    [RefCodeOrder.COLOR]:
      COLORS.filter((x) =>
        positionsFound.map((p) => p.color).includes(x.internal_code)
      ) || [],
    [RefCodeOrder.POSITION_STATUS]:
      POSITION_ITEM_STATUS.filter((x) =>
        positionsFound.map((p) => p.status).includes(x.internal_code)
      ) || [],
    [RefCodeOrder.CONTAINER]:
      CONTAINERS.filter((x) =>
        positionsFound.flatMap((p) => p.container).includes(x.internal_code)
      ) || [],
    [RefCodeOrder.MODEL]:
      MODELS.filter((x) =>
        positionsFound.map((p) => p.model_id).includes(x.internal_code)
      ) || [],
    containers:
      CONT.filter((x) =>
        positionsFound.flatMap((p) => p.container).includes(x.id)
      ) || [],
  };

  const data = {
    positions: positionsFound,
    ...dictionaries,
    // ...getOrdersListDict([updatedOrderData], [positions]),
  };

  return createResponse({
    id,
    filter_data: null,
    screen_data: null,
    data,
    delta_action: DELTA_ACTION.OVERRIDE,
    screen: Screen.POSITIONS_RESERVE,
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = positionsShowReserveResponse(id, params);
  resp.json(responseBody);
};
