import * as config from "./config";

export class ConfigService {
  config = config;

  constructor() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.config = require("../../../../../config");
    } catch {}
  }
}
