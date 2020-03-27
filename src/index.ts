import * as express from "express";
import { DailyService } from "./api";
import { hostname } from "os";
import { settings } from "./configs";

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
  return DailyService.createRoom()
    .then(({ data }) => res.json(data))
    .catch(e => res.json({ error: true, e }));
})

app.get("/createToken", loggerMiddleware, (req, res) => {
  const { room, owner } = req.query;

  return DailyService.createMettingToken(room, owner)
    .then(({ data }) => {
      const url = `${settings.teamUrl}${room}?t=${data.token}`;
      res.json({ url })
    })
    .catch(e => res.json({ error: true, e }));
})

app.get("/getToken", loggerMiddleware, (req, res) => {
  const { token } = req.query;

  return DailyService.getMettingToken(token)
    .then(({ data }) => res.json(data))
    .catch(e => res.json({ error: true, e }));
})

app.get("/medicalConsultation", loggerMiddleware, async (req, res) => {
  const room = await DailyService.createRoom();
  const ownerToken = await DailyService.createMettingToken(room.data.name, true);

  const doctorUrl = `${room.data.url}?t=${ownerToken.data.token}`;
  const patientUrl = room.data.url;

  return res.json({ doctorUrl, patientUrl });
})

app.listen(settings.port, () => {
  console.log("App running");
})