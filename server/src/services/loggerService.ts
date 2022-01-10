import { DbService, Repository } from "./db/db.service";
import { v4 as uuidv4 } from "uuid";
import { CacheService } from "./cache.service";
import { WebSocketService } from "./sokcet/socket.service";

export class LoggerService {
  logRepo: Repository<any>;

  constructor(
    private dbService: DbService,
    // private readonly cacheService?: CacheService,
    private readonly webSocketService: WebSocketService
  ) {
    // this.cacheService = this.cacheService || new CacheService();
    // this.webSocketService = this.webSocketService || new WebSocketService();
    this.logRepo = this.dbService.getRepository({ name: "logs" }, "log");
    this.logRepo.collection.createIndex({ time: 1 }, { expireAfterSeconds: 3600 * 60 * 24 }).then();
  }

  async write(log: string) {
    const logJson = JSON.parse(log);
    logJson.time = new Date();
    this.webSocketService?.io.to("logs").emit("log", logJson);
    return this.logRepo.collection.insertOne(logJson);
  }

  async getLogs(query = {}) {
    return this.logRepo.find(query);
  }

  // async createLogToken(email: string) {
  //   const token = uuidv4();
  //   this.cacheService?.set("logs_" + email, token, 5);
  //   return token;
  // }
  //
  // async getLogToken(email: string) {
  //   return this.cacheService?.get("logs_" + email);
  // }
}
