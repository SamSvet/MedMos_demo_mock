import { Request, Response } from "express";
import { Paths } from "../share/constants";
import { respond as campaignsListRespond } from "./campaigns-list";
import { respond as campaignsViewRespond } from "./campaigns-view";
import { respond as campaignsShowEditRespond } from "./campaigns-show-edit";
import { respond as campaignsCancelEditRespond } from "./campaigns-cancel-edit";
import { respond as campaignsUpdateRespond } from "./campaigns-update";
import { respond as campaignsShowCreateRespond } from "./campaigns-show-create";
import { respond as campaignsCreateNewRespond } from "./campaigns-create-new";
import { respond as campaignsCancelCreateRespond } from "./campaigns-cancel-create";
import { respond as campaignsDeactivateRespond } from "./campaigns-deactivate";
import { respond as campaignsApproveRespond } from "./campaigns-approve";
import { respond as campaignsNeedEditRespond } from "./campaigns-need-edit";
import { respond as campaignsUpdateApproveRespond } from "./campaigns-update-approve";
import { respond as campaignsGetPdfRespond } from "./campaigns-get-pdf";
import { respond as campaignsLockProlongRespond } from "./campaigns-lock-prolong";
import { respond as campaignsApprovalRespond } from "./campaigns-approval";

const respond = (req: Request, resp: Response) => {
  const { method } = req.body;
  switch (method) {
    case "campaigns-list":
      campaignsListRespond(req, resp);
      break;
    case "campaigns-view":
      campaignsViewRespond(req, resp);
      break;
    case "campaigns-show-edit":
      campaignsShowEditRespond(req, resp);
      break;
    case "campaigns-cancel-edit":
      campaignsCancelEditRespond(req, resp);
      break;
    case "campaigns-update":
      campaignsUpdateRespond(req, resp);
      break;
    case "campaigns-update-approve":
      campaignsUpdateApproveRespond(req, resp);
      break;
    case "campaigns-show-create":
      campaignsShowCreateRespond(req, resp);
      break;
    case "campaigns-create-new":
      campaignsCreateNewRespond(req, resp);
      break;
    case "campaigns-cancel-create":
      campaignsCancelCreateRespond(req, resp);
      break;
    case "campaigns-deactivate":
      campaignsDeactivateRespond(req, resp);
      break;
    case "campaigns-approve":
      campaignsApproveRespond(req, resp);
      break;
    case "campaigns-need-edit":
      campaignsNeedEditRespond(req, resp);
      break;
    case "campaigns-get-pdf":
      campaignsGetPdfRespond(req, resp);
      break;
    case "campaigns-lock-prolong":
      campaignsLockProlongRespond(req, resp);
      break;
    case "campaigns-approval":
      campaignsApprovalRespond(req, resp);
      break;
    default:
      break;
  }
};

export default {
  path: Paths.CAMPAIGNS,
  method: "POST",
  respond,
};
