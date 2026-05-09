import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";
import { rateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";

export function createServer(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({ origin: process.env.NODE_ENV === "production" ? ["https://oceanmind.app"] : true }));
  app.use(rateLimiter);

  // Body parsers
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // Health check route
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // Mount routes
  app.use(routes);

  // Global error handler
  app.use(errorHandler);

  return app;
}
