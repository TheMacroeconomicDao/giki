/**
 * Обработчики API для страниц (FSD)
 */
import { NextRequest } from 'next/server';
import { 
  getPageById, 
  getAllPages, 
  createPage as createPageEntity, 
  updatePage as updatePageEntity,
  deletePage as deletePageEntity,
  incrementPageViews
} from '@/entities/page';
import { authenticateRequest, successResponse, errorResponse, handleApiError } from '../utils';
import { CreatePageData, UpdatePageData } from './types';

/**
 * Получение всех страниц
 */
export async function getPages(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const visibility = searchParams.get('visibility') as any;
    const authorId = searchParams.get('authorId') || undefined;
    const search = searchParams.get('search') || undefined;

    // Аутентификация для доступа к непубличным страницам
    const auth = await authenticateRequest(req);
    
    const { pages, total } = await getAllPages({
      limit,
      offset,
      visibility,
      authorId,
      search,
      currentUserId: auth.user?.sub
    });

    return successResponse({
      pages,
      total,
      limit,
      offset
    });
  } catch (error) {
    return handleApiError(error, 'Failed to get pages');
  }
}

/**
 * Получение страницы по ID
 */
export async function getPage(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const page = await getPageById(params.id);

    if (!page) {
      return errorResponse('Page not found', 404);
    }

    // Аутентификация для доступа к непубличным страницам
    const auth = await authenticateRequest(req);

    // Проверка прав доступа
    if (page.visibility !== 'public' && !auth.authenticated) {
      return errorResponse('Authentication required to access this page', 401);
    }

    // Если страница приватная, только админы и автор могут её видеть
    if (page.visibility === 'private' && auth.user?.role !== 'admin' && auth.user?.sub !== page.author.id) {
      return errorResponse('You don\'t have permission to access this page', 403);
    }

    // Увеличение счетчика просмотров
    await incrementPageViews(params.id);

    return successResponse({ page });
  } catch (error) {
    return handleApiError(error, 'Failed to get page');
  }
}

/**
 * Создание новой страницы
 */
export async function createPage(req: NextRequest) {
  try {
    // Аутентификация
    const auth = await authenticateRequest(req);

    if (!auth.authenticated) {
      return errorResponse('Authentication required', 401);
    }

    const data = await req.json() as CreatePageData;
    
    // Валидация данных
    if (!data.title.trim()) {
      return errorResponse('Title is required', 400);
    }
    
    if (!data.content.trim()) {
      return errorResponse('Content is required', 400);
    }

    const newPage = await createPageEntity({
      ...data,
      authorId: auth.user!.sub
    });

    return successResponse({ page: newPage }, 201);
  } catch (error) {
    return handleApiError(error, 'Failed to create page');
  }
}

/**
 * Обновление страницы
 */
export async function updatePage(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Аутентификация
    const auth = await authenticateRequest(req);

    if (!auth.authenticated) {
      return errorResponse('Authentication required', 401);
    }

    // Получение текущей страницы
    const existingPage = await getPageById(params.id);

    if (!existingPage) {
      return errorResponse('Page not found', 404);
    }

    // Проверка прав на редактирование
    const isAuthor = auth.user!.sub === existingPage.author.id;
    const isAdmin = auth.user!.role === 'admin';
    const isEditor = auth.user!.role === 'editor';

    if (!isAuthor && !isAdmin && !isEditor) {
      return errorResponse('You don\'t have permission to update this page', 403);
    }

    const data = await req.json() as UpdatePageData;

    // Обновление страницы
    const updatedPage = await updatePageEntity(params.id, data);

    return successResponse({ page: updatedPage });
  } catch (error) {
    return handleApiError(error, 'Failed to update page');
  }
}

/**
 * Удаление страницы
 */
export async function deletePage(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Аутентификация
    const auth = await authenticateRequest(req);

    if (!auth.authenticated) {
      return errorResponse('Authentication required', 401);
    }

    // Получение текущей страницы
    const existingPage = await getPageById(params.id);

    if (!existingPage) {
      return errorResponse('Page not found', 404);
    }

    // Проверка прав на удаление
    const isAuthor = auth.user!.sub === existingPage.author.id;
    const isAdmin = auth.user!.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return errorResponse('You don\'t have permission to delete this page', 403);
    }

    // Удаление страницы
    await deletePageEntity(params.id);

    return successResponse({ success: true });
  } catch (error) {
    return handleApiError(error, 'Failed to delete page');
  }
} 