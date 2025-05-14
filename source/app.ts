import express, { Express, json, Request, Response, NextFunction } from "express";
import responseTime from "response-time";
import Helmet from "helmet";
import createExpressRouter from "./routers/Router.js";
import { Configuration } from "./models/Configuration.js";

const createApp = (configuration: Configuration) => {
  // Create an Express application
  const app: Express = express();

  // Middleware
  app.use(Helmet());
  app.use(json());
  app.use(responseTime({ suffix: true }));

  // Router
  app.use("/", createExpressRouter(configuration));

  // Handle unknown routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      code: 404,
      message: "Not Found",
    });
  });

  // Error-handling middleware
  app.use((err: Error, req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  });
  ;
  return app;
}

export default createApp;