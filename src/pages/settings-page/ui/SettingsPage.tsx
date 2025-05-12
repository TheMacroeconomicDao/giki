'use client';

import { useState } from 'react';
import { Save, User, Palette, Bell, Settings, Key } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useSettingsPage } from '../model/hooks';
import { SettingsTab } from '../model/types';

/**
 * Компонент страницы настроек
 */
export const SettingsPage = () => {
  const [
    { systemSettings, userSettings, loading, saving, error, isAdmin },
    { updateSystemSetting, updateUserSetting, saveSettings },
    activeTab,
    setActiveTab
  ] = useSettingsPage();

  // Обработчик сохранения настроек
  const handleSave = async () => {
    await saveSettings();
  };

  // Отображение загрузки
  if (loading) {
    return (
      <div className="container mx-auto py-10 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <div className="container mx-auto py-10 max-w-4xl">
        <Alert variant="destructive">
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Настройки</h1>
          <p className="text-muted-foreground">
            Управляйте настройками вашего аккаунта и параметрами приложения.
          </p>
        </div>
        
        <Separator />
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SettingsTab)}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <TabsList className="grid grid-cols-2 md:grid-cols-1 gap-2">
                <TabsTrigger value="profile" className="justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Профиль
                </TabsTrigger>
                <TabsTrigger value="appearance" className="justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  Внешний вид
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Уведомления
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="system" className="justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Система
                  </TabsTrigger>
                )}
                <TabsTrigger value="api" className="justify-start">
                  <Key className="h-4 w-4 mr-2" />
                  API
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 space-y-4">
              {/* Профиль */}
              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Профиль</CardTitle>
                    <CardDescription>
                      Управляйте информацией вашего профиля.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="display-name">Отображаемое имя</Label>
                      <Input
                        id="display-name"
                        value={userSettings?.display_name || ''}
                        onChange={(e) => updateUserSetting('display_name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">О себе</Label>
                      <Input
                        id="bio"
                        value={userSettings?.bio || ''}
                        onChange={(e) => updateUserSetting('bio', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="public-profile"
                        checked={userSettings?.public_profile || false}
                        onCheckedChange={(checked) => updateUserSetting('public_profile', checked)}
                      />
                      <Label htmlFor="public-profile">Публичный профиль</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Внешний вид */}
              <TabsContent value="appearance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Внешний вид</CardTitle>
                    <CardDescription>
                      Настройте внешний вид приложения.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Тема</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="theme-light"
                            name="theme"
                            value="light"
                            checked={userSettings?.theme === 'light'}
                            onChange={() => updateUserSetting('theme', 'light')}
                          />
                          <Label htmlFor="theme-light">Светлая</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="theme-dark"
                            name="theme"
                            value="dark"
                            checked={userSettings?.theme === 'dark'}
                            onChange={() => updateUserSetting('theme', 'dark')}
                          />
                          <Label htmlFor="theme-dark">Темная</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="theme-system"
                            name="theme"
                            value="system"
                            checked={userSettings?.theme === 'system'}
                            onChange={() => updateUserSetting('theme', 'system')}
                          />
                          <Label htmlFor="theme-system">Системная</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="compact-mode"
                        checked={userSettings?.compact_mode || false}
                        onCheckedChange={(checked) => updateUserSetting('compact_mode', checked)}
                      />
                      <Label htmlFor="compact-mode">Компактный режим</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Уведомления */}
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Уведомления</CardTitle>
                    <CardDescription>
                      Настройте параметры уведомлений.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="email-notifications"
                        checked={userSettings?.email_notifications || false}
                        onCheckedChange={(checked) => updateUserSetting('email_notifications', checked)}
                      />
                      <Label htmlFor="email-notifications">Email уведомления</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="push-notifications"
                        checked={userSettings?.push_notifications || false}
                        onCheckedChange={(checked) => updateUserSetting('push_notifications', checked)}
                      />
                      <Label htmlFor="push-notifications">Push уведомления</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Системные настройки (только для админов) */}
              {isAdmin && (
                <TabsContent value="system" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Системные настройки</CardTitle>
                      <CardDescription>
                        Управляйте системными настройками приложения.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="site-name">Название сайта</Label>
                        <Input
                          id="site-name"
                          value={systemSettings?.site_name || ''}
                          onChange={(e) => updateSystemSetting('site_name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="site-description">Описание сайта</Label>
                        <Input
                          id="site-description"
                          value={systemSettings?.site_description || ''}
                          onChange={(e) => updateSystemSetting('site_description', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enable-registration"
                          checked={systemSettings?.enable_public_registration === 'true'}
                          onCheckedChange={(checked) => updateSystemSetting('enable_public_registration', checked ? 'true' : 'false')}
                        />
                        <Label htmlFor="enable-registration">Разрешить публичную регистрацию</Label>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* API настройки */}
              <TabsContent value="api" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>API настройки</CardTitle>
                    <CardDescription>
                      Управляйте API ключами и интеграциями.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API ключ</Label>
                      <div className="flex gap-2">
                        <Input
                          id="api-key"
                          value={userSettings?.api_key || '••••••••••••••••'}
                          readOnly
                          type="password"
                        />
                        <Button variant="outline">Показать</Button>
                        <Button variant="outline">Сгенерировать новый</Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enable-api"
                        checked={userSettings?.enable_api || false}
                        onCheckedChange={(checked) => updateUserSetting('enable_api', checked)}
                      />
                      <Label htmlFor="enable-api">Включить API доступ</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Сохранение...' : 'Сохранить настройки'}
          </Button>
        </div>
      </div>
    </div>
  );
}; 