import { RefBook } from "../../share/interfaces";

const colors: RefBook[] = [
  { internal_code: "1.1", name: "black", is_deleted: false },
  { internal_code: "1.2", name: "blue", is_deleted: false },
  { internal_code: "1.3", name: "green", is_deleted: false },
  { internal_code: "1.4", name: "red", is_deleted: false },
  { internal_code: "1.5", name: "yellow", is_deleted: false },
  { internal_code: "1.6", name: "white", is_deleted: false },
];

export const COLORS = colors.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
