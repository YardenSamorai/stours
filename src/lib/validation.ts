/**
 * Validation utilities for API routes
 */

export class ValidationError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate rating is between 1 and 5
 */
export function validateRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * Validate required fields
 */
export function validateRequired(
  data: Record<string, any>,
  fields: string[]
): void {
  const missing = fields.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(', ')}`
    );
  }
}

/**
 * Validate ID is a valid number
 */
export function validateId(id: string): number {
  const numId = parseInt(id, 10);
  if (isNaN(numId) || numId <= 0) {
    throw new ValidationError('Invalid ID format');
  }
  return numId;
}

/**
 * Validate price is positive number
 */
export function validatePrice(price: string | number): boolean {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numPrice) && numPrice > 0;
}

/**
 * Validate date string format (YYYY-MM-DD)
 */
export function validateDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}
