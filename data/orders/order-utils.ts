import { JSONSchema7 } from "json-schema";
import { RefCode, RefCodeOrder } from "../../share/constants";
import {
  Container,
  ContainerFilters,
  FilterDataOrder,
  IOrderPosition,
  NestedKeyOf,
  Order,
  OrderFile,
  OrderPosition,
  OrderPositionGroups,
  OrderPositionSortItem,
  OrdersFilters,
  Position,
  PositionItem,
  PositionItemGrouped2,
  RefBook,
  User,
} from "../../share/interfaces";
import { randomString } from "../../share/utils";
import {
  defaultPosition,
  POSITIONGROUPS,
  POSITIONS,
} from "../positions/positions";
import { COLORS } from "../refbooks/colors";
import { CONTAINERS } from "../refbooks/containers";
import { CONTAINERS as CONT } from "../containers/containers";
import { MODELS } from "../refbooks/models";
import { POSITION_ITEM_STATUS } from "../refbooks/position-item-status";
import { USERS } from "../users/users";
import Ajv from "ajv";

const checkValue = (value: unknown, filter: unknown) =>
  !filter || value == filter;

const checkSubstr = (value: string, filter: unknown) =>
  !filter || value.includes(String(filter));

export const checkRefArrayValue = <
  Entity extends { [key in keyof Entity]: unknown | unknown[] }
>(
  entity: Entity,
  filters: { [key in keyof Entity]?: string | string[] },
  field: keyof Entity
) => {
  if (
    !filters?.[field] ||
    (Array.isArray(filters?.[field]) && !filters?.[field]?.length)
  ) {
    return true;
  }

  const arr = (
    Array.isArray(entity[field]) ? entity[field] : [entity[field]]
  ) as string[];
  return Boolean(
    (arr as Entity[keyof Entity][])?.filter((x) =>
      Array.isArray(filters?.[field])
        ? filters?.[field]?.includes(x as string)
        : filters?.[field] == x
    ).length
  );
};

const checkDateValue = (date: string, filterDate?: string | null) => {
  return !filterDate || date.slice(0, 10) == filterDate.slice(0, 10);
};

const checkDateBetween = (
  date: string | null,
  filterDateStart?: string | null,
  filterDateEnd?: string | null
) => {
  const startDt = filterDateStart
    ? new Date(filterDateStart)
    : new Date("1900-01-01T00:00:00.000+03:00");
  const endDt = filterDateEnd
    ? new Date(filterDateEnd)
    : new Date("2100-01-01T00:00:00.000+03:00");
  const valueDt = new Date(date ? date : "1900-01-01T00:00:00.000+03:00");
  return valueDt <= endDt && valueDt >= startDt;
};

const propComparator =
  <
    T extends OrderPositionGroups | OrderPosition,
    P extends OrderPositionGroups | OrderPosition
  >(
    propName: NestedKeyOf<P>,
    isDesc: boolean = true
  ) =>
  (a: T, b: T): number => {
    const [rootProp, leafProp] = propName.split(".");
    let left: string | undefined, right: string | undefined;
    if (rootProp === "container") {
      left =
        (Array.isArray(a.position[rootProp])
          ? (a.position[rootProp] as unknown as string[])?.map(
              (x: string) => CONT.find((s) => s.id == x)?.[leafProp]
            )?.[0]
          : CONT.find((s) => s.id == a.position[rootProp])?.[leafProp]) || "";

      right =
        (Array.isArray(b.position[rootProp])
          ? (b.position[rootProp] as unknown as string[])?.map(
              (x: string) => CONT.find((s) => s.id == x)?.[leafProp]
            )?.[0]
          : CONT.find((s) => s.id == b.position[rootProp])?.[leafProp]) || "";
    } else {
      left =
        (Array.isArray(a[rootProp][leafProp])
          ? (a[rootProp][leafProp] as unknown as string[]).sort()[0]
          : a[rootProp][leafProp]) || "";
      right =
        (Array.isArray(b[rootProp][leafProp])
          ? (b[rootProp][leafProp] as unknown as string[]).sort()[0]
          : b[rootProp][leafProp]) || "";
    }

    const isDescNum = isDesc ? -1 : 1;
    const res =
      left == right ? 0 : left < right ? -1 * isDescNum : 1 * isDescNum;
    // const res = left < right ? -1 * isDescNum : 1 * isDescNum;
    // console.log(rootProp, leafProp, left, right, res);
    return res;
    // return 1;
  };

const sortPositionItems =
  <T extends OrderPositionGroups | OrderPosition>(
    sortParams: OrderPositionSortItem<T>[]
  ) =>
  (a: T, b: T) => {
    return sortParams.reduce((prev, cur) => {
      return prev || propComparator(cur.id, cur.desc)(a, b);
    }, 0);
  };

export const sortOrdersPositions = <
  T extends OrderPositionGroups | OrderPosition
>(
  ordpos: T[],
  sortParams: OrderPositionSortItem<T>[]
) => {
  if (sortParams === null || !sortParams.length) return ordpos;
  return ordpos.sort(sortPositionItems(sortParams));
};

export const sortOrders = (orders: Order[], sortStr: string) => {
  if (!sortStr) return orders;
  const isDesc = sortStr[0] === "-";
  const sortField = (isDesc ? sortStr.slice(1) : sortStr) as keyof Order;
  let left: string | undefined, right: string | undefined;
  return orders.sort((a, b) => {
    left = (
      Array.isArray(a[sortField])
        ? (a[sortField] as unknown as string[]).sort()[0]
        : a[sortField]
    ) as string;
    right = (
      Array.isArray(b[sortField])
        ? (b[sortField] as unknown as string[]).sort()[0]
        : b[sortField]
    ) as string;
    const isDescNum = isDesc ? 1 : -1;
    return left == right ? 0 : left < right ? -1 * isDescNum : 1 * isDescNum;
  });
};

export const filterPositions = <
  T extends Position | PositionItem | PositionItemGrouped2
>(
  position: T,
  filters: FilterDataOrder
) => {
  if (!filters) return true;
  const r =
    checkValue(position.position_id, filters.positions?.position_id) &&
    checkSubstr(
      String(position.position_name),
      filters.positions?.position_name
    ) &&
    (["color", "container", "model_id", "status"] as (keyof T)[]).every(
      (field) => checkRefArrayValue(position, filters.positions || {}, field)
    );
  return r;
};

const filterOrderPositions = <
  T extends Position | PositionItem | PositionItemGrouped2
>(
  positions: T[],
  filters: FilterDataOrder
) => {
  return positions.some((pos) => filterPositions(pos, filters));
};

export const filterOrders = (
  orders: Order[],
  filters: FilterDataOrder,
  filterPositions: Position[],
  defaultPosition: Position
) => {
  if (!filters) return orders;
  const res = orders.filter((order) => {
    const orderOk =
      checkSubstr(String(order.order_name), filters.orders?.order_name) &&
      (["order_manager"] as (keyof Order)[]).every((field) =>
        checkRefArrayValue(order, filters.orders || {}, field)
      ) &&
      (["created", "updated"] as (keyof Order)[]).every((field) =>
        checkDateValue(
          order[field] as string,
          filters.orders?.[field as keyof OrdersFilters] as string
        )
      );

    if (!orderOk) return false;

    // const filteredPositions = POSITIONGROUPS.filter(
    //   (x) => x.order_id == order.order_id
    // );

    const positionOk = filterOrderPositions(
      filterPositions.length ? filterPositions : [defaultPosition],
      filters
    );
    return orderOk;
  });
  return res;
};

export const filterContainers = (
  containers: Container[],
  filters: FilterDataOrder
) => {
  if (!filters) return containers;
  return containers.filter((cont) => {
    return checkDateBetween(
      cont.plan_delivery_dt,
      filters.containers?.start_plan_delivery_dt,
      filters.containers?.end_plan_delivery_dt
    );
  });
};

export const getOrdersListDict = <
  T extends Order,
  P extends PositionItem | Position
>(
  orders: T[],
  pos: P[],
  filters?: FilterDataOrder
) => {
  const dictMap = new Map<
    RefCodeOrder,
    { codes: Set<string | null | undefined>; dict: RefBook[] }
  >([
    [
      RefCodeOrder.COLOR,
      {
        codes: new Set([
          ...orders.flatMap((o) =>
            pos.filter((p) => p.order_id == o.order_id).flatMap((s) => s.color)
          ),
          ...(filters?.positions?.color || []),
        ]),
        dict: COLORS,
      },
    ],
    [
      RefCodeOrder.MODEL,
      {
        codes: new Set([
          ...orders.flatMap((o) =>
            pos
              .filter((p) => p.order_id == o.order_id)
              .flatMap((s) => s.model_id)
          ),
          ...(filters?.positions?.model_id || []),
        ]),
        dict: MODELS,
      },
    ],
    [
      RefCodeOrder.CONTAINER,
      {
        codes: new Set([
          ...orders.flatMap((o) =>
            pos
              .filter((p) => p.order_id == o.order_id)
              .flatMap((s) => s.container)
          ),
          ...(filters?.positions?.container || []),
        ]),
        dict: CONTAINERS,
      },
    ],
    [
      RefCodeOrder.POSITION_STATUS,
      {
        codes: new Set([
          ...orders.flatMap((o) =>
            pos.filter((p) => p.order_id == o.order_id).flatMap((s) => s.status)
          ),
          ...(filters?.positions?.status || []),
        ]),
        dict: POSITION_ITEM_STATUS,
      },
    ],
  ]);

  const dictionaries: {
    [key in RefCode]?: RefBook[] | User[] | Container[];
  } = {};
  const dictMapIter = dictMap.keys();
  let dictMapKey = dictMapIter.next();
  while (!dictMapKey.done) {
    const dictKey = dictMapKey.value;
    const { codes, dict } = dictMap.get(dictKey)!;
    dictionaries[dictKey] = dict.filter((x) => codes.has(x.internal_code));
    dictMapKey = dictMapIter.next();
  }

  dictionaries.users = USERS.filter((user) =>
    new Set([
      ...orders
        .map((x) => [x.order_manager, x.created_by, x.updated_by])
        .flat(),
      ...(filters?.orders?.order_manager
        ? [filters?.orders.order_manager]
        : []),
    ]).has(user.id)
  );

  dictionaries.containers = CONT.filter((container) =>
    new Set([
      ...orders.flatMap((o) =>
        pos.filter((p) => p.order_id == o.order_id).flatMap((s) => s.container)
      ),
      ...(filters?.positions?.container || []),
    ]).has(container.id)
  );

  return dictionaries;
};

export const ordersCombinePositions = <
  T extends Position | PositionItemGrouped2
>(
  orders: Order[],
  positions: T[],
  defaultPosition: T
): IOrderPosition<T>[] => {
  return orders.flatMap((ord) => {
    const innerObj = positions
      .filter((pos) => pos.order_id === ord.order_id)
      .map((pos) => ({
        order: { ...ord },
        position: { ...pos },
      }));
    return innerObj;
    // return innerObj.length
    //   ? innerObj
    //   : [{ order: { ...ord }, position: { ...defaultPosition } }];
  });
};

export const validateOrder = (order: Order) => {
  const badParams: { [key in keyof Order]?: string[] } = {};
  let isOk = true;
  if (!order.order_name) {
    badParams.order_name = ["Обязательное поле"];
    isOk = false;
  }

  if (!order.order_manager) {
    badParams.order_manager = ["Обязательное поле"];
    isOk = false;
  }

  if (!order.description) {
    badParams.description = ["Обязательное поле"];
    isOk = false;
  }

  return isOk ? null : badParams;
};

export const validatePosition = <T extends PositionItem | Position>(
  position: Omit<T, "position_item_id">
) => {
  const badParams: { [key in keyof PositionItem]?: string[] } = {};
  let isOk = true;

  if (!position.position_name) {
    badParams.position_name = ["Required field"];
    isOk = false;
  }

  if (!position.color) {
    badParams.color = ["Required field"];
    isOk = false;
  }

  if (!position.position_description) {
    badParams.position_description = ["Required field"];
    isOk = false;
  }

  if (!position.model_id) {
    badParams.model_id = ["Required field"];
    isOk = false;
  }

  if (!position.status) {
    badParams.status = ["Required field"];
    isOk = false;
  }

  return isOk ? null : badParams;
};

export const validatePositionGroup = (
  position: Omit<Position, "position_id">
) => {
  const badParams: { [key in keyof Position]?: string[] } = {};

  let isOk = true;

  if (!position.count) {
    badParams.count = ["Required field"];
    isOk = false;
  }
  if (!position.position_name) {
    badParams.position_name = ["Required field"];
    isOk = false;
  }

  if (!position.color) {
    badParams.color = ["Required field"];
    isOk = false;
  }

  if (!position.position_description) {
    badParams.position_description = ["Required field"];
    isOk = false;
  }

  if (!position.model_id) {
    badParams.model_id = ["Required field"];
    isOk = false;
  }

  return isOk ? null : badParams;
};

export const validatePositions = <T extends PositionItem | Position>(
  positions: Omit<T, "position_item_id">[]
) => {
  return positions.map((position) => {
    const validated = validatePosition(position);
    return validated
      ? {
          position_id: position.position_id,
          ...validatePosition(position),
        }
      : null;
  });
};

export const getUpdatedPosition = (
  basePositionInd: number,
  reqPosition: Position,
  allPositions: Position[],
  foundInd: number
): [Position, number] => {
  if (basePositionInd === foundInd) {
    return [
      {
        ...allPositions[foundInd],
        ...reqPosition,
        count: allPositions[foundInd].count,
        reserved_count: Math.min(
          Number(reqPosition.count),
          Number(reqPosition.reserved_count)
        ),
      },
      foundInd,
    ];
  }
  if (foundInd >= 0)
    return [
      {
        ...allPositions[foundInd],
        ...reqPosition,
        position_item_id: allPositions[foundInd].position_item_id,
        count: allPositions[foundInd].count + Number(reqPosition.count),
        reserved_count:
          allPositions[foundInd].reserved_count +
          Math.min(
            Number(reqPosition.count),
            Number(reqPosition.reserved_count)
          ),
      },
      foundInd,
    ];

  return [
    {
      ...reqPosition,
      count: Number(reqPosition.count),
      reserved_count: Math.min(
        Number(reqPosition.count),
        Number(reqPosition.reserved_count)
      ),
      position_item_id: randomString(10),
    },
    -1,
  ];
};

export const removeCountZero = (arr: Position[]) => {
  var i = 0;
  while (i < arr.length) {
    if (arr[i].count === 0) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
};

export const validateJsonFile = (
  file: Express.Multer.File,
  jsonSchema: JSONSchema7
): OrderFile => {
  if (file.mimetype != "application/json") {
    throw new Error("File must be in json format");
  }
  const fileParsed = JSON.parse(file.buffer.toString());
  const ajv = new Ajv({ strictTuples: false });
  const validate = ajv.compile<OrderFile>(jsonSchema);
  if (validate(fileParsed)) {
    return fileParsed as OrderFile;
  } else {
    throw new Error(
      validate.errors
        .map((er) => `${er.instancePath} - ${er.message}`)
        .join(",\n")
    );
  }
};

export const extendRefBook = <
  Entity extends { [key in keyof Entity]: unknown | unknown[] }
>(
  refArray: Entity[],
  filters: { [key in keyof Entity]?: string | string[] },
  refFields: (keyof Entity)[],
  addNewItem: (newVal: { [key in keyof Entity]?: string | string[] }) => Entity
  //refCode: RefCodeOrder
) => {
  const checkExists = refArray.find((ref) =>
    refFields.every((refField) => checkRefArrayValue(ref, filters, refField))
  );
  if (checkExists) return checkExists;
  const newItem = addNewItem(filters);
  refArray.push(newItem);
  return newItem;
};
