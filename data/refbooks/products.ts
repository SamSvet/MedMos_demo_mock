import { RefBook } from "../../share/interfaces";

const products: RefBook[] = [
  { internal_code: "1", name: "Вексель", is_deleted: false },
  { internal_code: "2", name: "ЮMoney-Бизнес профиль", is_deleted: false },
  {
    internal_code: "3",
    name: "GM. Открытие брокерского счета",
    is_deleted: false,
  },
  { internal_code: "4", name: "Seeneco-Бизнес Аналитика", is_deleted: false },
  { internal_code: "5", name: "Страх корп карт для ИП", is_deleted: false },
  { internal_code: "6", name: "Центр управления счетами", is_deleted: false },
  {
    internal_code: "7",
    name: "Внесение изменений в документы ИП и ООО",
    is_deleted: false,
  },
  {
    internal_code: "8",
    name: "СберКорус-Сервис проверки контрагентов (СберРейтинг-Официальные гос.источники)",
    is_deleted: false,
  },
  { internal_code: "9", name: "Залоговое страхование", is_deleted: false },
  { internal_code: "10", name: "Кредитная бизнес-карта", is_deleted: false },
  { internal_code: "11", name: "Оборот. кредит-е", is_deleted: false },
  { internal_code: "12", name: "1С-БИТРИКС-CRM24", is_deleted: false },
  {
    internal_code: "13",
    name: "Таможенная карта-Таможенные платежи",
    is_deleted: false,
  },
  {
    internal_code: "14",
    name: "Сбербанк страхование жизни-Защита сотрудников",
    is_deleted: false,
  },
  { internal_code: "15", name: "Моя доставка", is_deleted: false },
  {
    internal_code: "16",
    name: "СберКорус-Конструктор документов",
    is_deleted: false,
  },
  { internal_code: "17", name: "Электронный архив", is_deleted: false },
  {
    internal_code: "18",
    name: "СберКорус-Эл. подпись для торгов (федеральная)",
    is_deleted: false,
  },
  { internal_code: "19", name: "Самоинкассация", is_deleted: false },
  {
    internal_code: "20",
    name: "Эвотор-Покупка смарт-терминала",
    is_deleted: false,
  },
  {
    internal_code: "21",
    name: "Сбербанк-BBP-Экспортный акселератор",
    is_deleted: false,
  },
  { internal_code: "22", name: "Факторинг", is_deleted: false },
  { internal_code: "23", name: "Отчетность в Гос. Органы", is_deleted: false },
  { internal_code: "24", name: "Банковская гарантия", is_deleted: false },
  { internal_code: "25", name: "Страхование бизнес-карт", is_deleted: false },
  {
    internal_code: "26",
    name: "Эвотор-Страхование онлайн-касс Эвотор",
    is_deleted: false,
  },
  { internal_code: "27", name: "Интернет-эквайринг", is_deleted: false },
  {
    internal_code: "28",
    name: "Seeneco-Сервис выставления счетов",
    is_deleted: false,
  },
  {
    internal_code: "29",
    name: "Юридические решения-Юрист для бизнеса",
    is_deleted: false,
  },
  {
    internal_code: "30",
    name: "СберТелеком-Мобильная Виртуальная АТС",
    is_deleted: false,
  },
  {
    internal_code: "31",
    name: "СберТелеком-Корпоративная мобильная связь",
    is_deleted: false,
  },
  {
    internal_code: "32",
    name: "Моё дело-Моя бухгалтерия Онлайн",
    is_deleted: false,
  },
  {
    internal_code: "33",
    name: "СберРешения-Бухгалтерия для ИП",
    is_deleted: false,
  },
  {
    internal_code: "34",
    name: "СберРешения-Моя бухгалтерия Аутсорсинг",
    is_deleted: false,
  },
  { internal_code: "35", name: "Логнекс-Моя торговля", is_deleted: false },
  {
    internal_code: "36",
    name: "СберСервис-Поддержка POS-терминалов",
    is_deleted: false,
  },
  { internal_code: "37", name: "Овердрафт", is_deleted: false },
  {
    internal_code: "38",
    name: "Овердрафт (Бизнес-/Экспресс-)",
    is_deleted: false,
  },
  { internal_code: "39", name: "Продажа недвижимости", is_deleted: false },
  {
    internal_code: "40",
    name: "Эвотор-Аренда смарт-терминала",
    is_deleted: false,
  },
];

export const PRODUCTS = products.map((x) => ({
  ...{
    internal_code: "",
    name: "",
    is_deleted: false,
  },
  ...x,
}));
