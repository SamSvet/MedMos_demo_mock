import { v4 } from "uuid";
import {
  OrderListPositionItemGrouped,
  Position,
  PositionItem,
  PositionItemGrouped,
  PositionItemGrouped2,
} from "../../share/interfaces";
import {
  randomDate,
  randomDateBetween,
  randomInteger,
  randomString,
  range,
} from "../../share/utils";
import { ORDERS } from "../orders/orders";
import { getRandomItem } from "../../share/get-random-items-from-array";
import { CONTAINERS as CONT } from "../containers/containers";
import { COLORS } from "../refbooks/colors";
import { MODELS } from "../refbooks/models";
import { POSITION_ITEM_STATUS } from "../refbooks/position-item-status";

const fillRandomPositions = (
  seed: Omit<PositionItem, "position_item_id" | "status" | "container">
): PositionItem => {
  const is_container = Boolean(randomInteger(0, 1));
  return {
    position_item_id: v4(),
    order_id: seed.order_id,
    position_id: seed.position_id,
    position_name: seed.position_name,
    color: seed.color,
    position_description: seed.position_description,
    model_id: seed.model_id,
    container: is_container ? getRandomItem(CONT).id : null,
    status: is_container
      ? POSITION_ITEM_STATUS[1].internal_code
      : POSITION_ITEM_STATUS[0].internal_code,
  };
};

export const POSITIONS2: PositionItem[] = ORDERS.flatMap((order) => [
  ...[...range(1, 5)].flatMap((pos_group) =>
    [...range(1, 20)].map(() => ({
      ...fillRandomPositions({
        order_id: order.order_id,
        position_id: pos_group.toString(),
        color: getRandomItem(COLORS).internal_code,
        position_description: `Some group position description goes here ${pos_group}`,
        model_id: getRandomItem(MODELS).internal_code,
        position_name: randomString(10),
      }),
    }))
  ),
]);

export const POSITIONS: PositionItem[] = ORDERS.flatMap((order) =>
  new Array(5).fill(0).flatMap((_) => {
    const pos_group = v4();
    const position_description = `Some group position description goes here ${pos_group}`;
    const color = getRandomItem(COLORS).internal_code;
    const model_id = getRandomItem(MODELS).internal_code;
    const position_name = randomString(10);
    return new Array(20).fill(0).map((_) => ({
      ...fillRandomPositions({
        order_id: order.order_id,
        position_id: pos_group,
        color: color,
        position_description: position_description,
        model_id: model_id,
        position_name: position_name,
      }),
    }));
  })
);

export const POSITIONS_GROUPED = [
  ...POSITIONS.reduce((r, o) => {
    const key = `${o.order_id}-${o.position_id}-${o.position_name}-${o.color}-${o.position_description}-${o.model_id}-${o.status}`;

    const item =
      r.get(key) ||
      Object.assign({}, o, {
        container: [],
        position_item_id: [],
      });

    item.container = [...item.container, o.container];
    item.position_item_id = [...item.position_item_id, o.position_item_id];

    return r.set(key, item);
  }, new Map<string, PositionItemGrouped>()).values(),
];

export const POSITIONS_GROUPED3 = [
  ...POSITIONS.reduce((r, o) => {
    const key = `${o.order_id}-${o.model_id}-${o.color}-${o.container}-${o.status}`;

    const item =
      r.get(key) ||
      Object.assign({}, o, {
        container: [],
        position_item_id: [],
        position_description: [],
        status: [],
      });

    item.container = [...item.container, o.container];
    item.position_item_id = [...item.position_item_id, o.position_item_id];
    item.position_description = [
      ...item.position_description,
      o.position_description,
    ];
    item.status = [...item.status, o.status];

    return r.set(key, item);
  }, new Map<string, OrderListPositionItemGrouped>()).values(),
];

export const POSITIONS_GROUPED2 = [
  ...POSITIONS.reduce((r, o) => {
    const key = `${o.order_id}-${o.position_id}-${o.position_name}-${o.color}-${o.container}-${o.model_id}-${o.status}`;

    const item =
      r.get(key) ||
      Object.assign({}, o, {
        position_item_id: [],
        count: 0,
      });

    item.position_item_id = [...item.position_item_id, o.position_item_id];
    item.count += 1;

    return r.set(key, item);
  }, new Map<string, PositionItemGrouped2>()).values(),
];

const fillRandomPositionGroups = (
  seed: Omit<Position, "status" | "container" | "plan_delivery_dt">,
  status: number
): Position => {
  const today = new Date();
  const end_dt = new Date(
    new Date().setDate(today.getDate() + randomInteger(30, 90))
  );
  return {
    ...seed,
    container: status == 0 ? [] : [getRandomItem(CONT).id],
    // plan_delivery_dt:
    //   status == 0
    //     ? null
    //     : status == 1
    //     ? randomDateBetween(today, end_dt)
    //     : randomDate(),
    //plan_delivery_dt: null,
    status: POSITION_ITEM_STATUS[status].internal_code,
  };
};

export const POSITIONGROUPS: Position[] = ORDERS.flatMap((order) =>
  new Array(5).fill(0).flatMap((_) => {
    const pos_group = v4();
    const position_description = `Some group position description goes here ${pos_group}`;
    const color = getRandomItem(COLORS).internal_code;
    const position_name = randomString(10);
    const model_id = getRandomItem(MODELS).internal_code;
    return new Array(3).fill(0).map((_, idx) => ({
      ...fillRandomPositionGroups(
        {
          position_item_id: idx.toString(),
          order_id: order.order_id,
          position_id: pos_group,
          color: color,
          count: randomInteger(100, 1000),
          position_description: position_description,
          model_id: model_id,
          position_name: position_name,
          reserved_count: 0,
        },
        idx
      ),
    }));
  })
);
export const defaultPosition: Position = {
  order_id: "",
  position_id: "",
  position_item_id: "",
  position_name: "",
  color: "",
  position_description: "",
  model_id: "",
  count: 0,
  status: "",
  //plan_delivery_dt: "",
  reserved_count: 0,
};

export const defaultPositionItemGrouped2: PositionItemGrouped2 = {
  order_id: "",
  position_id: "",
  position_item_id: [""],
  position_name: "",
  color: "",
  position_description: "",
  model_id: "",
  count: 0,
  status: "",
  container: "",
};
