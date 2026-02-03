// src/routes/Customerroutes.ts
import { Router } from 'express';
import { CustomerController } from '../controllers/Customercontroller';
import { customerValidation, customerUpdateValidation } from '../middleware/validation';

const router = Router();

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