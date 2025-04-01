import { Request, Response } from "express";
import { respond as positionsShowCreateRespond } from "./positions-show-create";
import { respond as positionsCreateRespond } from "./positions-create";
import { respond as positionsCancelCreateRespond } from "./positions-cancel-create";
// import { respond as positionsDeleteRespond } from "./positions-delete";
import { respond as positionsShowEditRespond } from "./positions-show-edit";
import { respond as positionsShowReserveRespond } from "./positions-show-reserve";
import { respond as positionsUpdateRespond } from "./positions-update";
import { respond as positionsListRespond } from "./positions-list";
import { respond as positionsCancelEditRespond } from "./positions-cancel-edit";
import { Paths } from "../share/constants";

const respond = (req: Request, resp: Response) => {
  const { method } = req.body;
  switch (method) {
    case "positions-show-create":
      positionsShowCreateRespond(req, resp);
      break;
    case "positions-create":
      positionsCreateRespond(req, resp);
      break;
    case "positions-cancel-create":
      positionsCancelCreateRespond(req, resp);
      break;
    // case "positions-delete":
    //   positionsDeleteRespond(req, resp);
    //   break;
    case "positions-show-edit":
      positionsShowEditRespond(req, resp);
      break;
    case "positions-show-reserve":
      positionsShowReserveRespond(req, resp);
      break;
    case "positions-list":
      positionsListRespond(req, resp);
      break;
    case "positions-update":
      positionsUpdateRespond(req, resp);
      break;
    case "positions-cancel-edit":
      positionsCancelEditRespond(req, resp);
      break;
    default:
      break;
  }
};

export default {
  path: Paths.POSITIONS,
  method: "POST",
  respond,
};
