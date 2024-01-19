import BasePostgresRepository from "./BasePostgresRepository";
import { randomBytes } from "crypto";
import { hash } from "bcryptjs";

class UserRepository extends BasePostgresRepository {
  constructor() {
    super();
  }

  async getUserById(id: number) {
    const results = await this.getDb().query("SELECT * FROM users WHERE user_id = $1", [id]);
    return results.rows[0] || null;
  }

  async registerNewUser(username: string, email: string, password: string) {
    const existingUsername = await this.getDb().query("SELECT * FROM users WHERE LOWER(username) = $1", [username.toLowerCase()]);
    if (existingUsername.rows.length > 0) return false;

    const existingEmail = await this.getDb().query("SELECT * FROM users WHERE LOWER(email) = $1", [email.toLowerCase()]);
    if (existingEmail.rows.length > 0) return false;

    const queryString = `
      INSERT INTO users(user_id, email, password_hash, username, avatar_url, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const userId = randomBytes(16).toString("hex");
    const defaultAvatar = "https://res.cloudinary.com/walrus-tv/image/upload/v1666494875/walrus-tv-assets/guest-avi_y8henk.png";
    const passwordHash = await hash(password, 10);
    const timestamp = new Date().toISOString();

    await this.getDb().query(queryString, [userId, email, passwordHash, username, defaultAvatar, timestamp]);
    return true;
  }
}

export default UserRepository;
