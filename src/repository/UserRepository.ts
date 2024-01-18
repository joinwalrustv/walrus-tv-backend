import BaseRepository from "./BaseRepository";

class UserRepository extends BaseRepository {
  constructor() {
    super();
  }

  async getUserById(id: number) {
    const results = await this.getDb().query("SELECT * FROM users WHERE user_id = $1", [id]);
    return results.rows[0] || null;
  }
}

export default UserRepository;
