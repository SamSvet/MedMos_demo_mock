import { Request, Response } from "express";
import { v4 } from "uuid";
import {
  validateCampaign,
  getCampaignsListDict,
} from "../data/campaigns/campaign-utils";
import { SCENARIOS } from "../data/scenarios/scenarios";
import { TAGS } from "../data/tags/tags";
import {
  getErrorModal,
  ErrorCode,
  CampaignStatus,
  Screen,
} from "../share/constants";
import {
  createErrorResponse,
  DELTA_ACTION,
  createResponse,
} from "../share/response";
import { sanitize } from "../share/sanitize";
import { currentDate } from "../share/utils";
import { CAMPAIGNS } from "../data/campaigns/campaign-list";
import { ORDERS } from "../data/orders/orders";
import {
  getOrdersListDict,
  validateOrder,
  validatePositions,
} from "../data/orders/order-utils";
import { POSITIONGROUPS, POSITIONS } from "../data/positions/positions";
import { PositionItemGrouped2 } from "../share/interfaces";
import { getOrderPositionsFilter } from "../data/positions/positions-utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
const orderUpdateResponse = (id: string, params: any) => {
  const { orders } = params;

  const prevOrderData = ORDERS.find((o) => o.order_id == orders?.order_id);
  if (!prevOrderData) {
    const { code, modal, message } = getErrorModal(ErrorCode.NOT_FOUND)!;
    return createErrorResponse(id, code, message, modal);
  }

  //   export interface Order {
  //     order_id: string;
  //     order_name: string | null;
  //     order_manager: string | null;
  //     description: string | null;
  //     created?: string;
  //     created_by?: string | null;
  //     updated?: string;
  //     updated_by?: string | null;
  //     locked_till?: string | null;
  //   }

  const index = ORDERS.indexOf(prevOrderData);
  const updatedOrderData = {
    ...prevOrderData,
    ...orders,
    updated: currentDate(),
  };

  //   updatedCampaignData.tags = updatedCampaignData.tags.map((tagName: string) => {
  //     const foundTag = TAGS.find((t) => t.name === tagName);
  //     if (foundTag) {
  //       return foundTag.id;
  //     }
  //     const newTagId = v4();
  //     TAGS.push({ name: tagName, id: newTagId });
  //     return newTagId;
  //   });

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
      "Проверьте корректность заполнения формы.",
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

  const positions = POSITIONGROUPS.filter(
    (sc) => sc.order_id == orders.order_id
  );
  // const positions: PositionItemGrouped2[] = getOrderPositionsFilter(
  //   orders?.order_id
  // );

  const data = {
    orders: [updatedOrderData],
    positions: positions,
    ...getOrdersListDict([updatedOrderData], positions),
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
  const responseBody = orderUpdateResponse(id, params);
  resp.json(responseBody);
};
