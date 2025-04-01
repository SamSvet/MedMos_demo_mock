import { RefBook } from "../../share/interfaces";

const modelNames: RefBook[] = [
  {
    internal_code: "1.1",
    name: "Look-alike для продукта аккредитив",
    is_deleted: false,
  },
  {
    internal_code: "1.2",
    name: "Рекомендация закупок",
    is_deleted: false,
  },
  {
    internal_code: "1.3",
    name: 'Модель извлечения контекста "Командировки"',
    is_deleted: false,
  },
  {
    internal_code: "1.4",
    name: 'Модель извлечения контекста "Налоговая консультация"',
    is_deleted: false,
  },
];

export const MODEL_NAMES = modelNames.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
