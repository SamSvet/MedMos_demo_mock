import { Request, Response } from "express";
import { getErrorModal, ErrorCode, Screen } from "../share/constants";
import {
  createErrorResponse,
  createResponse,
  DELTA_ACTION,
} from "../share/response";
import { sanitize } from "../share/sanitize";
import { currentDate } from "../share/utils";
import { ORDERS } from "../data/orders/orders";
import { POSITIONGROUPS } from "../data/positions/positions";
import { getOrdersListDict, validateOrder } from "../data/orders/order-utils";

const positionsShowCreateResponse = (id: string, params: any) => {
  const order = params.orders;

  const status_updated = currentDate();
  const updated = currentDate();
  //   const campaign_status_cd = CampaignStatus.EDIT;

  /// поиск кампании
  const prevOrderData = ORDERS.find((camp) => camp.order_id == order.order_id);
  const index = ORDERS.indexOf(prevOrderData);
  const updatedOrderData = {
    ...prevOrderData,
    ...order,
    status_updated,
    updated,
    // campaign_status_cd,
    // campaign_id: v4(),
  };

  //   updatedOrderData.tags = updatedOrderData.tags.map((tagName: string) => {
  //     const foundTag = TAGS.find((t) => t.name === tagName);
  //     if (foundTag) return foundTag.id;
  //     const newTagId = v4();
  //     TAGS.push({ name: tagName, id: newTagId });
  //     return newTagId;
  //   });

  const positions = POSITIONGROUPS.filter(
    (s) => s.order_id === prevOrderData.order_id
  );

  // проверка на bad_params атрибутов кампании
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
        bad_attributes: sanitize({ ...badParamsOrder }),
      },
    };
  }

  ORDERS[index] = updatedOrderData;

  return createResponse({
    id,
    filter_data: null,
    screen_data: null,
    data: {
      orders: [updatedOrderData],
      positions: positions,
      ...getOrdersListDict([updatedOrderData], positions),
    },
    delta_action: DELTA_ACTION.OVERRIDE,
    screen: Screen.POSITIONS_CREATE,
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const responseBody = positionsShowCreateResponse(id, params);
  resp.json(responseBody);
};
