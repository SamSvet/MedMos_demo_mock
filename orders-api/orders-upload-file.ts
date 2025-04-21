import { Request, Response } from "express";
import { v4 } from "uuid";
import { ORDERS } from "../data/orders/orders";
import {
  getOrdersListDict,
  validateJsonFile,
  extendRefBook,
  validatePosition,
} from "../data/orders/order-utils";
import {
  getErrorModal,
  ErrorCode,
  Screen,
  PositionStatus,
} from "../share/constants";
import {
  createErrorResponse,
  DELTA_ACTION,
  createResponse,
} from "../share/response";
import { currentDate } from "../share/utils";
import { POSITIONGROUPS } from "../data/positions/positions";
import {
  Container,
  Order,
  OrderFile,
  Position,
  RefBook,
  User,
  UserFileFilter,
  orderFileSchema,
} from "../share/interfaces";
import { USERS } from "../data/users/users";
import { MODELS } from "../data/refbooks/models";
import { COLORS } from "../data/refbooks/colors";
import { CONTAINERS } from "../data/containers/containers";

const accumulatePosition = (acc: Map<string, Position>, cur: Position) => {
  const key = `${cur.order_id}-${cur.container[0]}-${cur.color}-${cur.status}-${cur.model_id}-${cur.position_name}`;
  const item =
    acc.get(key) ||
    Object.assign({}, cur, {
      count: 0,
      reserved_count: 0,
    });
  item.count += cur.count;
  item.reserved_count += cur.reserved_count;

  return acc.set(key, item);
};
const addNewUser = (fileManager: UserFileFilter): User => ({
  id: v4(),
  org_id: v4(),
  email_contact: null,
  is_active: true,
  is_email_confirmed: true,
  is_registered: true,
  email_contact_new: null,
  phone_contact: null,
  ...fileManager,
});

const addNewContainer = (fileRefCode: Omit<Container, "id">): Container => ({
  id: v4(),
  ...fileRefCode,
});

const addNewRef = (fileRefCode: Pick<RefBook, "name">): RefBook => ({
  internal_code: v4(),
  is_deleted: false,
  ...fileRefCode,
});

const ordersUploadFileResponse = (
  id: string,
  params: any,
  file: Express.Multer.File | null
) => {
  if (!file) {
    const { code, modal, popup } = getErrorModal(
      ErrorCode.BAD_PARAMS,
      "popup"
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
        bad_attributes: { orders: [{ file: "File is missing" }] },
      },
    };
  }
  const { screen_data, filter_data } = params;
  const order_id = v4();

  let validatedOrder: OrderFile;
  try {
    validatedOrder = validateJsonFile(file, orderFileSchema);
  } catch (e) {
    const { code, modal, popup } = getErrorModal(
      ErrorCode.BAD_PARAMS,
      "popup"
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
        bad_attributes: { orders: [{ file: [e.message] }] },
      },
    };
  }
  if (validatedOrder.name === "systemError") {
    const { code, modal, message } = getErrorModal(ErrorCode.SYSTEM_ERROR)!;
    return createErrorResponse(id, code, message, modal);
  }

  if (ORDERS.some((order) => order.order_name === validatedOrder.name)) {
    const { code, modal, popup } = getErrorModal(
      ErrorCode.BAD_PARAMS,
      "popup"
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
          orders: [{ file: ["An order with this name already exists"] }],
        },
      },
    };
  }

  const customFilter: UserFileFilter = { ...validatedOrder.manager };
  const manager = extendRefBook(
    USERS,
    { ...validatedOrder.manager },
    Object.keys(customFilter) as (keyof User)[],
    addNewUser
  );
  const modelid = extendRefBook(
    MODELS,
    { name: validatedOrder.order_position[0].model_number },
    ["name"],
    addNewRef
  );
  const colorid = extendRefBook(
    COLORS,
    { name: validatedOrder.order_position[0].colour.toLowerCase() },
    ["name"],
    addNewRef
  );

  const containerId = extendRefBook(
    CONTAINERS,
    {
      name: validatedOrder.order_position[0].container.name,
      plan_delivery_dt:
        validatedOrder.order_position[0].container.plan_delivery_dt,
    },
    ["name", "plan_delivery_dt"],
    addNewContainer
  );

  const neworder: Order = {
    order_id: order_id,
    order_name: validatedOrder.name,
    order_manager: manager.id,
    created: validatedOrder.create_date,
    updated: currentDate(),
    description: validatedOrder.description,
  };

  const newPositionGroups: Position[] = [
    ...validatedOrder.order_position
      .map((pos, index) => ({
        position_item_id: String(index),
        position_id: v4(),
        order_id: order_id,
        position_name: pos.articul_RU,
        color: colorid.internal_code,
        position_description: pos.description,
        model_id: modelid.internal_code,
        container: [containerId.id],
        count: pos.count,
        status: PositionStatus.NEW,
        reserved_count: pos.reserved_count
          ? Math.min(pos.reserved_count, pos.count)
          : 0,
      }))
      .reduce(accumulatePosition, new Map<string, Position>())
      .values(),
  ];

  // const updtPositions = newPositionGroups.map((pos) => {
  //   const posBaseInd = POSITIONGROUPS.findIndex(
  //     (el) =>
  //       el.order_id == pos.order_id &&
  //       el.position_id == pos.position_id &&
  //       el.position_item_id == pos.position_item_id
  //   );
  //   const foundInd = POSITIONGROUPS.findIndex(
  //     (el) =>
  //       el.order_id == pos.order_id &&
  //       el.position_id == pos.position_id &&
  //       (pos.container[0]
  //         ? el.container[0] === pos.container[0]
  //         : el.container.length == 0) &&
  //       el.color === pos.color &&
  //       el.status === pos.status &&
  //       el.model_id === pos.model_id &&
  //       el.position_name === pos.position_name
  //   );
  //   const updPos = getUpdatedPosition(
  //     posBaseInd,
  //     pos,
  //     POSITIONGROUPS,
  //     foundInd
  //   );
  //   return {
  //     updatePosition: updPos[0],
  //     updateIndex: updPos[1],
  //     badParams: validatePosition(updPos[0]),
  //   };
  // });

  if (newPositionGroups.some((el) => !!validatePosition(el))) {
    const { code, modal, popup } = getErrorModal(
      ErrorCode.BAD_PARAMS,
      "popup"
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
        bad_attributes: { orders: [{ file: ["Something went wrong"] }] },
      },
    };
    // return {
    //   ...errResponse,
    //   result: {
    //     ...errResponse.result,
    //     bad_attributes: {
    //       positions: [sanitize({ ...badParamsPosition })],
    //     },
    //   },
    // };
  }

  ORDERS.push(neworder);
  POSITIONGROUPS.push(...newPositionGroups);

  const data = {
    orders: [neworder],
    positions: newPositionGroups,
    ...getOrdersListDict([neworder], newPositionGroups),
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

export const respond = (
  req: Request,
  file: Express.Multer.File | null,
  resp: Response
) => {
  const { id, params } = req.body;
  const responseBody = ordersUploadFileResponse(id, params, file);
  resp.json(responseBody);
};
