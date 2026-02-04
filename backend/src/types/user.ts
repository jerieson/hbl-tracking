export interface User {
  id?: number;
  username: string;
  email: string;
  password_hash?: string;
  full_name?: string;
  role: 'admin' | 'agent';
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  last_login?: Date;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    full_name?: string;
    role: 'admin' | 'agent';
  };
  message?: string;
}