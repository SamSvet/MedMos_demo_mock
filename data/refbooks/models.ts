import { RefBook } from "../../share/interfaces";

const models: RefBook[] = [
  { internal_code: "1.1", name: "модель РФ №1", is_deleted: false },
  {
    internal_code: "1.2",
    name: "модель РФ №2",
    is_deleted: false,
  },
  { internal_code: "1.3", name: "модель РФ №3", is_deleted: false },
  {
    internal_code: "1.4",
    name: "модель РФ №4",
    is_deleted: false,
  },
  {
    internal_code: "1.5",
    name: "модель РФ №5",
    is_deleted: false,
  },
  { internal_code: "1.6", name: "модель РФ №6", is_deleted: false },
];

export const MODELS = models.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
