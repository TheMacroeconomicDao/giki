"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Settings, Menu, Home, FileText, Folder, Star, Clock, Users, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { SignInButton } from "@/components/sign-in-button"
import { EnvironmentWarning } from "@/components/environment-warning"
import { LanguageSelector } from "@/components/language-selector"
import type { Language } from "@/lib/translation-service"

export default function WikiHome() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")

  const content = {
    en: {
      welcome: "Welcome to Your Wiki",
      subtitle: "Your centralized knowledge base for documentation and collaboration",
      gettingStarted: "Getting Started",
      gettingStartedDesc: "Learn how to create pages, organize content, and collaborate with your team.",
      readGuide: "Read Guide",
      recentChanges: "Recent Changes",
      popularPages: "Popular Pages",
      views: "views",
    },
    ru: {
      welcome: "Добро пожаловать в Вашу Вики",
      subtitle: "Ваша централизованная база знаний для документации и совместной работы",
      gettingStarted: "Начало работы",
      gettingStartedDesc: "Узнайте, как создавать страницы, организовывать контент и сотрудничать с вашей командой.",
      readGuide: "Читать руководство",
      recentChanges: "Недавние изменения",
      popularPages: "Популярные страницы",
      views: "просмотров",
    },
  }

  const t = content[currentLanguage]

  const recentChanges = {
    en: [
      { title: "Installation Guide", time: "2 hours ago" },
      { title: "API Documentation", time: "Yesterday" },
      { title: "User Management", time: "3 days ago" },
    ],
    ru: [
      { title: "Руководство по установке", time: "2 часа назад" },
      { title: "Документация API", time: "Вчера" },
      { title: "Управление пользователями", time: "3 дня назад" },
    ],
  }

  const popularPages = {
    en: [
      { title: "Getting Started", views: 1245 },
      { title: "API Reference", views: 982 },
      { title: "User Guide", views: 876 },
      { title: "Installation", views: 754 },
      { title: "Configuration", views: 621 },
      { title: "Troubleshooting", views: 543 },
    ],
    ru: [
      { title: "Начало работы", views: 1245 },
      { title: "Справочник API", views: 982 },
      { title: "Руководство пользователя", views: 876 },
      { title: "Установка", views: 754 },
      { title: "Конфигурация", views: 621 },
      { title: "Устранение неполадок", views: 543 },
    ],
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-semibold">Wiki.js</span>
          </Link>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4">
          <div className="mb-4">
            <Input
              type="search"
              placeholder={currentLanguage === "en" ? "Search..." : "Поиск..."}
              className="w-full"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-emerald-600"
            >
              <Home className="h-4 w-4" />
              {currentLanguage === "en" ? "Home" : "Главная"}
            </Link>
            <Link
              href="/pages"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FileText className="h-4 w-4" />
              {currentLanguage === "en" ? "Pages" : "Страницы"}
            </Link>
            <Link
              href="/folders"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Folder className="h-4 w-4" />
              {currentLanguage === "en" ? "Folders" : "Папки"}
            </Link>
            <Link
              href="/favorites"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Star className="h-4 w-4" />
              {currentLanguage === "en" ? "Favorites" : "Избранное"}
            </Link>
            <Link
              href="/history"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Clock className="h-4 w-4" />
              {currentLanguage === "en" ? "History" : "История"}
            </Link>
            <Link
              href="/users"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Users className="h-4 w-4" />
              {currentLanguage === "en" ? "Users" : "Пользователи"}
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="h-4 w-4" />
              {currentLanguage === "en" ? "Settings" : "Настройки"}
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <EnvironmentWarning />

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t.welcome}</h1>
              <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
              <SignInButton />
              <WalletConnectButton />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">{t.gettingStarted}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t.gettingStartedDesc}</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700">{t.readGuide}</Button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">{t.recentChanges}</h2>
              <ul className="space-y-2">
                {recentChanges[currentLanguage].map((change, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-sm">{change.title}</span>
                    <span className="text-xs text-gray-500">{change.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">{t.popularPages}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularPages[currentLanguage].map((page, i) => (
                <div key={i} className="p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <h3 className="font-medium mb-1">{page.title}</h3>
                  <p className="text-xs text-gray-500">
                    {page.views} {t.views}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
