import express, { Express, json, Request, Response, NextFunction } from "express";
import responseTime from "response-time";
import Helmet from "helmet";
import createExpressRouter from "./routers/Router.js";
import { Configuration } from "./models/Configuration.js";

class HttpError extends Error {
  status?: number;
}

const allowedMethods = ['GET', 'POST'];

const createApp: (configuration: Configuration) => Express = (configuration: Configuration) => {
  // Create an Express application
  const app: Express = express();

  // Middleware
  app.use(Helmet());
  app.use(json());
  app.use(responseTime({ suffix: true }));

  // Middleware to handle unsupported HTTP methods
function methodNotAllowed(req: Request, res: Response, next: NextFunction) {
    // Check if the method is not in the allowed list
    if (!allowedMethods.includes(req.method)) {

      const error = new HttpError("Method Not Allowed");
      error.status = 405; // Set the status code to 405
      throw error; // Throw the error to be caught by the error-handling middleware
      // next(error); // Pass the error to the next middleware
  }
    else {
      next(); // If the method is allowed, proceed to the next middleware
    }
}

// Apply the middleware globally
app.use(methodNotAllowed);

  // Router
  app.use("/", createExpressRouter(configuration));

  app.use("/error", (req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Mock Error");
    next(error); // Fehler weiterleiten
  });

  // Handle unknown routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new HttpError("Not Found");
    error.status = 404; // Set the status code to 404
    next(error); // Pass the error to the next middleware
  });

  // Error-handling middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json(
      {
      code: status,
      message: message,
    });
  });
  
  return app;
}

export default createApp;