import express, { Express, Router, json, Request, Response, NextFunction } from "express";
import responseTime from "response-time";
import Helmet from "helmet";
import router from "./routers/Router.js";
import { Configuration } from "./models/Configuration.js";

export default function createApp(configuration: Configuration): {
  app: Express;
  router: Router;
} {
  const app: Express = express();

  app.use(Helmet());
  app.use(json());

  app.use(responseTime({ suffix: true }));

  app.use("/", router);
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json(
      { 
        code: 500,
        message: 'Internal Server Error' 
      }
    );
  });
  return { app, router };
}
