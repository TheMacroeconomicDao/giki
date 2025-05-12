'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Globe, Lock, Users } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Footer } from '@/widgets/footer';
import { useSettingsStore } from '@/entities/settings';

/**
 * Компонент списка недавних страниц
 * В будущем будет заменен на виджет из entities/page
 */
const RecentPages: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-base">Пример недавней страницы {i + 1}</CardTitle>
              <CardDescription>Обновлено 2 часа назад</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link href={`/pages/example-${i + 1}`}>Открыть</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

/**
 * Компонент списка популярных страниц
 * В будущем будет заменен на виджет из entities/page
 */
const PopularPages: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-base">Пример популярной страницы {i + 1}</CardTitle>
              <CardDescription>{100 - i * 10} просмотров</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link href={`/pages/popular-${i + 1}`}>Открыть</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

/**
 * Компонент домашней страницы приложения по архитектуре FSD
 */
export const HomePage: React.FC = () => {
  const { systemSettings } = useSettingsStore();
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto space-y-8 flex-1 py-8">
        <div className="text-center space-y-4 py-10">
          <h1 className="text-4xl font-bold tracking-tight">
            {systemSettings?.site_name || 'Giki.js'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Платформа для создания вики с AI-переводом и Web3 аутентификацией
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button asChild size="lg">
              <Link href="/create">Создать страницу</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pages">Просмотр страниц</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <CardTitle>Общедоступные</CardTitle>
              </div>
              <CardDescription>Контент, видимый всем в интернете</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Делитесь знаниями со всем миром. Общедоступные страницы индексируются поисковыми системами.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/pages?visibility=public">Просмотр общедоступных страниц</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <CardTitle>Сообщество</CardTitle>
              </div>
              <CardDescription>Контент для зарегистрированных пользователей</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Сотрудничайте с другими участниками. Страницы сообщества видны только аутентифицированным пользователям.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/pages?visibility=community">Просмотр страниц сообщества</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-500" />
                <CardTitle>Личные</CardTitle>
              </div>
              <CardDescription>Контент, видимый только вам</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Храните личные заметки в безопасности. Личные страницы доступны только вам и не могут быть переданы другим.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/private">Мои личные страницы</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="recent">Недавние страницы</TabsTrigger>
            <TabsTrigger value="popular">Популярные страницы</TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="mt-6">
            <RecentPages />
          </TabsContent>
          <TabsContent value="popular" className="mt-6">
            <PopularPages />
          </TabsContent>
        </Tabs>

        <div className="bg-muted/50 rounded-lg p-6 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Начало работы</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Создайте первую страницу</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Узнайте, как создавать и форматировать wiki-страницы с помощью нашего редактора.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/docs/create-page">Прочитать руководство</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI-перевод</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Изучите, как использовать функцию перевода одним кликом для создания многоязычного контента.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/docs/translation">Прочитать руководство</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Web3 аутентификация</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Подключите свой крипто-кошелек для безопасного входа без паролей.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/docs/web3-auth">Прочитать руководство</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}; 