import { RedisClientType, createClient } from "redis";
import * as dotenv from "dotenv";

dotenv.config();

class RedisConnection {
  private static _instance: RedisConnection;
  private _client: RedisClientType;

  constructor() {
    const hostname = process.env.REDIS_HOSTNAME || "127.0.0.1";
    const port = process.env.REDIS_PORT || 6379;
    const password = process.env.REDIS_PASSWORD || undefined;

    this._client = createClient({
      url: `redis://${hostname}:${port}`,
      password: password
    });

    this._client.on("error", (err) => console.log("Redis client error", err));
    this._client.connect();
  }

  public static getInstance(): RedisConnection {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new RedisConnection();
    return this._instance;
  }

  getClient(): RedisClientType {
    return this._client;
  }
}

export default RedisConnection;
