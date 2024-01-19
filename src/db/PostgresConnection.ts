import { Pool, PoolConfig } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

class PostgresConnection {
  private static _instance: PostgresConnection;
  private _pool: Pool;

  private constructor() {
    const config: PoolConfig = {
      user: `${process.env.POSTGRES_USER}`,
      password: `${process.env.POSTGRES_PASSWORD}`,
      host: `${process.env.POSTGRES_HOST}`,
      database: `${process.env.POSTGRES_DATABASE}`,
      port: 5432
    };
    this._pool = new Pool(config);
  }

  public static getInstance(): PostgresConnection {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new PostgresConnection();
    return this._instance;
  }

  public getPool(): Pool {
    return this._pool;
  }
}

export default PostgresConnection;
