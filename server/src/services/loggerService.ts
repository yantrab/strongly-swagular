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

    this.logRepo.collection.indexes().then(indexes => {
      if (!indexes.find(index => index.name === "time")) {
        this.logRepo.collection.createIndex({ time: 1 }, { expireAfterSeconds: 3600 * 60 * 24 });
      }
    });
  }

  async write(log: string) {
    try {
      const logJson = JSON.parse(log);
      logJson.time = new Date();
      this.webSocketService?.io.to("logs").emit("log", logJson);
      this.logRepo.collection.insertOne(logJson);
    } catch (e) {
      console.log(e);
    }
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
