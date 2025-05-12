import { z } from 'zod';

/**
 * Схема валидации для пользователя
 */
export const userSchema = z.object({
  id: z.string().uuid(),
  address: z.string(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  avatar_url: z.string().nullable(),
  role: z.enum(['admin', 'editor', 'viewer']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  last_login: z.string().datetime().nullable(),
});

/**
 * Тип пользователя на основе схемы валидации
 */
export type User = z.infer<typeof userSchema>;

/**
 * Схема для создания пользователя
 */
export const createUserSchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  last_login: true,
}).partial({
  name: true,
  email: true,
  avatar_url: true,
}).required({
  address: true,
  role: true,
});

/**
 * Тип для создания пользователя
 */
export type CreateUserDto = z.infer<typeof createUserSchema>;

/**
 * Схема для обновления пользователя
 */
export const updateUserSchema = createUserSchema.partial();

/**
 * Тип для обновления пользователя
 */
export type UpdateUserDto = z.infer<typeof updateUserSchema>; 