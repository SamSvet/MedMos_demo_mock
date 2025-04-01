import { RefBook } from "../../share/interfaces";

const uploadingTypes: RefBook[] = [
  {
    internal_code: "1.1",
    name: "Ad-hoc",
    is_deleted: false,
  },
  {
    internal_code: "1.2",
    name: "Фабрика ММБ",
    is_deleted: false,
  },
  {
    internal_code: "1.3",
    name: "Фабрика ККСБ",
    is_deleted: false,
  },
  {
    internal_code: "1.4",
    name: "Фабрика РГС",
    is_deleted: false,
  },
  {
    internal_code: "1.5",
    name: "Фабрика ЭКО",
    is_deleted: false,
  },
];

export const UPLOADING_TYPES = uploadingTypes.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
