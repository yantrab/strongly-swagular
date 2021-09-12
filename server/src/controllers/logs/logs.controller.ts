import { guard, get, body, request, post, user } from "strongly";
import { LogService } from "../../services/log.service";
import { User } from "../../domain/user";

@guard(user => user.role === "admin")
export class LogController {
  constructor(private logService: LogService) {}
  @get("") logs() {
    return this.logService.getLogs();
  }

  @get createLogToken(@user user: User) {
    return this.logService.createLogToken(user.email);
  }
}
