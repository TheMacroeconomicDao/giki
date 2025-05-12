import { z } from 'zod';

/**
 * Схема валидации для пользовательских настроек
 */
export const userSettingsSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  language: z.string().min(2).max(5).default('ru'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications_enabled: z.boolean().default(true),
  email_notifications: z.boolean().default(true),
  display_name_preference: z.enum(['name', 'address', 'both']).default('name'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/**
 * Тип пользовательских настроек
 */
export type UserSettings = z.infer<typeof userSettingsSchema>;

/**
 * Схема валидации для системных настроек
 */
export const systemSettingsSchema = z.object({
  id: z.string().uuid(),
  site_name: z.string().min(1).default('Giki'),
  site_description: z.string().optional(),
  default_language: z.string().min(2).max(5).default('ru'),
  available_languages: z.array(z.string().min(2).max(5)).default(['ru', 'en']),
  maintenance_mode: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  updated_by: z.string().uuid().optional(),
});

/**
 * Тип системных настроек
 */
export type SystemSettings = z.infer<typeof systemSettingsSchema>;

/**
 * Схема для обновления пользовательских настроек
 */
export const updateUserSettingsSchema = userSettingsSchema.partial().omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

/**
 * Тип для обновления пользовательских настроек
 */
export type UpdateUserSettingsDto = z.infer<typeof updateUserSettingsSchema>;

/**
 * Схема для обновления системных настроек
 */
export const updateSystemSettingsSchema = systemSettingsSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

/**
 * Тип для обновления системных настроек
 */
export type UpdateSystemSettingsDto = z.infer<typeof updateSystemSettingsSchema>; 