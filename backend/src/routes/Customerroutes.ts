import { Router } from 'express';
import { CustomerController } from '../controllers/Customercontroller';
import { customerValidation, customerUpdateValidation } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// All customer routes require authentication
router.use(authenticate);

// Get all areas (no auth required for this, or keep it protected)
router.get('/areas', CustomerController.getAreas);

// Get all customers with optional filters
router.get('/', CustomerController.getAll);

// Get customer by ID
router.get('/:id', CustomerController.getById);

// Create a new customer
router.post('/', customerValidation, CustomerController.create);

// Update customer
router.put('/:id', customerUpdateValidation, CustomerController.update);

// Delete customer
router.delete('/:id', CustomerController.delete);

export default router;