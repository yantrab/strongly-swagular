import { OptionalKeys } from "ts-essentials";

export abstract class Entity<T> {
  _id?: string;
  _isDeleted?: boolean;

  constructor(data?: Partial<T>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
