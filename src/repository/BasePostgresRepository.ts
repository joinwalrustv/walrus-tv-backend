import { Pool } from "pg";
import PostgresConnection from "../db/PostgresConnection";
import IRepository from "./IRepository";

class BasePostgresRepository implements IRepository {
  private db: Pool;

  constructor() {
    this.db = PostgresConnection.getInstance().getPool();
  }

  getDb() {
    return this.db;
  }
}

export default BasePostgresRepository;
