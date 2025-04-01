import { Request, Response } from "express";
import { respond as scenariosShowCreateRespond } from "./scenarios-show-create";
import { respond as scenariosCreateRespond } from "./scenarios-create";
import { respond as scenariosCancelCreateRespond } from "./scenarios-cancel-create";
import { respond as scenariosDeleteRespond } from "./scenarios-delete";
import { respond as scenariosShowEditRespond } from "./scenarios-show-edit";
import { respond as scenariosUpdateRespond } from "./scenarios-update";
import { respond as scenariosCancelEditRespond } from "./scenarios-cancel-edit";
import { Paths } from "../share/constants";

const respond = (req: Request, resp: Response) => {
  const { method } = req.body;
  switch (method) {
    case "scenarios-show-create":
      scenariosShowCreateRespond(req, resp);
      break;
    case "scenarios-create":
      scenariosCreateRespond(req, resp);
      break;
    case "scenarios-cancel-create":
      scenariosCancelCreateRespond(req, resp);
      break;
    case "scenarios-delete":
      scenariosDeleteRespond(req, resp);
      break;
    case "scenarios-show-edit":
      scenariosShowEditRespond(req, resp);
      break;
    case "scenarios-update":
      scenariosUpdateRespond(req, resp);
      break;
    case "scenarios-cancel-edit":
      scenariosCancelEditRespond(req, resp);
      break;
    default:
      break;
  }
};

export default {
  path: Paths.SCENARIOS,
  method: "POST",
  respond,
};
