import { RefBook } from "../../share/interfaces";
import { PositionStatus } from "../../share/constants";

const postionItemStatus: RefBook[] = [
  {
    internal_code: PositionStatus.NEW,
    name: "Production",
    is_deleted: false,
  },
  {
    internal_code: PositionStatus.WAY,
    name: "Transit",
    is_deleted: false,
  },
  { internal_code: PositionStatus.STOCK, name: "Stock", is_deleted: false },
];

export const POSITION_ITEM_STATUS = postionItemStatus.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
