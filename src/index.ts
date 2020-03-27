import * as express from "express";
import { DailyService } from "./api";
import { hostname } from "os";
import { settings } from "./configs";
import { OK, INTERNAL_SERVER_ERROR } from "http-status-codes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const loggerMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`${hostname()} ${req.method} ${req.originalUrl} `);

  return next();
}

app.get("/", loggerMiddleware, (req: express.Request, res: express.Response) => {
  return res.status(OK).json({ status: "running" });
})

app.get("/room", loggerMiddleware, async (req: express.Request, res: express.Response) => {
  return DailyService.getRooms()
    .then(({ data }) => res.status(OK).json(data))
    .catch(e => res.status(INTERNAL_SERVER_ERROR).json({ error: true, e }));
})

app.post("/room", loggerMiddleware, (req: express.Request, res: express.Response) => {
  const { eventDate } = req.body;

  return DailyService.createRoom(eventDate)
    .then(({ data }) => res.status(OK).json(data))
    .catch(e => res.status(INTERNAL_SERVER_ERROR).json({ error: true, e }));
})

app.post("/meetingToken", loggerMiddleware, (req: express.Request, res: express.Response) => {
  const { room, username, owner } = req.body;

  return DailyService.createMettingToken(room, username, owner)
    .then(({ data }) => {
      const url = `${settings.teamUrl}${room}?t=${data.token}`;
      res.status(OK).json({ token: data.token, url })
    })
    .catch(e => res.status(INTERNAL_SERVER_ERROR).json({ error: true, e }));
})

app.post("/medicalConsultation", loggerMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { eventDate, doctorName } = req.body;

    const room = await DailyService.createRoom(eventDate);
    const ownerToken = await DailyService.createMettingToken(room.data.name, doctorName, true);

    const doctorUrl = `${room.data.url}?t=${ownerToken.data.token}`;
    const patientUrl = `${room.data.url}`;

    const result = { doctorUrl, patientUrl };

    console.log(result);

    return res.status(OK).json(result);

  } catch (e) {
    return res.status(INTERNAL_SERVER_ERROR).json({ error: true, e });
  }
})

app.listen(settings.port, () => {
  console.log(`App running on http://localhost:${settings.port}`);
})

