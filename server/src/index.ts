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
httpServer.listen(port, () => {
  console.log(`🚀 Hash Food API ready at http://localhost:${port}`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
  console.log(`📡 Real-time (Socket.IO) enabled`);
});