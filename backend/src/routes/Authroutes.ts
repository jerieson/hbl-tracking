import { Router } from 'express';
import { AuthController } from '../controllers/Authcontroller';
import { registerValidation, loginValidation } from '../middleware/authValidation';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);

// Protected routes
router.get('/profile', authenticate, AuthController.getProfile);

export default router;