import { RefBook } from "../../share/interfaces";

const models: RefBook[] = [
  { internal_code: "1.1", name: "Model Number RF №1", is_deleted: false },
  {
    internal_code: "1.2",
    name: "Model Number RF №2",
    is_deleted: false,
  },
  { internal_code: "1.3", name: "Model Number RF №3", is_deleted: false },
  {
    internal_code: "1.4",
    name: "Model Number RF №4",
    is_deleted: false,
  },
  {
    internal_code: "1.5",
    name: "Model Number RF №5",
    is_deleted: false,
  },
  { internal_code: "1.6", name: "Model Number RF №6", is_deleted: false },
];

export const MODELS = models.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
