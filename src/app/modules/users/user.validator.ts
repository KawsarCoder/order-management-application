import { z } from 'zod';

const fullNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      {
        message: 'First name must be capitalized',
      },
    ),
  lastName: z.string().min(1),
});

const addressValidationSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
});

const orderValidationSchema = z.object({
  productName: z.string().min(1),
  price: z.number(),
  quantity: z.number(),
});

export const userValidationSchema = z.object({
  userId: z.number(),
  username: z.string().min(1),
  password: z.string().min(1),
  fullName: fullNameValidationSchema,
  age: z.number(),
  email: z.string().email(),
  isActive: z.enum(['active', 'blocked']).default('active'),
  hobbies: z.array(z.string()),
  address: addressValidationSchema,
  orders: z.array(orderValidationSchema),
});

export default userValidationSchema;
