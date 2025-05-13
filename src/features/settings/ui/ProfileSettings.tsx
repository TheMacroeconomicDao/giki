import { useCallback } from 'react';
import { useSettingsStore } from '../model/store';
import type { SettingsState, SettingsActions } from '../model/types';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Avatar } from '@/shared/ui/avatar';

export function ProfileSettings() {
  const { profile, isLoading, error, updateProfile } = useSettingsStore((state: SettingsState & SettingsActions) => ({
    profile: state.settings?.profile,
    isLoading: state.isLoading,
    error: state.error,
    updateProfile: state.updateProfile,
  }));

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    updateProfile({
      name: formData.get('name') as string,
      bio: formData.get('bio') as string,
      avatar: null, // Обработка аватара требует отдельной логики
    });
  }, [updateProfile]);

  if (!profile) {
    return (
      <div className="p-4 text-center">
        <p>Профиль не загружен</p>
        <Button 
          onClick={() => console.log('Load profile')}
          disabled={isLoading}
        >
          Загрузить профиль
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Настройки профиля</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar 
            size="lg"
            src={profile.avatar || undefined} 
            alt={profile.name || 'Аватар пользователя'} 
            fallback={profile.name?.[0] || '?'} 
          />
          
          <div>
            <Button type="button" variant="outline">
              Изменить аватар
            </Button>
            <p className="mt-1 text-sm text-gray-500">
              JPG, PNG или GIF. Макс. 2MB.
            </p>
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="name">Имя пользователя</label>
          <Input
            id="name"
            name="name"
            defaultValue={profile.name || ''}
            placeholder="Ваше имя"
            required
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="bio">О себе</label>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={profile.bio || ''}
            placeholder="Расскажите немного о себе..."
            rows={4}
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium">Адрес кошелька</label>
          <p className="p-2 bg-gray-100 border border-gray-300 rounded-md font-mono text-sm">
            {profile.address}
          </p>
          <p className="text-xs text-gray-500">
            Это ваш Web3 адрес, он не может быть изменен
          </p>
        </div>
        
        <div className="pt-4 border-t flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </div>
      </form>
    </div>
  );
}
