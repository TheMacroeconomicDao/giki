import { useCallback } from 'react';
import type { AppStats, UserRole } from '../model/types';
import { useAdminStore } from '../model/store';

interface AdminDashboardProps {
  initialStats?: AppStats;
}

export function AdminDashboard({ initialStats }: AdminDashboardProps) {
  const { stats, isLoading, error } = useAdminStore((state) => ({
    stats: state.stats || initialStats || null,
    isLoading: state.isLoading,
    error: state.error
  }));

  const handleRoleChange = useCallback((userId: string, role: UserRole) => {
    // Здесь будет обработка изменения роли через API
    console.log('Change role', userId, role);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Административная панель</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Ошибка загрузки данных</h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Нет данных</h2>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => console.log('Load stats')}
        >
          Загрузить статистику
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Административная панель</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-medium text-blue-900">Пользователи</h3>
          <p className="text-3xl font-bold text-blue-700">{stats.totalUsers}</p>
        </div>
        
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-green-900">Страницы</h3>
          <p className="text-3xl font-bold text-green-700">{stats.totalPages}</p>
        </div>
        
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h3 className="text-lg font-medium text-amber-900">Переводы</h3>
          <p className="text-3xl font-bold text-amber-700">{stats.totalTranslations}</p>
        </div>
        
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
          <h3 className="text-lg font-medium text-purple-900">Активные пользователи</h3>
          <p className="text-3xl font-bold text-purple-700">{stats.activeUsers}</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Управление пользователями</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Имя</th>
                <th className="py-2 px-4 text-left">Роль</th>
                <th className="py-2 px-4 text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              {/* Здесь будет список пользователей */}
              <tr className="border-t border-gray-200">
                <td className="py-2 px-4">user-123</td>
                <td className="py-2 px-4">Администратор</td>
                <td className="py-2 px-4">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs">
                    Администратор
                  </span>
                </td>
                <td className="py-2 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">
                    Изменить
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    Блокировать
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Журнал действий</h3>
        <div className="border border-gray-200 rounded-md p-4">
          <p className="text-gray-500">
            Последнее обновление: {new Date(stats.lastUpdated).toLocaleString('ru-RU')}
          </p>
          {/* Здесь будет журнал действий */}
        </div>
      </div>
    </div>
  );
}
