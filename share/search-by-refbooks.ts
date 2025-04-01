import { ACTIVITY_GROUPS } from "../data/refbooks/activity-groups";
import { ACTIVITY_TYPES } from "../data/refbooks/activity-types";
import { CAMPAIGN_KINDS } from "../data/refbooks/campaign-kinds";
import { CAMPAIGN_STATUSES } from "../data/refbooks/campaign-statuses";
import { CHANNELS } from "../data/refbooks/channels";
import { COLORS } from "../data/refbooks/colors";
import { CONTAINERS } from "../data/refbooks/containers";
import { MODEL_NAMES } from "../data/refbooks/model-names";
import { MODELS } from "../data/refbooks/models";
import { POSITION_ITEM_STATUS } from "../data/refbooks/position-item-status";
import { PRODUCTS } from "../data/refbooks/products";
import { SEGMENTS } from "../data/refbooks/segments";
import { UPLOADING_TYPES } from "../data/refbooks/uploading-types";
import { TAGS } from "../data/tags/tags";
import { RefCode } from "./constants";

export const searchByRrefbooks = (ref_code: RefCode, substring: string) => {
  let refbook: any;
  switch (ref_code) {
    case RefCode.ACTIVITY_GROUP: {
      refbook = ACTIVITY_GROUPS;
      break;
    }
    case RefCode.TAGS: {
      refbook = TAGS;
      break;
    }
    case RefCode.CAMPAIGN_KIND:
      refbook = CAMPAIGN_KINDS;
      break;
    case RefCode.ACTIVITY_TYPE:
      refbook = ACTIVITY_TYPES;
      break;
    case RefCode.PRODUCT: {
      refbook = PRODUCTS;
      break;
    }
    case RefCode.CHANNEL: {
      refbook = CHANNELS;
      break;
    }
    case RefCode.UPLOADING_TYPE: {
      refbook = UPLOADING_TYPES;
      break;
    }
    case RefCode.SEGMENT: {
      refbook = SEGMENTS;
      break;
    }
    case RefCode.MODEL: {
      refbook = MODEL_NAMES;
      break;
    }
    case RefCode.CAMPAIGN_STATUS: {
      refbook = CAMPAIGN_STATUSES;
      break;
    }
    case RefCode.COLOR: {
      refbook = COLORS;
      break;
    }
    case RefCode.CONTAINER: {
      refbook = CONTAINERS;
      break;
    }
    case RefCode.STATUS: {
      refbook = POSITION_ITEM_STATUS;
      break;
    }
    case RefCode.MODEL_RU: {
      refbook = MODELS;
      break;
    }
    default:
      refbook = [];
  }

  const flatSearch = () =>
    refbook.filter((it: any) => {
      const name = (it.name || "").toLowerCase().trim();
      const search = (substring || "").toLowerCase().trim();
      return name.includes(search);
    });

  return flatSearch();
};
