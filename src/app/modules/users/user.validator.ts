import { z } from 'zod';

const fullNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  lastName: z.string().min(1).max(20),
});

const addressValidationSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
});

export const userValidationSchema = z.object({
  userId: z.number(),
  username: z.string().min(3),
  password: z.string(),
  fullName: fullNameValidationSchema,
  age: z.number(),
  email: z.string().email(),
  isActive: z.enum(['active', 'blocked']).default('active'),
  hobbies: z.array(z.string()),
  address: addressValidationSchema,
  isDeleted: z.boolean(),
});

export default userValidationSchema;
