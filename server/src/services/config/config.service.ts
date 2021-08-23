import * as config from "./config";

export class ConfigService {
  config = config;

  constructor() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const realConfig = require("../../../../../config");
      this.config = realConfig;
    } catch {}
  }
}
