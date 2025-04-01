import { RefCode } from "../../share/constants";
import {
  Campaign,
  CampaignsFilters,
  FilterData,
  RefBook,
  Scenario,
  ScenariosFilters,
  Tag,
  Team,
  User,
} from "../../share/interfaces";
import { ACTIVITY_GROUPS } from "../refbooks/activity-groups";
import { ACTIVITY_TYPES } from "../refbooks/activity-types";
import { CAMPAIGN_KINDS } from "../refbooks/campaign-kinds";
import { CAMPAIGN_STATUSES } from "../refbooks/campaign-statuses";
import { CHANNELS } from "../refbooks/channels";
import { MODEL_NAMES } from "../refbooks/model-names";
import { PRODUCTS } from "../refbooks/products";
import { SEGMENTS } from "../refbooks/segments";
import { UPLOADING_TYPES } from "../refbooks/uploading-types";
import { SCENARIOS } from "../scenarios/scenarios";
import { TAGS } from "../tags/tags";
import { TEAMS } from "../users/teams";
import { USERS } from "../users/users";

const checkValue = (value: unknown, filter: unknown) =>
  !filter || value == filter;

const checkSubstr = (value: string, filter: unknown) =>
  !filter || value.includes(String(filter));

const checkRefArrayValue = <
  Entity extends { [key in keyof Entity]: unknown | unknown[] }
>(
  entity: Entity,
  filters: { [key in keyof Entity]?: string | string[] },
  field: keyof Entity
) => {
  if (
    !filters?.[field] ||
    (Array.isArray(filters?.[field]) && !filters?.[field]?.length)
  ) {
    return true;
  }

  const arr = (
    Array.isArray(entity[field]) ? entity[field] : [entity[field]]
  ) as string[];
  return Boolean(
    (arr as Entity[keyof Entity][])?.filter((x) =>
      Array.isArray(filters?.[field])
        ? filters?.[field]?.includes(x as string)
        : filters?.[field] == x
    ).length
  );
};

const checkDateValue = (date: string, filterDate?: string | null) => {
  return !filterDate || date.slice(0, 10) == filterDate.slice(0, 10);
};

export const filterCampaigns = (campaigns: Campaign[], filters: FilterData) => {
  if (!filters) return campaigns;
  const res = campaigns.filter((campaign) => {
    const campaignOk =
      checkSubstr(
        String(campaign.campaign_name),
        filters.campaigns?.campaign_name
      ) &&
      (["campaign_kind_cd", "campaign_status_cd"] as (keyof Campaign)[]).every(
        (field) => checkRefArrayValue(campaign, filters.campaigns || {}, field)
      ) &&
      (["campaign_manager"] as (keyof Campaign)[]).every((field) =>
        checkRefArrayValue(campaign, filters.campaigns || {}, field)
      ) &&
      (!filters.campaigns?.tags?.length ||
        campaign?.tags?.some((tag) =>
          filters.campaigns?.tags?.includes(tag)
        )) &&
      (["created", "status_updated"] as (keyof Campaign)[]).every((field) =>
        checkDateValue(
          campaign[field] as string,
          filters.campaigns?.[field as keyof CampaignsFilters] as string
        )
      );

    // checkDateValue(campaign.created, filters.campaigns?.created)
    if (!campaignOk) return false;

    const scenariosOk = SCENARIOS.filter(
      (x) => x.campaign_id == campaign.campaign_id
    ).some((scenario) => {
      const r =
        checkValue(scenario.scenario_id, filters.scenarios?.scenario_id) &&
        (
          [
            "start_scenario_dt",
            "end_scenario_dt",
            "status_updated",
          ] as (keyof Scenario)[]
        ).every((field) => {
          return checkDateValue(
            scenario[field] as string,
            filters.scenarios?.[field as keyof ScenariosFilters] as string
          );
        }) &&
        (
          [
            "product_cd",
            "uploading_type_cd",
            "segment_cd",
          ] as (keyof Scenario)[]
        ).every((field) =>
          checkRefArrayValue(scenario, filters.scenarios || {}, field)
        );
      return r;
    });

    return scenariosOk;
  });
  return res;
};

export const sortCampaigns = (campaigns: Campaign[], sortStr: string) => {
  if (!sortStr) return campaigns;
  const isDesc = sortStr[0] === "-";
  const sortField = (isDesc ? sortStr.slice(1) : sortStr) as keyof Campaign;
  let left: string | undefined, right: string | undefined;
  return campaigns.sort((a, b) => {
    if (sortField === "campaign_status_cd") {
      left = Array.isArray(a[sortField])
        ? (a[sortField] as unknown as string[])
            ?.map(
              (x: string) =>
                CAMPAIGN_STATUSES.find((s) => s.internal_code == x)?.name
            )
            ?.sort()[0]
        : CAMPAIGN_STATUSES.find((s) => s.internal_code == a[sortField])?.name;
      right = Array.isArray(b[sortField])
        ? (b[sortField] as unknown as string[])
            .map(
              (x) => CAMPAIGN_STATUSES.find((s) => s.internal_code == x)?.name
            )
            ?.sort()[0]
        : CAMPAIGN_STATUSES.find((s) => s.internal_code == b[sortField])?.name;
    } else {
      left = (
        Array.isArray(a[sortField])
          ? (a[sortField] as unknown as string[]).sort()[0]
          : a[sortField]
      ) as string;
      right = (
        Array.isArray(b[sortField])
          ? (b[sortField] as unknown as string[]).sort()[0]
          : b[sortField]
      ) as string;
    }

    const condition = isDesc ? left! < right! : left! > right!;
    return condition ? 1 : -1;
  });
};

export const getCampaignsListDict = (
  campaigns: Campaign[],
  filters?: FilterData
) => {
  const dictMap = new Map<
    RefCode,
    { codes: Set<string | null | undefined>; dict: RefBook[] }
  >([
    [
      RefCode.ACTIVITY_GROUP,
      {
        codes: new Set([...campaigns.map((x) => x.activity_group_cd).flat()]),
        dict: ACTIVITY_GROUPS,
      },
    ],
    [
      RefCode.ACTIVITY_TYPE,
      {
        codes: new Set([
          ...campaigns
            .map((c) =>
              SCENARIOS.filter((s) => s.campaign_id == c.campaign_id)
                .map((s) => s.activity_type_cd)
                .flat()
            )
            .flat(),
          ...(filters?.scenarios?.activity_type_cd || []),
        ]),
        dict: ACTIVITY_TYPES,
      },
    ],
    [
      RefCode.CAMPAIGN_KIND,
      {
        codes: new Set([
          ...campaigns.map((x) => x.campaign_kind_cd).flat(),
          ...(filters?.campaigns?.campaign_kind_cd
            ? [filters?.campaigns?.campaign_kind_cd]
            : []),
        ]),
        dict: CAMPAIGN_KINDS,
      },
    ],
    [
      RefCode.CAMPAIGN_STATUS,
      {
        codes: new Set([
          ...campaigns.map((x) => x.campaign_status_cd).flat(),
          ...(filters?.campaigns?.campaign_status_cd
            ? [filters?.campaigns?.campaign_status_cd]
            : []),
        ]),
        dict: CAMPAIGN_STATUSES,
      },
    ],
    [
      RefCode.PRODUCT,
      {
        codes: new Set([
          ...campaigns
            .map((c) =>
              SCENARIOS.filter((s) => s.campaign_id == c.campaign_id)
                .map((s) => s.product_cd)
                .flat()
            )
            .flat(),
          ...(filters?.scenarios?.product_cd || []),
        ]),
        dict: PRODUCTS,
      },
    ],
    [
      RefCode.SEGMENT,
      {
        codes: new Set([
          ...campaigns
            .map((c) =>
              SCENARIOS.filter((s) => s.campaign_id == c.campaign_id)
                .map((s) => s.segment_cd)
                .flat()
            )
            .flat(),
          ...(filters?.scenarios?.segment_cd || []),
        ]),
        dict: SEGMENTS,
      },
    ],
    [
      RefCode.UPLOADING_TYPE,
      {
        codes: new Set([
          ...campaigns
            .map((c) =>
              SCENARIOS.filter((s) => s.campaign_id == c.campaign_id)
                .map((s) => s.uploading_type_cd)
                .flat()
            )
            .flat(),
          ...(filters?.scenarios?.uploading_type_cd
            ? [filters?.scenarios?.uploading_type_cd]
            : []),
        ]),
        dict: UPLOADING_TYPES,
      },
    ],
    [
      RefCode.CHANNEL,
      {
        codes: new Set([
          ...campaigns
            .map((c) =>
              SCENARIOS.filter((s) => s.campaign_id == c.campaign_id)
                .map((s) => s.channel_cd)
                .flat()
            )
            .flat(),
        ]),
        dict: CHANNELS,
      },
    ],
    [
      RefCode.MODEL,
      {
        codes: new Set([
          ...campaigns
            .map((c) =>
              SCENARIOS.filter((s) => s.campaign_id == c.campaign_id)
                .map((s) => s.model_cd)
                .flat()
            )
            .flat(),
        ]),
        dict: MODEL_NAMES,
      },
    ],
  ]);

  const dictionaries: {
    [key in RefCode]?: RefBook[] | Tag[] | User[] | Team[];
  } = {};
  const dictMapIter = dictMap.keys();
  let dictMapKey = dictMapIter.next();
  while (!dictMapKey.done) {
    const dictKey = dictMapKey.value;
    const { codes, dict } = dictMap.get(dictKey)!;
    dictionaries[dictKey] = dict.filter((x) => codes.has(x.internal_code));
    dictMapKey = dictMapIter.next();
  }
  dictionaries.tags = TAGS.filter((tag) =>
    new Set([
      ...campaigns.map((x) => x.tags).flat(),
      ...(filters?.campaigns?.tags || []),
    ]).has(tag.id)
  );
  dictionaries.users = USERS.filter((user) =>
    new Set([
      ...campaigns
        .map((x) => [x.campaign_manager, x.created_by, x.updated_by])
        .flat(),
      ...(filters?.campaigns?.campaign_manager
        ? [filters?.campaigns.campaign_manager]
        : []),
    ]).has(user.id)
  );

  dictionaries.teams = TEAMS.filter((team) =>
    new Set([...campaigns.map((x) => x.team_cd).flat()]).has(team.code)
  );

  return dictionaries;
};

export const validateCampaign = (campaign: Campaign) => {
  const badParams: { [key in keyof Campaign]?: string[] } = {};
  let isOk = true;
  if (!campaign.campaign_name) {
    badParams.campaign_name = ["Обязательное поле"];
    isOk = false;
  }

  if (
    ACTIVITY_GROUPS.filter(
      (group) =>
        campaign.activity_group_cd === group.internal_code && group.is_deleted
    ).length
  ) {
    badParams.activity_group_cd = ["Значение удалено из БД"];
    isOk = false;
  }

  if (
    CAMPAIGN_STATUSES.filter(
      (status) =>
        campaign.campaign_status_cd === status.internal_code &&
        status.is_deleted
    ).length
  ) {
    badParams.campaign_status_cd = ["Значение удалено из БД"];
    isOk = false;
  }

  if (
    CAMPAIGN_KINDS.filter(
      (kind) =>
        campaign.campaign_kind_cd === kind.internal_code && kind.is_deleted
    ).length
  ) {
    badParams.campaign_kind_cd = ["Значение удалено из БД"];
    isOk = false;
  }

  if (!campaign.activity_group_cd) {
    badParams.activity_group_cd = ["Обязательное поле"];
    isOk = false;
  }

  if (!campaign.campaign_manager) {
    badParams.campaign_manager = ["Обязательное поле"];
    isOk = false;
  }

  if (!campaign.campaign_kind_cd) {
    badParams.campaign_kind_cd = ["Обязательное поле"];
    isOk = false;
  }

  if (!campaign.description) {
    badParams.description = ["Обязательное поле"];
    isOk = false;
  }

  if (!campaign.team_cd) {
    badParams.team_cd = ["Обязательное поле"];
    isOk = false;
  }

  return isOk ? null : badParams;
};

export const validateScenario = (scenario: Scenario) => {
  const badParams: { [key in keyof Scenario]?: string[] } = {};
  let isOk = true;

  if (!scenario.scenario_name) {
    badParams.scenario_name = ["Обязательное поле"];
    isOk = false;
  }

  if (!scenario.activity_type_cd) {
    badParams.activity_type_cd = ["Обязательное поле"];
    isOk = false;
  }

  if (!scenario.uploading_type_cd) {
    badParams.uploading_type_cd = ["Обязательное поле"];
    isOk = false;
  }

  if (!scenario.channel_cd || !scenario.channel_cd.length) {
    badParams.channel_cd = ["Обязательное поле"];
    isOk = false;
  }

  if (!scenario.plan_conversion) {
    badParams.plan_conversion = ["Обязательное поле"];
    isOk = false;
  }

  if (scenario.is_model && !scenario.model_cd?.length) {
    badParams.model_cd = ["Обязательное поле"];
    isOk = false;
  }

  if (!scenario.start_scenario_dt) {
    badParams.start_scenario_dt = ["Обязательное поле"];
    isOk = false;
  }

  return isOk ? null : badParams;
};

export const validateScenarios = (scenarios: Scenario[]) => {
  return scenarios.map((scenario) => {
    const validated = validateScenario(scenario);
    return validated
      ? {
          scenario_id: scenario.scenario_id,
          ...validateScenario(scenario),
        }
      : null;
  });
};
