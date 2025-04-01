import { Request, Response } from "express";
import { TAGS } from "../data/tags/tags";
import { createResponse, DELTA_ACTION } from "../share/response";

const tagsGetValue = (id: string, substring: string) => {
  const currentTags = TAGS.filter((it) => {
    const name = (it.name || "").toLowerCase().trim();
    const search = (substring || "").toLowerCase().trim();
    return name.includes(search);
  });

  const data = { tags: currentTags };
  const delta_action = DELTA_ACTION.OVERRIDE;
  return createResponse({ id, data, delta_action });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const { tags } = params;
  const { substring } = tags;

  const responseBody = tagsGetValue(id, substring);

  resp.json(responseBody);
};
