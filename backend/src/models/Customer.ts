import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database';
import { Customer, CustomerFilters } from '../types/customer';

export class CustomerModel {
  static async create(customer: Customer): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO customers (
        user_id, first_name, last_name, email, country_code, contact_number,
        designation, company_name, business_address, nature_of_business,
        area, remarks, status, tapped
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer.user_id,
        customer.first_name || null,
        customer.last_name || null,
        customer.email || null,
        customer.country_code || null,
        customer.contact_number || null,
        customer.designation || null,
        customer.company_name,
        customer.business_address,
        customer.nature_of_business || null,
        customer.area || null,
        customer.remarks || null,
        customer.status,
        customer.tapped
      ]
    );
    return result.insertId;
  }

  static async findAll(filters?: CustomerFilters): Promise<Customer[]> {
    let query = 'SELECT * FROM customers WHERE 1=1';
    const params: any[] = [];

    if (filters?.user_id) {
      query += ' AND user_id = ?';
      params.push(filters.user_id);
    }

    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.tapped !== undefined) {
      query += ' AND tapped = ?';
      params.push(filters.tapped);
    }

    if (filters?.area) {
      query += ' AND area = ?';
      params.push(filters.area);
    }

    if (filters?.search) {
      query += ` AND (
        company_name LIKE ? OR 
        first_name LIKE ? OR 
        last_name LIKE ? OR 
        email LIKE ?
      )`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return rows as Customer[];
  }

  static async findById(id: number): Promise<Customer | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Customer) : null;
  }

  static async update(id: number, customer: Partial<Customer>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(customer).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'user_id') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE customers SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM customers WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getAreas(): Promise<string[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT DISTINCT area FROM customers WHERE area IS NOT NULL ORDER BY area'
    );
    return rows.map(row => row.area);
  }
}