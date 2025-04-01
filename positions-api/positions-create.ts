import { Request, Response } from "express";
import { CAMPAIGNS } from "../data/campaigns/campaign-list";
import {
  validateScenario,
  getCampaignsListDict,
} from "../data/campaigns/campaign-utils";
import { SCENARIOS } from "../data/scenarios/scenarios";
import {
  CampaignStatus,
  getErrorModal,
  ErrorCode,
  Screen,
  PositionStatus,
} from "../share/constants";
import {
  Campaign,
  Order,
  Position,
  PositionItem,
  PositionItemGrouped2,
  Scenario,
} from "../share/interfaces";
import {
  createErrorResponse,
  createResponse,
  DELTA_ACTION,
} from "../share/response";
import { sanitize } from "../share/sanitize";
import { currentDate, randomString } from "../share/utils";
import { v4 } from "uuid";
import {
  getOrdersListDict,
  validateOrder,
  validatePosition,
  validatePositionGroup,
  validatePositions,
} from "../data/orders/order-utils";
import { POSITIONGROUPS, POSITIONS } from "../data/positions/positions";
import { POSITION_ITEM_STATUS } from "../data/refbooks/position-item-status";
import { ORDERS } from "../data/orders/orders";
import { getOrderPositionsFilter } from "../data/positions/positions-utils";

const positionsCreateResponse = (id: string, params: any) => {
  const { positions } = params;

  //   const order_id = positions.order_id;
  //   const findPositions: PositionItem[] = [];

  const position_id = v4();

  const badParamsPosition = validatePositionGroup(positions);

  //   const updatedScenarioData = {
  //     ...positions,
  //     order_id,
  //     position_id,
  //     base_position_id: position_id,
  //     scenario_status_cd: CampaignStatus.NEW,
  //     created: currentDate(),
  //     updated: currentDate(),
  //     scenario_version: 1,
  //     sas_camp_code: randomString(5),
  //   };

  //проверка на bad_params атрибутов сценария
  //   const badParamsScenario = validateScenario(updatedScenarioData);
  if (!!badParamsPosition) {
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
        bad_attributes: {
          positions: [sanitize({ ...badParamsPosition })],
        },
      },
    };
  }

  // const newPos: PositionItem[] = new Array(Number(positions.count))
  //   .fill(0)
  //   .map((_) => ({
  //     position_item_id: v4(),
  //     position_id: position_id,
  //     order_id: positions.order_id,
  //     position_name: positions.position_name,
  //     color: positions.color,
  //     position_description: positions.position_description,
  //     model_id: positions.model_id,
  //     container: null,
  //     status: PositionStatus.NEW,
  //   }));

  POSITIONGROUPS.push({
    position_item_id: randomString(10),
    position_id: position_id,
    order_id: positions.order_id,
    position_name: positions.position_name,
    color: positions.color,
    position_description: positions.position_description,
    model_id: positions.model_id,
    container: positions.container,
    count: Number(positions.count),
    //plan_delivery_dt: positions.plan_delivery_dt,
    status: PositionStatus.NEW,
    reserved_count: 0,
  });

  // поиск нужных сценариев
  //   POSITIONS.forEach((pos) => {
  //     if (pos?.order_id !== order_id) return;
  //     findPositions.push(pos);
  //   });

  // const findPositions: PositionItem[] = POSITIONS.filter(
  //   (pos) => pos.order_id === positions.order_id
  // );

  // const findPositions: PositionItemGrouped2[] = getOrderPositionsFilter(
  //   positions.order_id
  // );
  const findPositions: Position[] = POSITIONGROUPS.filter(
    (pos) => pos.order_id === positions.order_id
  );

  // поиск кампании
  const findOrder = ORDERS.find(
    (ord) => ord.order_id === positions.order_id
  ) as Order;

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
  const responseBody = positionsCreateResponse(id, params);
  resp.json(responseBody);
};
