import fetch from "cross-fetch";
import { ConfigService } from "./config/config.service";

export class SmsService {
  constructor(private configService: ConfigService) {}

  send(to: string, msg: string) {
    return fetch("https://capi.upsend.co.il/api/v2/SMS/SendSms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json charset=utf-8",
        Authorization: this.configService.config.smsAuth
      },
      body: JSON.stringify({
        Message: msg,
        Recipients: [{ Phone: to }],
        Settings: { Sender: "tador" }
      })
    });
  }
}
