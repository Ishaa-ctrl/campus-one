import { z } from 'zod';

export const noteUploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  subject_id: z.string().optional(),
  subject_name: z.string().optional(),
  semester: z.number().min(1).max(8, 'Invalid semester'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
});

export type NoteUploadFormValues = z.infer<typeof noteUploadSchema>;
