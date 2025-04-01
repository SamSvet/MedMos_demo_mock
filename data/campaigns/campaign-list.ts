import { v4 } from "uuid";
import { ErrorCode } from "../../share/constants";
import { getRandomItem } from "../../share/get-random-items-from-array";
import { Campaign } from "../../share/interfaces";
import { randomInteger, randomDate } from "../../share/utils";
import { ACTIVITY_GROUPS } from "../refbooks/activity-groups";
import { CAMPAIGN_KINDS } from "../refbooks/campaign-kinds";
import { CAMPAIGN_STATUSES } from "../refbooks/campaign-statuses";
import { TAGS } from "../tags/tags";
import { TEAMS } from "../users/teams";
import { USERS } from "../users/users";

const DESCRIPTIONS = new Array(10).fill(0).map((x, i) => `Описание ${i + 1}`);

const fillRandomFields = (): Omit<Campaign, "campaign_name"> => ({
  campaign_id: v4(),
  base_campaign_id: v4(),
  campaign_kind_cd: getRandomItem(CAMPAIGN_KINDS).internal_code,
  campaign_version: randomInteger(0, 10),
  activity_group_cd: getRandomItem(ACTIVITY_GROUPS).internal_code,
  campaign_manager: getRandomItem(USERS).id,
  tags: [getRandomItem(TAGS).id, getRandomItem(TAGS).id],
  team_cd: getRandomItem(TEAMS).code,
  description: getRandomItem(DESCRIPTIONS),
  campaign_status_cd: getRandomItem(CAMPAIGN_STATUSES).internal_code,
  created: randomDate(),
  created_by: getRandomItem(USERS).id,
  status_updated: randomDate(),
  updated: randomDate(),
  updated_by: getRandomItem(USERS).id,
});

export const CAMPAIGNS: Campaign[] = new Array(250).fill(0).map((x, i) => ({
  campaign_name: `Кампания #${i + 1}`,
  ...fillRandomFields(),
}));

CAMPAIGNS.unshift({
  campaign_name: "Заблокированная кампания",
  ...fillRandomFields(),
  campaign_id: "locked_campaign",
});
CAMPAIGNS.unshift({
  campaign_name: "Не найденная кампания",
  ...fillRandomFields(),
  campaign_id: "notfound_campaign",
});
CAMPAIGNS.unshift({
  campaign_name: "Моя кампания",
  ...fillRandomFields(),
  activity_group_cd: "1.1",
  campaign_id: "my_campaign",
});
CAMPAIGNS.unshift({
  campaign_name: "Ошибочная кампания",
  ...fillRandomFields(),
  campaign_id: "system_error",
});
CAMPAIGNS.unshift({
  campaign_name: "Нет доступа",
  ...fillRandomFields(),
  campaign_id: "no_access",
});
CAMPAIGNS.unshift({
  campaign_name: "Не найдена",
  ...fillRandomFields(),
  campaign_id: "not_found",
});

export const WRONG_CAMPAIGNS = [
  { campaign_id: "no_access", popup: ErrorCode.NO_ACCESS },
  {
    campaign_id: "not_found",
    popup: ErrorCode.NOT_FOUND,
  },
];
