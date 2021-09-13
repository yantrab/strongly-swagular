export abstract class Entity<T> {
  protected constructor(data?) {
    if (data) {
      Object.assign(this, data);
    }
  }
  _id?: string;
  _isDeleted?: boolean;
}
