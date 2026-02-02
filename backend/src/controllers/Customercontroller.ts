import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CustomerModel } from '../models/Customer';
import { Customer } from '../types/customer';

export class CustomerController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const customer: Customer = req.body;
      const id = await CustomerModel.create(customer);
      
      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: { id }
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create customer'
      });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        status: req.query.status as 'active' | 'inactive' | undefined,
        tapped: req.query.tapped === 'true' ? true : req.query.tapped === 'false' ? false : undefined,
        search: req.query.search as string | undefined,
        area: req.query.area as string | undefined
      };

      const customers = await CustomerModel.findAll(filters);
      
      res.json({
        success: true,
        data: customers,
        count: customers.length
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customers'
      });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const customer = await CustomerModel.findById(id);
      
      if (!customer) {
        res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
        return;
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer'
      });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = parseInt(req.params.id);
      const customer: Partial<Customer> = req.body;
      
      const updated = await CustomerModel.update(id, customer);
      
      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Customer updated successfully'
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update customer'
      });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await CustomerModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete customer'
      });
    }
  }

  static async getAreas(req: Request, res: Response): Promise<void> {
    try {
      const areas = await CustomerModel.getAreas();
      res.json({
        success: true,
        data: areas
      });
    } catch (error) {
      console.error('Error fetching areas:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch areas'
      });
    }
  }
}