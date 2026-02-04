import { body } from 'express-validator';

export const customerValidation = [
  body('company_name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 255 })
    .withMessage('Company name must not exceed 255 characters'),
  
  body('business_address')
    .trim()
    .notEmpty()
    .withMessage('Business address is required')
    .isLength({ max: 500 })
    .withMessage('Business address must not exceed 500 characters'),
  
  body('first_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('First name must not exceed 100 characters'),
  
  body('last_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Last name must not exceed 100 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('country_code')
    .optional()
    .trim()
    .matches(/^\+?[0-9]{1,4}$/)
    .withMessage('Invalid country code format'),
  
  body('contact_number')
    .optional()
    .trim()
    .matches(/^[0-9\s\-\(\)]+$/)
    .withMessage('Invalid contact number format'),
  
  body('status')
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive'),
  
  body('tapped')
    .isBoolean()
    .withMessage('Tapped must be a boolean value'),
  
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

export const customerUpdateValidation = [
  body('company_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty')
    .isLength({ max: 255 })
    .withMessage('Company name must not exceed 255 characters'),
  
  body('business_address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Business address cannot be empty')
    .isLength({ max: 500 })
    .withMessage('Business address must not exceed 500 characters'),
  
  body('first_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('First name must not exceed 100 characters'),
  
  body('last_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Last name must not exceed 100 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('country_code')
    .optional()
    .trim()
    .matches(/^\+?[0-9]{1,4}$/)
    .withMessage('Invalid country code format'),
  
  body('contact_number')
    .optional()
    .trim()
    .matches(/^[0-9\s\-\(\)]+$/)
    .withMessage('Invalid contact number format'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive'),
  
  body('tapped')
    .optional()
    .isBoolean()
    .withMessage('Tapped must be a boolean value')
  
  // body('latitude')
  //   .optional()
  //   .isFloat({ min: -90, max: 90 })
  //   .withMessage('Latitude must be between -90 and 90'),
  
  // body('longitude')
  //   .optional()
  //   .isFloat({ min: -180, max: 180 })
  //   .withMessage('Longitude must be between -180 and 180')
];