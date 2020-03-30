import { Router, Request, Response, NextFunction } from "express";
import { DailyService } from "../services/daily";
import { hostname } from "os";
import { settings } from "../configs";
import { OK, INTERNAL_SERVER_ERROR } from "http-status-codes";

const app = Router();


const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${hostname()} ${req.method} ${req.originalUrl} `);

  return next();
}

app.get("/", loggerMiddleware, (req: Request, res: Response) => {
  return res.status(OK).json({ status: "running" });
})

app.get("/room", loggerMiddleware, async (req: Request, res: Response) => {
  return DailyService.getRooms()
    .then(({ data }) => res.status(OK).json(data))
    .catch(e => res.status(INTERNAL_SERVER_ERROR).json({ error: true, e }));
})

app.post("/room", loggerMiddleware, (req: Request, res: Response) => {
  const { eventDate, eventDuration } = req.body;

  return DailyService.createRoom(eventDate, eventDuration)
    .then(({ data }) => res.status(OK).json(data))
    .catch(e => res.status(INTERNAL_SERVER_ERROR).json({ error: true, e }));
})

app.delete("/room/:room_name", loggerMiddleware, (req: Request, res: Response) => {
  return DailyService.deleteRoom(req.params.room_name)
    .then(({ data }) => res.status(OK).json(data))
    .catch(e => res.status(INTERNAL_SERVER_ERROR).json({ error: true, e }));
})

app.post("/meetingToken", loggerMiddleware, (req: Request, res: Response) => {
  const { room_name, user_name, is_owner } = req.body;

  return DailyService.createMettingToken(room_name, user_name, is_owner)
    .then(({ data }) => {
      const url = `${settings.teamUrl}${room_name}?t=${data.token}`;
      res.status(OK).json({ token: data.token, url })
    })
    .catch(e => res.status(INTERNAL_SERVER_ERROR).json({ error: true, e }));
})

app.post("/medicalConsultation", loggerMiddleware, async (req: Request, res: Response) => {
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

export { app as apiController };