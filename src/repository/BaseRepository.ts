import { Pool } from "pg";
import PostgresConnection from "../db/PostgresConnection";

class BaseRepository {
  private db: Pool;

  constructor() {
    this.db = PostgresConnection.getInstance().getPool();
  }

  getDb() {
    return this.db;
  }
}

export default BaseRepository;
