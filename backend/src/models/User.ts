import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database';
import { User } from '../types/user';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class UserModel {
  static async create(user: User, password: string): Promise<number> {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO users (username, email, password_hash, full_name, role, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user.username,
        user.email,
        password_hash,
        user.full_name || null,
        user.role || 'agent',
        true
      ]
    );
    return result.insertId;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ? AND is_active = TRUE',
      [username]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, username, email, full_name, role, is_active, created_at, updated_at, last_login FROM users WHERE id = ? AND is_active = TRUE',
      [id]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.password_hash) return false;
    return await bcrypt.compare(password, user.password_hash);
  }

  static async updateLastLogin(id: number): Promise<void> {
    await pool.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [id]
    );
  }

  static async findAll(): Promise<User[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, username, email, full_name, role, is_active, created_at, updated_at, last_login FROM users WHERE is_active = TRUE ORDER BY created_at DESC'
    );
    return rows as User[];
  }
}