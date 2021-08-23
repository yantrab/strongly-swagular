import { createTransport } from "nodemailer";
import { ConfigService } from "../config/config.service";
import * as Mail from "nodemailer/lib/mailer";

export class MailerService {
  private transporter: Mail;
  private smtp = this.configService.config.smtp;
  constructor(private configService: ConfigService) {
    this.transporter = createTransport(this.smtp);
  }

  send(mailOptions: Mail.Options) {
    return this.transporter.sendMail(mailOptions);
  }

  sendPermission(to: string, token: string) {
    const url = `${this.configService.config.clientUrl}/auth/sign-in/${token}/${to}`;
    return this.send({
      from: this.smtp.from,
      to,
      subject: this.smtp.sendPermission.subject,
      html: this.smtp.sendPermission.html(url, to)
    });
  }
}
