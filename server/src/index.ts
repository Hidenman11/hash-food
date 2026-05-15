import http from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { config } from "./config.js";
import { configureApp, createBaseApp } from "./createApp.js";
import { registerTrackingSocket } from "./socket/tracking.js";

const app = createBaseApp();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
  },
});

configureApp(app, io);
registerTrackingSocket(io);

httpServer.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`HASH FOOD API + Socket.io on :${config.port}`);
});
