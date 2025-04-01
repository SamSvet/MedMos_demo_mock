import { v4 } from "uuid";
import {
  randomInteger,
  randomString,
  randomDate,
  range,
} from "../../share/utils";
import { getRandomItem } from "../../share/get-random-items-from-array";
import { RefBook, Scenario } from "../../share/interfaces";
import { CAMPAIGNS } from "../campaigns/campaign-list";
import { ACTIVITY_TYPES } from "../refbooks/activity-types";
import { CAMPAIGN_STATUSES } from "../refbooks/campaign-statuses";
import { CHANNELS } from "../refbooks/channels";
import { MODEL_NAMES } from "../refbooks/model-names";
import { PRODUCTS } from "../refbooks/products";
import { SEGMENTS } from "../refbooks/segments";
import { UPLOADING_TYPES } from "../refbooks/uploading-types";
import { USERS } from "../users/users";

const fillRandomFields = (): Scenario => {
  const is_model = Boolean(randomInteger(0, 1));
  return {
    scenario_id: v4(),
    base_scenario_id: v4(),
    scenario_name: randomString(10),
    product_cd: [getRandomItem(PRODUCTS).internal_code],
    channel_cd: [getRandomItem(CHANNELS).internal_code],
    sas_camp_code: randomString(5),
    start_scenario_dt: randomDate(),
    end_scenario_dt: randomDate(),
    plan_conversion: randomInteger(0, 100),
    uploading_type_cd: getRandomItem(UPLOADING_TYPES).internal_code,
    segment_cd: [getRandomItem(SEGMENTS).internal_code],
    scenario_status_cd: getRandomItem(CAMPAIGN_STATUSES).internal_code,
    is_model,
    model_cd: is_model ? [getRandomItem(MODEL_NAMES).internal_code] : [],
    created_by: getRandomItem(USERS).id,
    created: randomDate(),
    updated_by: getRandomItem(USERS).id,
    updated: randomDate(),
    status_updated: randomDate(),
    activity_type_cd: getRandomItem(ACTIVITY_TYPES).internal_code,
    campaign_id: getRandomItem(CAMPAIGNS).campaign_id,
  };
};

export const SCENARIOS: Scenario[] = CAMPAIGNS.flatMap((camp) => [
  ...[...range(1, 2)].map(() => ({
    ...fillRandomFields(),
    campaign_id: camp.campaign_id,
  })),
  // {
  //   ...fillRandomFields(),
  //   campaign_id: camp.campaign_id,
  //   scenario_name: "",
  //   model_cd: [],
  //   is_model: true
  // },
]);
