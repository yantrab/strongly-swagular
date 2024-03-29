import { Entity } from "../../domain/entity";
import { Collection, ObjectId, MongoClient, FilterQuery } from "mongodb";
import { omit } from "lodash";
import { EntityWithoutGetters } from "../../utils/typescript.util";

export class Repository<T extends Entity<T>> {
  constructor(public collection: Collection<Partial<EntityWithoutGetters<T>>>) {}

  async saveOrUpdateOne(entity: T): Promise<typeof entity> {
    if (!entity._id) {
      await this.collection.insertOne(entity as any);
    } else {
      const itemToUpdate = omit(entity, ["_id"]);
      const _id = new ObjectId(entity._id);
      await this.collection.updateOne({ _id } as any, { $set: itemToUpdate as any });
    }
    return entity as T;
  }

  find(query?: FilterQuery<Partial<EntityWithoutGetters<T>>>): Promise<T[]> {
    return this.collection.find<T>(query || {}, {}).toArray();
  }

  findOne(query?: FilterQuery<Partial<EntityWithoutGetters<T>>>): Promise<T | null> {
    return this.collection.findOne<T>(query || {});
  }
}

export class DbService {
  constructor(private connection: MongoClient) {}

  getRepository<T extends Entity<T>, P = new (...args) => T>(entity: P, db: string): Repository<T> {
    return new Repository(this.connection.db(db).collection<Partial<EntityWithoutGetters<T>>>((entity as any).name));
  }
}
