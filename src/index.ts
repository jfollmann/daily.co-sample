import * as express from "express";
import { apiController } from "./controllers/api";
import { hostname } from "os";
import { settings } from "./configs";
import { OK } from "http-status-codes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const loggerMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`${hostname()} ${req.method} ${req.originalUrl} `);

  return next();
}

// app.get("/", loggerMiddleware, (req: express.Request, res: express.Response) => {
//   return res.status(OK).json({ status: "running" });
// })

app.use("/api", loggerMiddleware, apiController)

app.use("/", loggerMiddleware, express.static(__dirname + '/views'))

app.listen(settings.port, () => {
  console.log(`App running on http://localhost:${settings.port}`);
})

