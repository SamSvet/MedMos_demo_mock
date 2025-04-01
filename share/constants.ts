enum Paths {
  CAMPAIGNS = "/api/campaigns",
  DICTIONARIES = "/api/dictionaries",
  TAGS = "/api/tags",
  USERS = "/api/users",
  SCENARIOS = "/api/scenarios",
  CAMAPAIGNS_GET_APPROVALLIST = "/api/campaigns-get-approvallist",
  ORDERS = "/api/orders",
  COLORS = "/api/colors",
  POSITIONS = "/api/positions",
  CONTAINERS = "/api/containers",
}

enum Screen {
  CAMPAIGNS_LIST = "campaigns.list",
  CAMPAIGNS_VIEW = "campaigns.view",
  CAMPAIGNS_CREATE = "campaigns.create",
  CAMPAIGNS_EDIT = "campaigns.edit",
  SCENARIOS_CREATE = "scenarios.create",
  SCENARIOS_EDIT = "scenarios.edit",
  CAMPAIGNS_APPROVAL = "campaigns.approval",
  ORDERS_LIST = "orders.list",
  ORDERS_VIEW = "orders.view",
  ORDERS_CREATE = "orders.create",
  ORDERS_EDIT = "orders.edit",
  ORDERS_SHOW = "orders.show",
  POSITIONS_CREATE = "positions.create",
  POSITIONS_EDIT = "positions.edit",
  POSITIONS_RESERVE = "positions.reserve",
  POSITIONS_LIST = "positions.list",
}

enum CampaignStatus {
  NEW = "new",
  EDIT = "edit",
  NEED_APPROVE = "need_approve",
  NEED_EDIT = "need_edit",
  DEACTIVATE = "deactivate",
  APPROVE = "approve",
  PLAN = "plan",
  RUN = "run",
  RUNNING = "running",
  FINISH = "finish",
}

enum PositionStatus {
  NEW = "new",
  WAY = "way",
  STOCK = "stock",
}

enum RefCode {
  ACTIVITY_GROUP = "sbc_activity_group",
  CAMPAIGN_MANAGER = "users",
  USERS = "users",
  CONTAINERS = "containers",
  TAGS = "tags",
  CAMPAIGN_KIND = "sbc_campaign_kind",
  ACTIVITY_TYPE = "sbc_activity_type",
  PRODUCT = "sbc_cc_product",
  CHANNEL = "sbc_channel",
  UPLOADING_TYPE = "sbc_uploading_types",
  SEGMENT = "sbc_segment",
  MODEL = "sbc_model",
  CAMPAIGN_STATUS = "sbc_campaign_status",
  TEAM = "teams",
  COLOR = "dct_color",
  CONTAINER = "dct_container",
  STATUS = "dct_status",
  MODEL_RU = "dct_model",
}

enum RefCodeOrder {
  USERS = "dct_user",
  COLOR = "dct_color",
  MODEL = "dct_model",
  CONTAINER = "dct_container",
  POSITION_STATUS = "dct_status",
}

enum ErrorCode {
  NOT_AUTHENTICATED = -1,
  NOT_AUTHORIZED = -2,
  NO_PAGE = -3,
  BAD_PARAMS = -4,
  INVALID_OPERATION = -5,
  LOCKED = -201,
  NOT_FOUND = -7,
  NO_ACCESS = -8,
  SYSTEM_ERROR = -32400,
}

enum ErrorModal {
  BAD_PARAMS = "badParams",
  FAIL = "fail",
  NO_ACCESS = "noAccess",
  SYSTEM_ERROR = "systemError",
  NOT_FOUND = "notFound",
  NO_PAGE = "noPage",
  INVALID_OPERATION = "invalidOperation",
  LOCKED = "locked",
}

enum ErrorMessage {
  NO_ACCESS = "Недостаточно прав доступа.",
  SYSTEM_ERROR = "На сервере произошла непредвиденная ошибка. Пожалуйста, обратитесь к администратору.",
  NOT_FOUND = "Данные не найдены.",
  BAD_PARAMS = "Необходимо скорректировать введенные данные.",
  INVALID_OPERATION = "Недопустимая операция",
  LOCKED = "Объект закблокирован Олололей Ололоевой",
  NO_PAGE = "Запрошенная страница не найдена.",
  FAIL_RESPONSE = "Произошла ошибка.",
}

const errModals = {
  [ErrorCode.BAD_PARAMS]: ErrorModal.BAD_PARAMS,
  [ErrorCode.NO_ACCESS]: ErrorModal.NO_ACCESS,
  [ErrorCode.SYSTEM_ERROR]: ErrorModal.SYSTEM_ERROR,
  [ErrorCode.NOT_FOUND]: ErrorModal.NOT_FOUND,
  [ErrorCode.NO_PAGE]: ErrorModal.NO_PAGE,
  [ErrorCode.NOT_AUTHENTICATED]: ErrorModal.FAIL,
  [ErrorCode.NOT_AUTHORIZED]: ErrorModal.FAIL,
  [ErrorCode.LOCKED]: ErrorModal.INVALID_OPERATION,
  [ErrorCode.INVALID_OPERATION]: ErrorModal.INVALID_OPERATION,
};

const errMessages = {
  [ErrorCode.NO_ACCESS]: ErrorMessage.NO_ACCESS,
  [ErrorCode.SYSTEM_ERROR]: ErrorMessage.SYSTEM_ERROR,
  [ErrorCode.NOT_FOUND]: ErrorMessage.NOT_FOUND,
  [ErrorCode.BAD_PARAMS]: ErrorMessage.BAD_PARAMS,
  [ErrorCode.NO_PAGE]: ErrorMessage.NO_PAGE,
  [ErrorCode.NOT_AUTHENTICATED]: ErrorMessage.FAIL_RESPONSE,
  [ErrorCode.NOT_AUTHORIZED]: ErrorMessage.FAIL_RESPONSE,
  [ErrorCode.LOCKED]: ErrorMessage.LOCKED,
  [ErrorCode.INVALID_OPERATION]: ErrorMessage.INVALID_OPERATION,
};

export interface Modal {
  code: ErrorCode;
  message: string;
  modal?: ErrorModal;
  popup?: ErrorModal;
}

const getErrorModal = (
  code: ErrorCode,
  type: "modal" | "popup" = "modal"
): Modal | undefined => {
  const modal = errModals[code];
  if (!modal) {
    return undefined;
  }
  const message = errMessages[code] || "";
  return { code, [type]: modal, message };
};

export {
  Paths,
  Screen,
  ErrorCode,
  ErrorModal,
  ErrorMessage,
  CampaignStatus,
  RefCode,
  getErrorModal,
  errModals,
  RefCodeOrder,
  PositionStatus,
};
