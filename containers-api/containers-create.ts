import { Request, Response } from "express";
import {
  createErrorResponse,
  createResponse,
  DELTA_ACTION,
} from "../share/response";
import { CONTAINERS } from "../data/containers/containers";
import { Container } from "../share/interfaces";
import { v4 } from "uuid";
import { validateContainer } from "../data/containers/containers-utils";
import { ErrorCode, getErrorModal } from "../share/constants";
import { sanitize } from "../share/sanitize";

const isEmptyObject = (obj) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

const containersGetValue = (id: string, newOption: Container) => {
  const newContainer: Container = { ...newOption, id: v4() };
  const badParamsContainer = validateContainer(newContainer);

  const delta_action = DELTA_ACTION.OVERRIDE;

  if (!isEmptyObject(badParamsContainer)) {
    return createResponse({
      id,
      data: {},
      delta_action,
      bad_attributes: sanitize({ ...badParamsContainer }),
    });
  }

  CONTAINERS.push(newContainer);
  const data = {
    containers: isEmptyObject(badParamsContainer) ? [newContainer] : [],
  };

  return createResponse({ id, data, delta_action });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const {
    containers: { newOption },
  } = params;
  //   const { substring } = containers;

  const responseBody = containersGetValue(id, newOption);

  resp.json(responseBody);
};
