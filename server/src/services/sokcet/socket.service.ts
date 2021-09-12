import { Server, Socket } from "socket.io";
const io = new Server();
export class WebSocketService {
  constructor() {
    io.on("connection", (socket: Socket) => {
      socket.on("registerToLogs", listener => {});
      // ...
    });
    io.listen(4001);
  }
}
