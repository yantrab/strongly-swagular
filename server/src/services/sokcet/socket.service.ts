import { Server, Socket } from "socket.io";
import { Subject } from "rxjs";
export class WebSocketService {
  io = new Server({ cors: { origin: "*" } });
  registerToLogs = new Subject<Socket>();
  constructor() {
    const port = 4001;
    this.io.on("connection", (socket: Socket) => {
      socket.on("registerToLogs", token => {
        socket.join("logs");
      });
    });
    this.io.listen(port);
  }
}
