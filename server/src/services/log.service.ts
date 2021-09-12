import { DbService, Repository } from "./db/db.service";
import { v4 as uuidv4 } from "uuid";
import { CacheService } from "./cache.service";
export class LogService {
  logRepo: Repository<any>;
  constructor(private dbService: DbService, private readonly cacheService?: CacheService) {
    this.cacheService = this.cacheService || new CacheService();
    this.logRepo = this.dbService.getRepository({ name: "log" }, "log");
  }

  async write(log: string) {
    return this.logRepo.saveOrUpdateOne(JSON.parse(log));
  }

  async getLogs() {
    return this.logRepo.find();
  }

  async createLogToken(email: string) {
    const token = uuidv4();
    this.cacheService?.set("logs_" + email, token, 5);
    return token;
  }

  async getLogToken(email: string) {
    return this.cacheService?.get("logs_" + email);
  }
}
