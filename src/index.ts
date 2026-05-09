import dotenv from "dotenv";

dotenv.config();

import { createServer } from "./server";
import { startReminderService } from "./services/reminderService";

const PORT = parseInt(process.env.PORT || "3000", 10);

const app = createServer();

const server = app.listen(PORT, () => {
  console.log(`[OceanMind] Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);

  // Start reminder service
  startReminderService();
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[OceanMind] SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("[OceanMind] Server closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("[OceanMind] SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("[OceanMind] Server closed.");
    process.exit(0);
  });
});

export default app;
