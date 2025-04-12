"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, ArrowRight, User, Star, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SignInButton } from "@/components/sign-in-button"
import { EnvironmentWarning } from "@/components/environment-warning"
import { Input } from "@/components/ui/input"
import type { Language } from "@/lib/translation-service"

export default function WikiHome() {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")
  const [searchQuery, setSearchQuery] = useState("")

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
      browseWiki: "Browse Wiki",
      createPage: "Create New Page",
      searchPlaceholder: "Search wiki...",
      viewAll: "View all",
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
      browseWiki: "Просмотр Вики",
      createPage: "Создать новую страницу",
      searchPlaceholder: "Поиск в вики...",
      viewAll: "Просмотреть все",
    },
  }

  const t = content[currentLanguage]

  const recentChanges = {
    en: [
      { id: "installation-guide", title: "Installation Guide", time: "2 hours ago", user: "John Doe" },
      { id: "api-documentation", title: "API Documentation", time: "Yesterday", user: "Jane Smith" },
      { id: "getting-started", title: "User Management", time: "3 days ago", user: "Mike Johnson" },
    ],
    ru: [
      { id: "installation-guide", title: "Руководство по установке", time: "2 часа назад", user: "Иван Петров" },
      { id: "api-documentation", title: "Документация API", time: "Вчера", user: "Елена Смирнова" },
      { id: "getting-started", title: "Управление пользователями", time: "3 дня назад", user: "Михаил Иванов" },
    ],
  }

  const popularPages = {
    en: [
      { id: "getting-started", title: "Getting Started", views: 1245 },
      { id: "api-documentation", title: "API Reference", views: 982 },
      { id: "user-management", title: "User Guide", views: 876 },
      { id: "installation-guide", title: "Installation", views: 754 },
      { id: "configuration", title: "Configuration", views: 621 },
      { id: "troubleshooting", title: "Troubleshooting", views: 543 },
    ],
    ru: [
      { id: "getting-started", title: "Начало работы", views: 1245 },
      { id: "api-documentation", title: "Справочник API", views: 982 },
      { id: "user-management", title: "Руководство пользователя", views: 876 },
      { id: "installation-guide", title: "Установка", views: 754 },
      { id: "configuration", title: "Конфигурация", views: 621 },
      { id: "troubleshooting", title: "Устранение неполадок", views: 543 },
    ],
  }

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/pages?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handlePageClick = (id: string) => {
    router.push(`/view/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b bg-white p-4 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-semibold">Wiki.js</span>
          </div>
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder={t.searchPlaceholder}
                className="w-full rounded-full pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLanguageChange(currentLanguage === "en" ? "ru" : "en")}
            >
              {currentLanguage === "en" ? "Русский" : "English"}
            </Button>
            <SignInButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <EnvironmentWarning />

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">{t.welcome}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t.gettingStarted}</h2>
                <FileText className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">{t.gettingStartedDesc}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handlePageClick("getting-started")}
                >
                  {t.readGuide}
                </Button>
                <Link href="/pages">
                  <Button variant="outline" className="flex items-center gap-2 w-full">
                    {t.browseWiki}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">{t.recentChanges}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {recentChanges[currentLanguage].map((change, i) => (
                  <li
                    key={i}
                    className="border-b pb-3 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 -mx-6 px-6"
                    onClick={() => handlePageClick(change.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium hover:text-emerald-600">{change.title}</span>
                      <span className="text-xs text-gray-500">{change.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>{change.user}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t text-center">
                <Link href="/history">
                  <Button variant="link" className="text-emerald-600 hover:text-emerald-700">
                    {t.viewAll}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{t.popularPages}</CardTitle>
              <Link href="/editor">
                <Button className="bg-emerald-600 hover:bg-emerald-700">{t.createPage}</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularPages[currentLanguage].map((page, i) => (
                <div
                  key={i}
                  className="p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => handlePageClick(page.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{page.title}</h3>
                    <Star className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {page.views} {t.views}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
