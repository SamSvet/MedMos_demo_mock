import { RefBook } from "../../share/interfaces";

const activityTypes: RefBook[] = [
  {
    internal_code: "1.1",
    name: "Новая продажа",
    is_deleted: false,
  },
  {
    internal_code: "1.2",
    name: "Привлечение новых клиентов",
    is_deleted: false,
  },
  {
    internal_code: "1.3",
    name: "Follow-up",
    is_deleted: false,
  },
  {
    internal_code: "1.4",
    name: "Расширение сотрудничества",
    is_deleted: false,
  },
  {
    internal_code: "1.5",
    name: "Пролонгация",
    is_deleted: false,
  },
  {
    internal_code: "1.6",
    name: "Roll-over",
    is_deleted: false,
  },
  {
    internal_code: "1.7",
    name: "Продвижение сервиса/услуги",
    is_deleted: false,
  },
  {
    internal_code: "1.8",
    name: "Возврат",
    is_deleted: false,
  },
  {
    internal_code: "1.9",
    name: "Голос Клиента",
    is_deleted: false,
  },
  {
    internal_code: "2.1",
    name: "Новостные рассылки",
    is_deleted: false,
  },
  {
    internal_code: "2.2",
    name: "Сервисная информация",
    is_deleted: true,
  },
];

export const ACTIVITY_TYPES = activityTypes.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
