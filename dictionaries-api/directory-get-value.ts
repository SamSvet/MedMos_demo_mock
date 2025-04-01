import { Request, Response } from "express";
import { searchByRrefbooks } from "../share/search-by-refbooks";
import { RefCode } from "../share/constants";
import { createResponse, DELTA_ACTION } from "../share/response";

const directoryGetValue = (
  id: string,
  ref_code: RefCode,
  substring: string
) => {
  const data = { [ref_code]: searchByRrefbooks(ref_code, substring) };
  const delta_action = DELTA_ACTION.OVERRIDE;
  return createResponse({ id, data, delta_action });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;
  const { ref_code, substring } = params;

  const responseBody = directoryGetValue(id, ref_code, substring);

  resp.json(responseBody);
};
