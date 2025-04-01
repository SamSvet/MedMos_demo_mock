import { RefBook } from "../../share/interfaces";

const campaignKinds: RefBook[] = [
  {
    internal_code: "1.1",
    name: "Пилот",
    is_deleted: false,
  },
  {
    internal_code: "1.2",
    name: "Регулярная",
    is_deleted: false,
  },
];

export const CAMPAIGN_KINDS = campaignKinds.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
