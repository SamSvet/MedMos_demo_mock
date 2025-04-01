import { Request, Response } from "express";
import { Paths } from "../share/constants";
import { respond as ordersListRespond } from "./orders-list";
import { respond as ordersShowCreateRespond } from "./orders-show-create";
import { respond as ordersCancelCreateRespond } from "./orders-cancel-create";
import { respond as ordersCreateNewRespond } from "./orders-create-new";
import { respond as ordersShowEditRespond } from "./orders-show-edit";
import { respond as ordersViewRespond } from "./orders-view";
import { respond as ordersCancelEditRespond } from "./orders-cancel-edit";
import { respond as ordersUpdateRespond } from "./orders-update";
import { respond as ordersGetPdfRespond } from "./orders-get-pdf";
import { respond as ordersUploadFile } from "./orders-upload-file";
import { respond as ordersDownloadFile } from "./orders-download-file";

const respond = (req: Request, resp: Response) => {
  // const { method } = req.body;
  const { method } = req.body.request ? JSON.parse(req.body.request) : req.body;
  switch (method) {
    case "orders-list":
      ordersListRespond(req, resp);
      break;
    case "orders-show-create":
      ordersShowCreateRespond(req, resp);
      break;
    case "orders-cancel-create":
      ordersCancelCreateRespond(req, resp);
      break;
    case "orders-create-new":
      ordersCreateNewRespond(req, resp);
      break;
    case "orders-upload-file":
      const file = req.files ? (req.files[0] as Express.Multer.File) : null;
      ordersUploadFile(
        { body: JSON.parse(req.body.request) } as Request,
        file,
        resp
      );
      break;
    case "orders-show-edit":
      ordersShowEditRespond(req, resp);
      break;
    case "orders-show":
      ordersViewRespond(req, resp);
      break;
    case "orders-cancel-edit":
      ordersCancelEditRespond(req, resp);
      break;
    case "orders-update":
      ordersUpdateRespond(req, resp);
      break;
    case "orders-get-pdf-all":
      ordersGetPdfRespond(req, resp);
    case "orders-download-file":
      ordersDownloadFile(req, resp);
      break;
    default:
      break;
  }
};
export default {
  path: Paths.ORDERS,
  method: "POST",
  respond,
};
