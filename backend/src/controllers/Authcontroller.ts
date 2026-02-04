import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UserModel } from '../models/User';
import { AuthResponse, LoginDTO, RegisterDTO } from '../types/user';
import jwt, { SignOptions } from 'jsonwebtoken';
import ms from 'ms';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRY: ms.StringValue =
  (process.env.JWT_EXPIRY as ms.StringValue) || '7d';


export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, email, password, full_name }: RegisterDTO = req.body;

      // Check if username exists
      const existingUsername = await UserModel.findByUsername(username);
      if (existingUsername) {
        res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
        return;
      }

      // Check if email exists
      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
        return;
      }

      // Create user
      const userId = await UserModel.create(
        {
          username,
          email,
          full_name,
          role: 'agent' // Default role
        },
        password
      );

      // Generate token
      const tokenPayload = { userId, username, role: 'agent' as const };
      const signOptions: SignOptions = { expiresIn: JWT_EXPIRY };
      const token = jwt.sign(tokenPayload, JWT_SECRET, signOptions);

      const response: AuthResponse = {
        success: true,
        token,
        user: {
          id: userId,
          username,
          email,
          full_name,
          role: 'agent'
        },
        message: 'Registration successful'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed'
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, password }: LoginDTO = req.body;

      // Find user
      const user = await UserModel.findByUsername(username);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
        return;
      }

      // Verify password
      const isPasswordValid = await UserModel.verifyPassword(user, password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
        return;
      }

      // Update last login
      await UserModel.updateLastLogin(user.id!);

      // Generate token
      const tokenPayload = { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      };
      const signOptions: SignOptions = { expiresIn: JWT_EXPIRY };
      const token = jwt.sign(tokenPayload, JWT_SECRET, signOptions);

      const response: AuthResponse = {
        success: true,
        token,
        user: {
          id: user.id!,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        },
        message: 'Login successful'
      };

      res.json(response);
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          created_at: user.created_at,
          last_login: user.last_login
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile'
      });
    }
  }
}