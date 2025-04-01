import { PositionItemGrouped2 } from "../../share/interfaces";
import { POSITIONS } from "./positions";

export const getOrderPositions = () => [
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

export const getOrderPositionsFilter = (order_id: string) => [
  ...POSITIONS.filter((position) => position.order_id === order_id)
    .reduce((r, o) => {
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
    }, new Map<string, PositionItemGrouped2>())
    .values(),
];
