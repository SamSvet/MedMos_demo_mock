import path from "path";
import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import multer from "multer";
import CAMPAIGNS_API from "./campaigns-api/api";
import ORDERS_API from "./orders-api/api";
import POSITIONS_API from "./positions-api/api";
import DICTIONARIES_API from "./dictionaries-api/api";
import SCENARIOS_API from "./scenarios-api/api";
import TAGS_API from "./tags-api/api";
import USERS_API from "./users-api/api";
import CONTAINERS_API from "./containers-api/api";
import { ErrorCode, getErrorModal, Paths } from "./share/constants";
import { createErrorResponse } from "./share/response";
import { showData } from "./show-data-api/api";
// import { migrateORM } from "./db-mikro-orm/utils/migrate";
// import { pgMemDB } from "./db-mikro-orm";
// import { User } from "./db-mikro-orm/models/User";
// import { Campaign } from "./db-mikro-orm/models/Campaign";
//import { prepareDb } from "./db";

const PORT = 3390;
const app = express();

// const qweasd = () => {
//   migrateORM(path.join(process.cwd(), "src/db/migrations"))
//     .then((orm) => {
//       // const users = orm.em.getRepository(User);
//       // users.findAll().then((v) => console.log(v));
//       // console.log(
//       //   "select result - \n",
//       //   pgMemDB.public.many("SELECT * FROM public.user")
//       // );

//       const campaigRepo = orm.em.getRepository(Campaign);
//       campaigRepo.findAll().then((res) => console.log("Campaign res", res));

//       // orm.em.find(Campaign, {campaign_name: "test"}, {populate: ['campaign_kind_cd']}).then((res) => console.log("KIND", res))
//     })
//     .catch((e) => console.log(e));
// };
// qweasd();

//const seq = prepareDb();

// app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000",
    // exposedHeaders: "*",
    // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    exposedHeaders:
      "x-sbc-jsonrpc-method,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Disposition,Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
    // allowedHeaders:
    //   "x-sbc-jsonrpc-method,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
    credentials: true,
  })
);

app.use(express.json());

app.use(multer().array("resource"));

app.post(ORDERS_API.path, (req, resp) => {
  return ORDERS_API.respond(req, resp);
});
app.post(POSITIONS_API.path, (req, resp) => POSITIONS_API.respond(req, resp));
app.post(CAMPAIGNS_API.path, (req, resp) => {
  return CAMPAIGNS_API.respond(req, resp);
});
//TODO approval path
app.post(Paths.CAMAPAIGNS_GET_APPROVALLIST, (req, resp) =>
  CAMPAIGNS_API.respond(req, resp)
);
app.post(SCENARIOS_API.path, (req, resp) => SCENARIOS_API.respond(req, resp));
app.post(DICTIONARIES_API.path, (req, resp) =>
  DICTIONARIES_API.respond(req, resp)
);
app.post(TAGS_API.path, (req, resp) => TAGS_API.respond(req, resp));
app.post(USERS_API.path, (req, resp) => USERS_API.respond(req, resp));
app.post(CONTAINERS_API.path, (req, resp) => CONTAINERS_API.respond(req, resp));

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  const { id } = req.body;
  const { code, modal, message } = getErrorModal(ErrorCode.SYSTEM_ERROR)!;
  const response = createErrorResponse(id, code, message, modal);
  res.status(500);
  res.json(response);
});

app.get("/show-data/:entity", (req, resp) => {
  const res = showData(req);
  resp.type("json").send(JSON.stringify(res, null, 2));
});

try {
  app.listen(PORT, () => {
    console.log(`server has been started on port ${PORT}`);
  });
} catch (e) {
  console.log(e);
}
