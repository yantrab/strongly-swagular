import { DbService, Repository } from "../db/db.service";
import { Role, User } from "../../domain/user";
import { compare, genSalt, hash } from "bcryptjs";
import NodeCache from "node-cache";
import { MailerService } from "../mailer/mailer.service";
import { v4 as uuidv4 } from "uuid";
import { FilterQuery } from "mongodb";

const cryptPassword = async password => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

export class UserService {
  userRepo: Repository<User>;
  private cache = new NodeCache({ stdTTL: 60 * 60 * 12 });

  constructor(private dbService: DbService, private mailer: MailerService) {
    this.userRepo = this.dbService.getRepository(User, "users");

    this.userRepo.collection.countDocuments().then(async usersCount => {
      if (usersCount) {
        return;
      }
      const user = new User({
        email: "admin@admin.com",
        phone: "0555555",
        firstName: "Admin",
        lastName: "Sara",
        role: Role.admin
      });
      user["password"] = await cryptPassword("123456");
      await this.saveOrUpdateUser(user);
    });
  }

  async validateAndGetUser(email: string, password: string): Promise<User | undefined> {
    const userDb: User & { password: string } = (await this.getUser(email)) as any;
    if (!userDb?.password || !(await compare(password, userDb.password))) return;
    return new User(userDb as User);
  }

  saveOrUpdateUser(user: User) {
    return this.userRepo.saveOrUpdateOne(user);
  }

  getUser(email: string) {
    return this.userRepo.collection.findOne({ email, _isDeleted: { $ne: true } });
  }

  getUsers(query?:  FilterQuery<Partial<User>>) {
    return this.userRepo.collection
      .find<User>(query || {}, {})
      .project({ password: 0 })
      .toArray() as Promise<User[]>;
  }

  async sentPermission(email: string) {
    try {
      const token = uuidv4();
      this.cache.set(email, token);
      return this.mailer.sendPermission(email, token);
    } catch (x) {
      console.log(x);
    }
  }

  validateToken(email: string, token: string) {
    const cacheToken = this.cache.get(email);
    if (!cacheToken || cacheToken !== token) return false;
    return true;
  }

  async changePassword(email: string, token: string, password: string): Promise<boolean> {
    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);
    await this.userRepo.collection.updateOne({ email: email }, { $set: { password: hashPassword } });
    return true;
  }
}
