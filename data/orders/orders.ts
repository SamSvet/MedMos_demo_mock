import { v4 } from "uuid";
import { Order } from "../../share/interfaces";
import { getRandomItem } from "../../share/get-random-items-from-array";
import { USERS } from "../users/users";
import { randomDate } from "../../share/utils";
import { ErrorCode } from "../../share/constants";

const DESCRIPTIONS = new Array(10)
  .fill(0)
  .map((x, i) => `Some description goes here for Order ${i + 1}`);

const fillRandomOrders = (
  seed: Pick<Order, "order_name" | "description">
): Order => ({
  ...seed,
  order_id: v4(),
  order_manager: getRandomItem(USERS).id,
  created: randomDate(),
  created_by: getRandomItem(USERS).id,
  updated: randomDate(),
  updated_by: getRandomItem(USERS).id,
  locked_till: null,
});

export const ORDERS: Order[] = new Array(2).fill(0).map((_x, i) => ({
  ...fillRandomOrders({
    order_name: `Order #${i + 1}`,
    description: `Some description goes here for Order ${i + 1}`,
  }),
}));

ORDERS.unshift({
  ...fillRandomOrders({
    order_name: "Blocked Order",
    description: "Blocked Order",
  }),
  order_id: "locked_order",
});
ORDERS.unshift({
  ...fillRandomOrders({
    order_name: "Not Found Order",
    description: "Not Found Order",
  }),
  order_id: "notfound_order",
});

ORDERS.unshift({
  ...fillRandomOrders({
    order_name: "Error Order",
    description: "Error Order",
  }),
  order_id: "system_error",
});
ORDERS.unshift({
  ...fillRandomOrders({
    order_name: "No Access Order",
    description: "No Access Order",
  }),
  order_id: "no_access",
});

ORDERS.unshift({
  ...fillRandomOrders({
    order_name: "My Order",
    description: "My Order",
  }),
  order_id: "my_order",
});

export const WRONG_ORDERS = [
  { order_id: "no_access", popup: ErrorCode.NO_ACCESS },
  {
    order_id: "not_found",
    popup: ErrorCode.NOT_FOUND,
  },
];

export const defaultOrder: Order = {
  order_id: "",
  order_name: "",
  order_manager: "",
  description: "",
  created: "",
  created_by: "",
  updated: "",
  updated_by: "",
  locked_till: "",
};
