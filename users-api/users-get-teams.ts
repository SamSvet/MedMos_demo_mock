import { Request, Response } from "express";
import { TEAMS } from "../data/users/teams";
import { createResponse, DELTA_ACTION } from "../share/response";

const usersGetTeams = (id: string, params: unknown) => {
  // const currentTeams = TEAMS.filter((it) => {
  //     const name = (it.team_name || "").toLowerCase().trim();
  //     const search = (substring || "").toLowerCase().trim();
  //     return name.includes(search);
  // });

  const data = { teams: TEAMS };
  const delta_action = DELTA_ACTION.OVERRIDE;
  return createResponse({ id, data, delta_action });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;

  const responseBody = usersGetTeams(id, params);

  resp.json(responseBody);
};
