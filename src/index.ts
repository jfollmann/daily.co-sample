import * as express from "express";
import { DailyService } from "./api";
import { hostname } from "os";

const app = express();

const loggerMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`${hostname()} ${req.method} ${req.originalUrl} `);

  return next();
}

app.get("/", loggerMiddleware, (req, res) => {
  return res.json({ status: "running" });
})

app.get("/getRooms", loggerMiddleware, async (req, res) => {
  return DailyService.getRooms()
    .then(({ data }) => res.json(data))
    .catch(e => res.json({ error: true, e }));
})

app.get("/newRoom", loggerMiddleware, (req, res) => {
  return DailyService.newRoom()
    .then(({ data }) => res.json(data))
    .catch(e => res.json({ error: true, e }));
})

app.get("/createToken", loggerMiddleware, (req, res) => {
  const { room } = req.query;

  return DailyService.createMettingToken(room)
    .then(({ data }) => res.json(data))
    .catch(e => res.json({ error: true, e }));
})

app.get("/getToken", loggerMiddleware, (req, res) => {
  const { token } = req.query;

  return DailyService.getMettingToken(token)
    .then(({ data }) => res.json(data))
    .catch(e => res.json({ error: true, e }));
})


app.listen(3000, () => {
  console.log("App running");
})