import { Request, Response } from "express";
import { ErrorCode, ErrorMessage, ErrorModal } from "../share/constants";
import { createErrorResponse } from "../share/response";
import { ORDERS } from "../data/orders/orders";
import { defaultPosition, POSITIONGROUPS } from "../data/positions/positions";
import { ordersCombinePositions } from "../data/orders/order-utils";
import { MODELS } from "../data/refbooks/models";
import { COLORS } from "../data/refbooks/colors";
import { CONTAINERS } from "../data/containers/containers";
import { POSITION_ITEM_STATUS } from "../data/refbooks/position-item-status";
const writeXlsxFile = require("write-excel-file/node");
//import writeXlsxFile from "write-excel-file";

const ordersGenerateFile = async (id: string, params: any) => {
  const file_schema = [
    {
      column: "Имя заказа",
      type: String,
      value: (el) => el.order.order_name,
    },
    {
      column: "Артикул",
      type: String,
      value: (el) => el.position.position_name,
    },
    {
      column: "Модельный номер",
      type: String,
      value: (el) =>
        MODELS.find((m) => m.internal_code === el.position.model_id).name,
    },
    {
      column: "Цвет",
      type: String,
      value: (el) =>
        COLORS.find((m) => m.internal_code === el.position.color).name,
    },
    {
      column: "Контейнер",
      type: String,
      value: (el) =>
        CONTAINERS.filter((m) => el.position.container.includes(m.id))
          .map((f) => f.name)
          .join(","),
    },
    {
      column: "Дата доставки",
      type: Date,
      format: "dd.mm.yyyy",
      value: (el) =>
        CONTAINERS.filter((m) => el.position.container.includes(m.id)).map(
          (f) => (f.plan_delivery_dt ? new Date(f.plan_delivery_dt) : null)
        )?.[0] || null,
    },
    {
      column: "Статус",
      type: String,
      value: (el) =>
        POSITION_ITEM_STATUS.find((s) => s.internal_code === el.position.status)
          .name,
    },
    {
      column: "Всего",
      type: Number,
      format: "#,##0",
      value: (el) => el.position.count,
    },
    {
      column: "В резерве",
      type: Number,
      format: "#,##0",
      value: (el) => el.position.reserved_count,
    },
    {
      column: "Остаток",
      type: Number,
      value: (el) => el.position.count - el.position.reserved_count,
    },
  ];
  const file_data = ordersCombinePositions(
    ORDERS,
    POSITIONGROUPS,
    defaultPosition
  );

  return await writeXlsxFile(file_data, {
    schema: file_schema,
    sheet: "Приходы ВСС",
    stickyRowsCount: 1,
  });
};

export const respond = (req: Request, resp: Response) => {
  const { id, params } = req.body;

  if (id) {
    ordersGenerateFile(id, params)
      .then((stream) => {
        resp.attachment("deliveries_BCC.xlsx");
        stream.pipe(resp);
      })
      .catch((reason) => {
        console.log(reason);
        resp.json(
          createErrorResponse(
            id,
            ErrorCode.NOT_FOUND,
            ErrorMessage.NOT_FOUND,
            ErrorModal.FAIL
          )
        );
      });
  } else {
    resp.json(
      createErrorResponse(
        id,
        ErrorCode.NOT_FOUND,
        ErrorMessage.NOT_FOUND,
        ErrorModal.FAIL
      )
    );
  }
};
