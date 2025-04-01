import { CampaignStatus } from "../../share/constants";
import { RefBook } from "../../share/interfaces";

const campaignStatuses: RefBook[] = [
  {
    internal_code: CampaignStatus.NEW,
    name: "Новая",
    is_deleted: false,
  },
  {
    internal_code: CampaignStatus.EDIT,
    name: "Изменённая",
    is_deleted: false,
  },
  {
    internal_code: CampaignStatus.NEED_APPROVE,
    name: "Требует согласования",
    is_deleted: false,
  },
  {
    internal_code: CampaignStatus.NEED_EDIT,
    name: "Требует доработки",
    is_deleted: false,
  },
  {
    internal_code: CampaignStatus.APPROVE,
    name: "Согласована",
    is_deleted: false,
  },
  {
    internal_code: CampaignStatus.PLAN,
    name: "Запланирована для запуска",
    is_deleted: false,
  },
  {
    internal_code: CampaignStatus.RUN,
    name: "Запущена",
    is_deleted: false,
  },
  {
    internal_code: CampaignStatus.DEACTIVATE,
    name: "Деактивирована",
    is_deleted: false,
  },
];

export const CAMPAIGN_STATUSES = campaignStatuses.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
