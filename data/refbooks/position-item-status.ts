import { RefBook } from "../../share/interfaces";
import { PositionStatus } from "../../share/constants";

const postionItemStatus: RefBook[] = [
  {
    internal_code: PositionStatus.NEW,
    name: "В производстве",
    is_deleted: false,
  },
  {
    internal_code: PositionStatus.WAY,
    name: "В пути",
    is_deleted: false,
  },
  { internal_code: PositionStatus.STOCK, name: "На складе", is_deleted: false },
];

export const POSITION_ITEM_STATUS = postionItemStatus.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
