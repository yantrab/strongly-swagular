import { min, email, uuid } from "strongly";

export class SetPassword {
  @email email: string;
  @min(6) password: string;
  @min(6) rePassword: string;
  @uuid token: string;
}
