import { Pool } from "pg";
import PostgresConnection from "../db/PostgresConnection";

class BasePostgresRepository {
  private db: Pool;

  constructor() {
    this.db = PostgresConnection.getInstance().getPool();
  }

  getDb() {
    return this.db;
  }
}

export default BasePostgresRepository;
