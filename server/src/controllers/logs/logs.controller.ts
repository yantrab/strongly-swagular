import { guard, get, body, request, post, user } from "strongly";
import { LoggerService } from "../../services/loggerService";
import { User } from "../../domain/user";

@guard(user => user.role === "admin")
export class LogController {
  constructor(private logService: LoggerService) {}
  @get("") logs() {
    return this.logService.getLogs();
  }

  @get createLogToken(@user user: User) {
    return ""; // this.logService.createLogToken(user.email);
  }
}
