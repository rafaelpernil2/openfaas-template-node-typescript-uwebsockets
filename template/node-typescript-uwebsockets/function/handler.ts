import { HttpRequest, HttpResponse, TemplatedApp } from "uWebSockets.js";

async function handle(res: HttpResponse, req: HttpRequest): Promise<void> {
  res.writeStatus('200 OK').end('Hello world!')
}

function onServerCreated(server: TemplatedApp) {
  // Add your code
  console.log("onServerCreated");
}

async function onServerListen(server: TemplatedApp) {
  // Add your code
  console.log("onServerListen");
}

export { handle, onServerCreated, onServerListen };
