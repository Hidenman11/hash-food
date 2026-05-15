import { createServer } from "node:http";
import { Server } from "socket.io";
import { config } from "./config.js";
import { configureApp, createBaseApp } from "./createApp.js";

const app = createBaseApp();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    credentials: true,
  },
});

configureApp(app, io);

const port = config.port;
// Tunatumia "0.0.0.0" badala ya "localhost" ili kuruhusu web previews kufanya kazi
httpServer.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Hash Food API ready at http://localhost:${port}`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
  console.log(`📡 Real-time (Socket.IO) enabled`);
});

httpServer.on("error", (err) => {
  console.error("❌ Server startup error:", err);
});