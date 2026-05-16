import { createServer } from "node:http";
import { Server } from "socket.io";
import { config } from "./config.js";
import { configureApp, createBaseApp } from "./createApp.js";
import { connectWithRetry } from "./lib/connectDb.js";
import { registerTrackingSocket } from "./socket/tracking.js";

const app = createBaseApp();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    credentials: true,
  },
});

configureApp(app, io);
registerTrackingSocket(io);

const port = config.port;

async function start() {
  try {
    await connectWithRetry();
  } catch {
    process.exit(1);
  }

  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`Hash Food API ready at http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`DB health: http://localhost:${port}/api/health`);
    console.log("Real-time (Socket.IO) enabled");
  });
}

start();

httpServer.on("error", (err) => {
  console.error("Server startup error:", err);
});
