import { Request, Response } from "express";
import { getErrorModal, ErrorCode, Screen } from "../share/constants";
import {
  createErrorResponse,
  createResponse,
  DELTA_ACTION,
} from "../share/response";
import { sanitize } from "../share/sanitize";
import { POSITIONGROUPS } from "../data/positions/positions";
import {
  getOrdersListDict,
  getUpdatedPosition,
  validatePosition,
} from "../data/orders/order-utils";
import { ORDERS } from "../data/orders/orders";

const positionsUpdateResponse = (id: string, params: any) => {
  const { positions, orders } = params;

  const posBaseInd = POSITIONGROUPS.findIndex(
    (el) =>
      el.order_id == positions.order_id &&
      el.position_id == positions.position_id &&
      el.position_item_id == positions.position_item_id
  );

  const foundInd = POSITIONGROUPS.findIndex(
    (el) =>
      el.order_id == positions.order_id &&
      el.position_id == positions.position_id &&
      (positions.container[0]
        ? el.container[0] === positions.container[0]
        : el.container.length == 0) &&
      el.color === positions.color &&
      el.status === positions.status &&
      el.model_id === positions.model_id &&
      el.position_name === positions.position_name
  );

  const [updatedPositionData, updatedInd] = getUpdatedPosition(
    posBaseInd,
    positions,
    POSITIONGROUPS,
    foundInd
  );

  // проверка на bad_params атрибутов сценария
  const badParamsPosition = validatePosition(updatedPositionData);
  if (!!badParamsPosition) {
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
          positions: [sanitize({ ...badParamsPosition })],
        },
      },
    };
  }

  if (updatedInd >= 0) {
    POSITIONGROUPS[updatedInd] = updatedPositionData;
  } else {
    POSITIONGROUPS.push(updatedPositionData);
  }

  if ((updatedInd >= 0 && posBaseInd !== updatedInd) || updatedInd < 0) {
    POSITIONGROUPS[posBaseInd] = {
      ...POSITIONGROUPS[posBaseInd],
      count: POSITIONGROUPS[posBaseInd].count - Number(positions.count),
      reserved_count:
        POSITIONGROUPS[posBaseInd].reserved_count -
        Math.min(Number(positions.count), Number(positions.reserved_count)),
    };
    if (POSITIONGROUPS[posBaseInd].count == 0) {
      POSITIONGROUPS.splice(posBaseInd, 1);
    }
  }

  // removeCountZero(POSITIONGROUPS);
  // поиск кампании
  const findOrder = ORDERS.find((ord) => ord.order_id == orders.order_id);

  //  поиск всех сценариев
  const findPositions = POSITIONGROUPS.filter(
    (pos) => pos.order_id == findOrder.order_id
  );

  const data = {
    orders: [findOrder],
    positions: findPositions,
    ...getOrdersListDict([findOrder], findPositions),
  };

  return createResponse({
    id,
    filter_data: null,
    screen_data: null,
    data,
    delta_action: DELTA_ACTION.OVERRIDE,
    screen: Screen.ORDERS_SHOW,
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = positionsUpdateResponse(id, params);
  resp.json(responseBody);
};
