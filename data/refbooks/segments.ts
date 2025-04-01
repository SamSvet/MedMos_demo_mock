import { RefBook } from "../../share/interfaces";

const segments: RefBook[] = [
  { internal_code: "1", name: "Микро", is_deleted: false },
  { internal_code: "2", name: "Малые", is_deleted: false },
  { internal_code: "3", name: "Средний", is_deleted: false },
  { internal_code: "4", name: "Крупные", is_deleted: false },
  { internal_code: "5", name: "Крупнейшие", is_deleted: false },
  { internal_code: "6", name: "Фин.институты", is_deleted: false },
  { internal_code: "7", name: "Клиенты машиностроения", is_deleted: false },
  { internal_code: "8", name: "Рег. Госсектор", is_deleted: false },
  { internal_code: "9", name: "БМО", is_deleted: false },
  {
    internal_code: "10",
    name: "Нет инфо об объеме годовой выручки",
    is_deleted: false,
  },
  {
    internal_code: "11",
    name: "Микро бизнес. Предпринимательство",
    is_deleted: false,
  },
];

export const SEGMENTS = segments.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
