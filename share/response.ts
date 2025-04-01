import { ErrorCode, ErrorModal, Screen } from "./constants";
import { FilterData, ScreenData } from "./interfaces";
import { sanitize } from "./sanitize";

export enum RESPONSE_STATUS {
  OK = "ok",
  FAIL = "fail",
}

export enum DELTA_ACTION {
  MERGE = "merge",
  OVERRIDE = "override",
}

const defaultResult = () => ({
  response: RESPONSE_STATUS.OK,
  code: null,
  message: null,
  inner_errors: null,
  modal: null,
  popup: null,
  screen: null,
  screen_data: null,
  filter_data: null,
  bad_attributes: null,
  data: {},
  delta_action: "",
  delta: {},
  instructions: undefined,
});

export const defaultSimpleResult = () => ({
  response: RESPONSE_STATUS.OK,
  data: {},
});

export const createResponse = ({
  id,
  response,
  code,
  message,
  inner_errors,
  modal,
  popup,
  screen,
  screen_data,
  filter_data,
  bad_attributes,
  data,
  delta_action,
  delta,
  instructions,
}: Partial<{
  id: string;
  response: RESPONSE_STATUS;
  code: ErrorCode;
  message: string;
  inner_errors: any;
  modal: ErrorModal;
  popup: ErrorModal;
  screen?: Screen | null;
  screen_data?: ScreenData | null;
  filter_data?: FilterData | null;
  bad_attributes: any;
  data: any;
  delta_action: DELTA_ACTION;
  delta: any;
  instructions: any;
}>) => {
  const jsonrpc = "2.0";

  const result = {
    ...defaultResult(),
    ...sanitize({
      response,
      code,
      message,
      inner_errors,
      modal,
      popup,
      screen,
      screen_data,
      filter_data,
      bad_attributes,
      data,
      delta_action,
      delta,
      instructions,
    }),
  };

  return { id, jsonrpc, result };
};

export const createErrorResponse = (
  id: string,
  code: ErrorCode,
  message: string,
  modal?: ErrorModal,
  popup?: ErrorModal
) => {
  const response = RESPONSE_STATUS.FAIL;
  const data = {};
  let delta = {};
  let delta_action = DELTA_ACTION.MERGE;
  const bad_attributes = null;
  return createResponse({
    id,
    response,
    code,
    message,
    modal,
    popup,
    bad_attributes,
    data,
    delta,
    delta_action,
  });
};
