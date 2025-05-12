/**
 * API для работы с пользователями (FSD)
 */
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from './handlers';
import type {
  GetUsersParams,
  CreateUserData,
  UpdateUserData,
  UserParams,
  GetUsersResponse,
  GetUserResponse
} from './types';

export {
  // Обработчики
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  
  // Типы
  type GetUsersParams,
  type CreateUserData,
  type UpdateUserData,
  type UserParams,
  type GetUsersResponse,
  type GetUserResponse
}; 