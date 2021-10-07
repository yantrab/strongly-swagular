import { Server, Socket } from "socket.io";
import { Subject } from "rxjs";
export class WebSocketService {
  io = new Server({ cors: { origin: "*" } });
  rooms: { [id: string]: string } = {};
  constructor() {
    const port = 4001;
    this.io.on("connection", (socket: Socket) => {
      socket.on("registerToLogs", _ => {
        socket.join("logs");
      });
      socket.on("unRegisterToLogs", _ => {
        socket.leave("logs");
      });
      socket.on("registerToPanel", panelId => {
        const name = "panel_" + panelId;
        const lastRoom = this.rooms[socket.id];
        if (lastRoom) {
          socket.leave(lastRoom);
        }
        socket.join(name);
        this.rooms[socket.id] = name;
      });
      socket.on("unRegisterToPanel", panelId => {
        socket.leave("panel_" + panelId);
      });
    });
    this.io.listen(port);
  }
}
