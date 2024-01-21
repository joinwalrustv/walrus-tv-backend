import { RedisClientType } from "redis";
import RedisConnection from "../db/RedisConnection";
import IRepository from "./IRepository";

class BaseRedisRepository implements IRepository {
  private db: RedisClientType;

  constructor() {
    this.db = RedisConnection.getInstance().getClient();
  }

  getDb() {
    return this.db;
  }
}

export default BaseRedisRepository;
