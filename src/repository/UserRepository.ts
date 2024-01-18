import { Pool } from "pg";
import PostgresConnection from "../db/PostgresConnection";

class UserRepository {
  private db: Pool;

  constructor() {
    this.db = PostgresConnection.getInstance().getPool();
  }

  async getUserById(id: number) {
    const results = await this.db.query("SELECT * FROM users WHERE user_id = $1", [id]);
    return results.rows[0] || null;
  }
}

export default UserRepository;
