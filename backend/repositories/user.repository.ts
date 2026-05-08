import type { UserRow } from "../types/database.js";
import { query } from "../config/db.js";
import bcrypt from "bcrypt";

const TABLE = "users";
const SALT_ROUNDS = 10;

export const userRepository = {
  async findByEmail(email: string): Promise<UserRow | null> {
    const rows = await query<UserRow>(
      `select * from ${TABLE} where email = $1 and deleted_at is null limit 1`,
      [email]
    );
    return rows[0] ?? null;
  },

  async findById(id: string): Promise<UserRow | null> {
    const rows = await query<UserRow>(
      `select * from ${TABLE} where id = $1 and deleted_at is null limit 1`,
      [id]
    );
    return rows[0] ?? null;
  },

  async create(input: { email: string; password: string; role: string }): Promise<UserRow> {
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const rows = await query<UserRow>(
      `insert into ${TABLE} (email, password_hash, role)
       values ($1, $2, $3)
       returning *`,
      [input.email, passwordHash, input.role]
    );
    return rows[0] as UserRow;
  },

  async verifyPassword(email: string, password: string): Promise<UserRow | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;
    return user;
  },
};
