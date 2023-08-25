import { App } from "uWebSockets.js";
// @ts-ignore
import { handle, onServerCreated, onServerListen } from "./function/handler";
require('dotenv').config({ path: "./function/.env" });

const app = App({});

// uWebSockets server created. Do any initialization required in the handler
onServerCreated(app);


app.any("/*", handle);

const port = Number(process.env.http_port) || 3000;
const server = app.listen(port, (listenSocket) => {
  if (listenSocket) {
    onServerListen(app)
  }
});
