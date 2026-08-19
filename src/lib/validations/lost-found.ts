import { z } from 'zod';

export const lostFoundSchema = z.object({
  item_name: z.string().min(2, 'Item name must be at least 2 characters').max(200, 'Item name is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description is too long'),
  type: z.enum(['lost', 'found']),
  location: z.string().min(2, 'Location must be at least 2 characters').max(200, 'Location is too long'),
  date: z.string().min(1, 'Please select a date'),
});

export type LostFoundFormValues = z.infer<typeof lostFoundSchema>;
