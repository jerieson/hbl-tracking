import { Router } from 'express';
import { CustomerController } from '../controllers/Customercontroller';
import { customerValidation, customerUpdateValidation } from '../middleware/validation';

const router = Router();

// Create a new customer
router.post('/', customerValidation, CustomerController.create);

// Get all customers with optional filters
router.get('/', CustomerController.getAll);

// Get unique areas
router.get('/areas', CustomerController.getAreas);

// Get customer by ID
router.get('/:id', CustomerController.getById);

// Update customer
router.put('/:id', customerUpdateValidation, CustomerController.update);

// Delete customer
router.delete('/:id', CustomerController.delete);

export default router;