import { Request, Response } from "express";
import { ErrorCode, ErrorMessage, ErrorModal } from "../share/constants";
import { createErrorResponse } from "../share/response";

const notFoundResponse = (id: string) => {
  const code = ErrorCode.NOT_FOUND;
  const message = ErrorMessage.NOT_FOUND;
  const modal = ErrorModal.FAIL;
  return createErrorResponse(id, code, message, modal);
};

const noAccessResponse = (id: string) => {
  const code = ErrorCode.NO_ACCESS;
  const message = ErrorMessage.NO_ACCESS;
  const modal = ErrorModal.NO_ACCESS;
  return createErrorResponse(id, code, message, modal);
};

export const respond = (req: Request, resp: Response) => {
  const { id } = req.body;
  const { campaign_id } = req.body.params;
  if (campaign_id) {
    const path = "data/preview/files/invoice.pdf";
    // setTimeout(() => resp.download(path), 5000);
    resp.download(path);
  } else {
    resp.json(notFoundResponse(id));
  }
};
