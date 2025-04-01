import { RefBook } from "../../share/interfaces";

export const CONTAINERS: RefBook[] = new Array(5).fill(0).map((x, i) => ({
  name: `Контейнер #${i + 1}`,
  internal_code: `${i + 1}`,
  is_deleted: false,
}));
