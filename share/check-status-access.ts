import { CampaignStatus } from "./constants";

const STATUS_TO: {[key in CampaignStatus]?: number} = {};
const NEW =             STATUS_TO[CampaignStatus.NEW] =            0b1000000000;
const EDIT =            STATUS_TO[CampaignStatus.EDIT] =           0b0100000000;
const NEED_APPROVE =    STATUS_TO[CampaignStatus.NEED_APPROVE] =   0b0010000000;
const NEED_EDIT =       STATUS_TO[CampaignStatus.NEED_EDIT] =      0b0001000000;
const DEACTIVATE =      STATUS_TO[CampaignStatus.DEACTIVATE] =     0b0000100000;
const APPROVE =         STATUS_TO[CampaignStatus.APPROVE] =        0b0000010000;
const PLAN =            STATUS_TO[CampaignStatus.PLAN] =           0b0000001000;
const RUN =             STATUS_TO[CampaignStatus.RUN] =            0b0000000100;
const RUNNING =         STATUS_TO[CampaignStatus.RUNNING] =        0b0000000010;
const FINISH =          STATUS_TO[CampaignStatus.FINISH] =         0b0000000001;

// TODO ПЕРЕВОДЫ СТАТУСОВ ???
const CAN_GO: {[key in CampaignStatus]?: number} = {};
CAN_GO[CampaignStatus.NEW] =            EDIT | NEED_APPROVE | DEACTIVATE;
CAN_GO[CampaignStatus.EDIT] =           NEED_APPROVE | DEACTIVATE;
CAN_GO[CampaignStatus.NEED_APPROVE] =   NEED_EDIT | DEACTIVATE | APPROVE;
CAN_GO[CampaignStatus.NEED_EDIT] =      EDIT | NEED_APPROVE | DEACTIVATE;
CAN_GO[CampaignStatus.APPROVE] =        EDIT | DEACTIVATE | PLAN | RUN;
CAN_GO[CampaignStatus.PLAN] =           DEACTIVATE | APPROVE | RUN;
CAN_GO[CampaignStatus.RUN] =            APPROVE;

export const checkStatusAccess = (statusFrom: CampaignStatus, statusTo: CampaignStatus) => {
    return Boolean((CAN_GO[statusFrom] as number) & (STATUS_TO[statusTo] as number));
};
