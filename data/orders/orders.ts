import { v4 } from "uuid";
import { Order } from "../../share/interfaces";
import { getRandomItem } from "../../share/get-random-items-from-array";
import { USERS } from "../users/users";
import { randomDate } from "../../share/utils";
import { ErrorCode } from "../../share/constants";

const DESCRIPTIONS = new Array(10)
  .fill(0)
  .map((x, i) => `Какое-то описание заказа номер ${i + 1}`);

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
    order_name: `Заказ #${i + 1}`,
    description: `Какое-то описание заказа номер ${i + 1}`,
  }),
}));

ORDERS.unshift({
  ...fillRandomOrders({
    order_name: "Заблокированный заказ",
    description: "Заблокированный заказ",
  }),
  order_id: "locked_order",
});
ORDERS.unshift({
  ...fillRandomOrders({
    order_name: "Не найденный заказ",
    description: "Не найденный заказ",
  }),
  order_id: "notfound_order",
});
ORDERS.unshift({
  ...fillRandomOrders({
    order_name: "Мой заказ",
    description: "Мой заказ",
  }),
  order_id: "my_order",
});
ORDERS.unshift({
  ...fillRandomOrders({
    order_name: "Ошибочный заказ",
    description: "Ошибочный заказ",
  }),
  order_id: "system_error",
});
ORDERS.unshift({
  ...fillRandomOrders({
    order_name: "Нет доступа",
    description: "Нет доступа",
  }),
  order_id: "no_access",
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
