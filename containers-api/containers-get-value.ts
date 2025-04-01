import { Request, Response } from "express";
import { createResponse, DELTA_ACTION } from "../share/response";
import { CONTAINERS } from "../data/containers/containers";

const containersCreate = (id: string, substring: string) => {
  const currentContainers = CONTAINERS.filter((it) => {
    const name = (it.name || "").toLowerCase().trim();
    const search = (substring || "").toLowerCase().trim();
    return name.includes(search);
  });
  const data = { containers: currentContainers };
  const delta_action = DELTA_ACTION.OVERRIDE;
  return createResponse({ id, data, delta_action });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const { containers } = params;
  const { substring } = containers;

  const responseBody = containersCreate(id, substring);

  resp.json(responseBody);
};
