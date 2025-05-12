/**
 * Обработчики API для пользователей (FSD)
 */
import { NextRequest } from 'next/server';
import { 
  getUserById, 
  getAllUsers, 
  createUser as createUserEntity, 
  updateUser as updateUserEntity,
  deleteUser as deleteUserEntity 
} from '@/entities/user';
import { authenticateRequest, successResponse, errorResponse, handleApiError } from '../utils';
import { CreateUserData, UpdateUserData } from './types';

/**
 * Получение всех пользователей
 */
export async function getUsers(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const role = searchParams.get('role') as any;
    const search = searchParams.get('search') || undefined;

    // Аутентификация (требуется роль админа)
    const auth = await authenticateRequest(req);
    
    if (!auth.authenticated || auth.user?.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }
    
    const { users, total } = await getAllUsers({
      limit,
      offset,
      role,
      search
    });

    return successResponse({
      users,
      total,
      limit,
      offset
    });
  } catch (error) {
    return handleApiError(error, 'Failed to get users');
  }
}

/**
 * Получение пользователя по ID
 */
export async function getUser(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserById(params.id);

    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Аутентификация
    const auth = await authenticateRequest(req);

    // Проверка прав доступа - только админ или сам пользователь может получить данные
    if (!auth.authenticated || (auth.user?.role !== 'admin' && auth.user?.sub !== params.id)) {
      return errorResponse('Unauthorized', 401);
    }

    return successResponse({ user });
  } catch (error) {
    return handleApiError(error, 'Failed to get user');
  }
}

/**
 * Создание нового пользователя (только админ)
 */
export async function createUser(req: NextRequest) {
  try {
    // Аутентификация
    const auth = await authenticateRequest(req);

    if (!auth.authenticated || auth.user?.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    const data = await req.json() as CreateUserData;
    
    // Валидация данных
    if (!data.address) {
      return errorResponse('Address is required', 400);
    }

    const newUser = await createUserEntity(data);

    return successResponse({ user: newUser }, 201);
  } catch (error) {
    return handleApiError(error, 'Failed to create user');
  }
}

/**
 * Обновление пользователя
 */
export async function updateUser(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Аутентификация
    const auth = await authenticateRequest(req);

    if (!auth.authenticated) {
      return errorResponse('Authentication required', 401);
    }

    // Проверка прав доступа - только админ или сам пользователь может обновить данные
    if (auth.user?.role !== 'admin' && auth.user?.sub !== params.id) {
      return errorResponse('You don\'t have permission to update this user', 403);
    }

    // Получение данных для обновления
    const data = await req.json() as UpdateUserData;

    // Запретить обычным пользователям менять роль
    if (data.role && auth.user?.role !== 'admin') {
      return errorResponse('Only admins can change user roles', 403);
    }

    // Обновление пользователя
    const updatedUser = await updateUserEntity(params.id, data);

    return successResponse({ user: updatedUser });
  } catch (error) {
    return handleApiError(error, 'Failed to update user');
  }
}

/**
 * Удаление пользователя (только админ)
 */
export async function deleteUser(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Аутентификация
    const auth = await authenticateRequest(req);

    if (!auth.authenticated || auth.user?.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    // Удаление пользователя
    await deleteUserEntity(params.id);

    return successResponse({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to delete user');
  }
} 