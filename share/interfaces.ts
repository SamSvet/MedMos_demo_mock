import { CustomGroup } from "./generic-types";
import { JTDDataType } from "ajv/dist/jtd";
import { JSONSchema7 } from "json-schema";

export interface Order {
  order_id: string;
  order_name: string | null;
  order_manager: string | null;
  description: string | null;
  created?: string;
  created_by?: string | null;
  updated?: string;
  updated_by?: string | null;
  locked_till?: string | null;
}

export interface PositionItem {
  position_item_id: string;
  position_id: string;
  order_id: string;
  position_name: string | null;
  color: string | null;
  position_description: string | null;
  model_id: string | null;
  container: string | null;
  status: string | null;
}

export interface Position {
  order_id: string;
  position_id: string;
  position_item_id: string;
  position_name: string | null;
  color: string | null;
  position_description: string | null;
  model_id: string | null;
  count: number | null;
  reserved_count: number | null;
  reserved_by?: string | null;
  status: string | null;
  // plan_delivery_dt: string | null;
  container?: string[] | null;
}

export type PositionItemGrouped = CustomGroup<
  PositionItem,
  "container" | "position_item_id"
>;
export type PositionItemGrouped2 = CustomGroup<
  PositionItem,
  "position_item_id"
> & { count: number };

export type OrderListPositionItemGrouped = CustomGroup<
  PositionItem,
  "container" | "position_item_id" | "position_description" | "status"
>;

export interface IOrderPosition<T extends PositionItemGrouped2 | Position> {
  order: Order;
  position: T;
}
export type OrderPosition = IOrderPosition<PositionItemGrouped2>;
export type OrderPositionGroups = IOrderPosition<Position>;

export interface Campaign {
  campaign_id: string;
  base_campaign_id: string;
  campaign_name: string | null;
  campaign_kind_cd: string | null;
  campaign_version: number | null;
  activity_group_cd: string | null;
  campaign_manager: string | null;
  tags: string[] | null;
  team_cd: string | null;
  description: string | null;
  campaign_status_cd: string | null;
  created: string;
  created_by: string | null;
  status_updated: string | null;
  updated: string | null;
  updated_by: string | null;
  close_reason?: string | null;
  approve_note?: string | null;
}

export interface Scenario {
  scenario_id: string;
  base_scenario_id: string;
  scenario_name: string | null;
  product_cd: string[] | null;
  channel_cd: string[] | null;
  sas_camp_code: string | null;
  start_scenario_dt: string | null;
  end_scenario_dt: string | null;
  plan_conversion: number | null;
  uploading_type_cd: string | null;
  segment_cd: string[] | null;
  scenario_status_cd: string | null;
  is_model: boolean | null;
  model_cd: string[] | null;
  created_by: string | null;
  created: string | null;
  updated_by: string | null;
  updated: string | null;
  status_updated: string | null;
  activity_type_cd: string | null;
  campaign_id: string | null;
}

export interface CampaignsFilters {
  campaign_name?: string;
  campaign_kind_cd?: string;
  tags?: string[];
  campaign_manager?: string;
  campaign_status_cd?: string;
  created?: string;
  status_updated?: string;
}

export interface ScenariosFilters {
  product_cd?: string[];
  segment_cd?: string[];
  start_scenario_dt?: string;
  end_scenario_dt?: string;
  scenario_id?: string;
  uploading_type_cd?: string;
  activity_type_cd?: string;
}

export interface OrdersFilters {
  order_name?: string;
  order_manager?: string;
}

export interface PositionsFilters {
  position_name?: string;
  color?: string;
  model_id?: string;
  container?: string;
  status?: string;
  position_id?: string;
}

export interface FilterData {
  ordering?: string;
  campaigns?: CampaignsFilters;
  scenarios?: ScenariosFilters;
}
export interface ContainerFilters {
  start_plan_delivery_dt?: string;
  end_plan_delivery_dt?: string;
}
export interface FilterDataOrder {
  ordering?: string;
  orders?: OrdersFilters;
  positions?: PositionsFilters;
  containers?: ContainerFilters;
}

export interface ScreenData {
  page: number;
  count: number;
  pages: number;
  total?: number;
}

export interface RefBook {
  internal_code: string;
  name: string;
  is_deleted: boolean;
}

export interface User {
  id: string;
  org_id: string;
  email_contact: string | null;
  email_contact_new: string | null;
  phone_contact: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  is_active: boolean;
  is_email_confirmed: boolean;
  is_registered: boolean;
}

export interface Container {
  id: string;
  // internal_code: string;
  name: string;
  plan_delivery_dt: string | null;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Team {
  code: string;
  product_code: string;
  team_name: string;
  team_description: string;
  is_deleted: boolean;
}

export type NestedKeyOf<T, Key = keyof T> = Key extends keyof T &
  (string | number)
  ? `${Key}` | (T[Key] extends object ? `${Key}.${NestedKeyOf<T[Key]>}` : never)
  : never;

// export type NestedKeyOf<ObjectType extends object> = {
//   [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
//     ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
//     : `${Key}`;
// }[keyof ObjectType & (string | number)];

// export type NestedKey<O extends Record<string, unknown>> = {
//   [K in Extract<keyof O, string>]: O[K] extends Array<any>
//     ? K
//     : O[K] extends Record<string, unknown>
//     ? `${K}` | `${K}.${NestedKey<O[K]>}`
//     : K;
// }[Extract<keyof O, string>];

// export interface OrderPositionSortItem {
//   id: NestedKeyOf<OrderPosition>;
//   desc: boolean;
// }

export interface OrderPositionSortItem<
  T extends OrderPositionGroups | OrderPosition
> {
  id: NestedKeyOf<T>;
  desc: boolean;
}

interface ContainerFile {
  name: string;
  plan_delivery_dt: string;
}

interface OrderPositionFile {
  description: string;
  articul_RU: string;
  model_number: string;
  count: number;
  reserved_count: number;
  colour: string;
  container: ContainerFile;
}

export type UserFileFilter = Pick<
  User,
  "first_name" | "middle_name" | "last_name"
>;
interface OrderManagerFile {
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface OrderFile {
  name: string;
  description: string;
  create_date: string;
  manager: OrderManagerFile;
  order_position: OrderPositionFile[];
}

const containerFileSchema: JSONSchema7 = {
  type: "object",
  properties: {
    name: { type: "string" },
    plan_delivery_dt: {
      type: "string",
      pattern: "^[0-9]{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$",
    },
  },
  required: ["name"],
};

const orderPositionFileSchema: JSONSchema7 = {
  //$schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  properties: {
    description: { type: "string" },
    articul_RU: { type: "string" },
    model_number: { type: "string" },
    count: { type: "integer" },
    colour: { type: "string" },
    container: containerFileSchema,
  },
  required: [
    "description",
    "articul_RU",
    "model_number",
    "count",
    "colour",
    "container",
  ],
};

// export const orderFileSchema: JSONSchemaType<OrderFile> = {
//   type: "object",
//   properties: {
//     name: { type: "string", nullable: true },
//     description: { type: "string", nullable: true },
//     create_date: { type: "string", nullable: true },
//     manager: { type: "string", nullable: true },
//     order_position: {
//       type: "array",
//       items: orderPositionFileSchema,
//     },
//   },
//   required: ["name", "description", "create_date", "manager", "order_position"],
// };

const managerFileSchema: JSONSchema7 = {
  type: "object",
  properties: {
    first_name: { type: "string" },
    last_name: { type: "string" },
    middle_name: { type: "string" },
  },
  required: ["first_name", "last_name", "middle_name"],
};

export const orderFileSchema: JSONSchema7 = {
  // $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    create_date: { type: "string" },
    manager: managerFileSchema,
    order_position: {
      type: "array",
      items: orderPositionFileSchema,
    },
  },
  required: ["name", "description", "create_date", "order_position", "manager"],
};

// export type OrderFile = JTDDataType<typeof orderFileSchema>;
