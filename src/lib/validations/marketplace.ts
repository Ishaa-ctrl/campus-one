import { z } from 'zod';

export const marketplaceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description is too long'),
  price: z.number().min(0, 'Price cannot be negative').max(100000, 'Price seems too high'),
  category: z.enum(['books', 'electronics', 'stationery', 'clothing', 'lab_equipment', 'others']),
  condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor']),
  location: z.string().max(200, 'Location is too long').optional(),
  contact_preference: z.string().max(200).optional(),
});

export type MarketplaceFormValues = z.infer<typeof marketplaceSchema>;
