import { Container } from "../../share/interfaces";
import { CONTAINERS } from "./containers";

type ContainerBadParamT = { [key in keyof Container]?: string[] };
type ContainerValidateFn = (
  value: string,
  defaultValue: ContainerBadParamT
) => ContainerBadParamT;

const validateName = (value: string, defaultValue: ContainerBadParamT) => {
  if (!value) {
    return { name: ["Обязательное поле"] };
  }
  if (CONTAINERS.map((c) => c.name).includes(value)) {
    return { name: ["Контейнер с таким именем уже существует"] };
  }
  return defaultValue;
};

const validateDeliveryDt = (
  value: string,
  defaultValue: ContainerBadParamT
) => {
  if (!value) {
    return defaultValue;
  }
  try {
    if (new Date(value) < new Date()) {
      return { plan_delivery_dt: ["Дата доставки не может быть из прошлого"] };
    }
  } catch (e) {
    console.log(e);
    return { plan_delivery_dt: ["Дата доставки"] };
  }
  return defaultValue;
};

export const validateContainer = (container: Omit<Container, "id">) => {
  const defaultBadParams: ContainerBadParamT = {};
  const validateMap: Map<keyof Container, ContainerValidateFn> = new Map<
    keyof Container,
    ContainerValidateFn
  >([
    ["name", validateName],
    ["plan_delivery_dt", validateDeliveryDt],
  ]);

  return ["name", "plan_delivery_dt"].reduce((r, o) => {
    const curBadParam =
      validateMap.get(o as keyof Container)?.(container[o], defaultBadParams) ||
      defaultBadParams;
    return { ...r, ...curBadParam };
  }, defaultBadParams);
};
