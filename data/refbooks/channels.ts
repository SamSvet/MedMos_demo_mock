import { RefBook } from "../../share/interfaces";

const channels: RefBook[] = [
  { internal_code: "1", name: "КМ ЦКР", is_deleted: false },
  { internal_code: "2", name: "КМ МС", is_deleted: false },
  { internal_code: "3", name: "КМ ГКМ", is_deleted: false },
  { internal_code: "4", name: "КМ МКК", is_deleted: false },
  { internal_code: "5", name: "СББОЛ", is_deleted: false },
];

export const CHANNELS = channels.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
