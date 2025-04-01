import { Request } from "express";
import { ACTIVITY_GROUPS } from "../data/refbooks/activity-groups";
import { ACTIVITY_TYPES } from "../data/refbooks/activity-types";
import { CAMPAIGNS } from "../data/campaigns/campaign-list";
import { SCENARIOS } from "../data/scenarios/scenarios";
import { TAGS } from "../data/tags/tags";
import { TEAMS } from "../data/users/teams";
import { USERS } from "../data/users/users";
import { ORDERS } from "../data/orders/orders";
import {
  POSITIONGROUPS,
  POSITIONS,
  POSITIONS_GROUPED,
  POSITIONS_GROUPED2,
} from "../data/positions/positions";
import { COLORS } from "../data/refbooks/colors";
import { CONTAINERS } from "../data/containers/containers";
import { MODELS } from "../data/refbooks/models";

export const showData = (req: Request) => {
  const entity = req.params.entity;
  switch (entity) {
    case "orders":
      return ORDERS;
    case "positions":
      return POSITIONS;
    case "positions_grouped":
      return POSITIONS_GROUPED2;
    case "positiongroups":
      return POSITIONGROUPS;
    case "colors":
      return COLORS;
    case "containers":
      return CONTAINERS;
    case "models":
      return MODELS;
    case "campaigns":
      return CAMPAIGNS;
    case "scenarios":
      return SCENARIOS;
    case "tags":
      return TAGS;
    case "users":
      return USERS;
    case "teams":
      return TEAMS;
    case "activity_groups":
      return ACTIVITY_GROUPS;
    case "activity_types":
      return ACTIVITY_TYPES;
    default:
      break;
  }
};
