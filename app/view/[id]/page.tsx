"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Clock, Star, StarOff, Share2, Printer, Download, ArrowLeft, History } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-context"
import type { Language } from "@/lib/translation-service"
import { Skeleton } from "@/components/ui/skeleton"

export default function ViewPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { hasPermission } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")

  const pageId = params.id as string
  const versionId = searchParams.get("version")

  // Mock page data
  const pages = {
    "installation-guide": {
      id: "installation-guide",
      title: {
        en: "Installation Guide",
        ru: "Руководство по установке",
      },
      content: {
        en: `
# Installation Guide

## System Requirements

- **CPU**: 2 cores (4 recommended)
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 20GB minimum
- **Operating System**: Ubuntu 20.04 LTS, CentOS 8, or Windows Server 2019

## Database Requirements

- PostgreSQL 12+ or MySQL 8+
- 2GB RAM dedicated to database

## Installation Steps

1. Download the installer package
2. Run the setup wizard
3. Configure your database connection
4. Set up administrator account
5. Complete the installation
        `,
        ru: `
# Руководство по установке

## Системные требования

- **Процессор**: 2 ядра (рекомендуется 4)
- **Оперативная память**: минимум 4 ГБ (рекомендуется 8 ГБ)
- **Дисковое пространство**: минимум 20 ГБ
- **Операционная система**: Ubuntu 20.04 LTS, CentOS 8 или Windows Server 2019

## Требования к базе данных

- PostgreSQL 12+ или MySQL 8+
- 2 ГБ оперативной памяти, выделенной для базы данных

## Шаги установки

1. Загрузите установочный пакет
2. Запустите мастер установки
3. Настройте подключение к базе данных
4. Настройте учетную запись администратора
5. Завершите установку
        `,
      },
      updatedAt: "2023-04-12T10:30:00Z",
      updatedBy: "John Doe",
      path: "/documentation/installation",
    },
    "api-documentation": {
      id: "api-documentation",
      title: {
        en: "API Documentation",
        ru: "Документация API",
      },
      content: {
        en: `
# API Documentation

## Authentication

All API requests require authentication using JWT tokens.

## Endpoints

### User Management

- GET /api/users - List all users
- GET /api/users/:id - Get user details
- POST /api/users - Create new user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

### Content Management

- GET /api/pages - List all pages
- GET /api/pages/:id - Get page details
- POST /api/pages - Create new page
- PUT /api/pages/:id - Update page
- DELETE /api/pages/:id - Delete page
        `,
        ru: `
# Документация API

## Аутентификация

Все запросы API требуют аутентификации с использованием JWT токенов.

## Конечные точки

### Управление пользователями

- GET /api/users - Список всех пользователей
- GET /api/users/:id - Получить детали пользователя
- POST /api/users - Создать нового пользователя
- PUT /api/users/:id - Обновить пользователя
- DELETE /api/users/:id - Удалить пользователя

### Управление контентом

- GET /api/pages - Список всех страниц
- GET /api/pages/:id - Получить детали страницы
- POST /api/pages - Создать новую страницу
- PUT /api/pages/:id - Обновить страницу
- DELETE /api/pages/:id - Удалить страницу
        `,
      },
      updatedAt: "2023-04-11T14:45:00Z",
      updatedBy: "Jane Smith",
      path: "/api/reference",
    },
    "getting-started": {
      id: "getting-started",
      title: {
        en: "Getting Started with Wiki.js",
        ru: "Начало работы с Wiki.js",
      },
      content: {
        en: `
# Getting Started with Wiki.js

Welcome to Wiki.js! This guide will help you get up and running quickly.

## Installation

To install Wiki.js, you need:
- Node.js 14.x or later
- MongoDB 4.x or PostgreSQL 10.x or later
- Git (optional, for version control)

## Basic Configuration

After installation, you'll need to configure:
1. Authentication methods
2. User permissions
3. Content organization

## Creating Your First Page

To create a new page:
1. Click the "+" button in the sidebar
2. Enter a title for your page
3. Choose a location in your wiki structure
4. Start writing using Markdown or the visual editor
        `,
        ru: `
# Начало работы с Wiki.js

Добро пожаловать в Wiki.js! Это руководство поможет вам быстро начать работу.

## Установка

Для установки Wiki.js вам потребуется:
- Node.js 14.x или новее
- MongoDB 4.x или PostgreSQL 10.x или новее
- Git (опционально, для контроля версий)

## Базовая настройка

После установки вам нужно настроить:
1. Методы аутентификации
2. Права пользователей
3. Организацию контента

## Создание первой страницы

Чтобы создать новую страницу:
1. Нажмите кнопку "+" на боковой панели
2. Введите заголовок для вашей страницы
3. Выберите расположение в структуре вики
4. Начните писать, используя Markdown или визуальный редактор
        `,
      },
      updatedAt: "2023-04-10T09:15:00Z",
      updatedBy: "Mike Johnson",
      path: "/documentation/getting-started",
    },
  }

  // Versions for specific pages
  const versions = {
    "1": {
      id: "1",
      pageId: "installation-guide",
      date: "2023-04-12",
      user: "John Doe",
      description: "Updated server requirements section",
      content: {
        en: `
# Installation Guide

## System Requirements

- **CPU**: 2 cores (4 recommended)
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 20GB minimum
- **Operating System**: Ubuntu 20.04 LTS, CentOS 8, or Windows Server 2019

## Database Requirements

- PostgreSQL 12+ or MySQL 8+
- 2GB RAM dedicated to database

## Installation Steps

1. Download the installer package
2. Run the setup wizard
3. Configure your database connection
4. Set up administrator account
5. Complete the installation
        `,
        ru: `
# Руководство по установке

## Системные требования

- **Процессор**: 2 ядра (рекомендуется 4)
- **Оперативная память**: минимум 4 ГБ (рекомендуется 8 ГБ)
- **Дисковое пространство**: минимум 20 ГБ
- **Операционная система**: Ubuntu 20.04 LTS, CentOS 8 или Windows Server 2019

## Требования к базе данных

- PostgreSQL 12+ или MySQL 8+
- 2 ГБ оперативной памяти, выделенной для базы данных

## Шаги установки

1. Загрузите установочный пакет
2. Запустите мастер установки
3. Настройте подключение к базе данных
4. Настройте учетную запись администратора
5. Завершите установку
        `,
      },
    },
    "2": {
      id: "2",
      pageId: "api-documentation",
      date: "2023-04-11",
      user: "Jane Smith",
      description: "Added new endpoints for user management",
      content: {
        en: `
# API Documentation

## Authentication

All API requests require authentication using JWT tokens.

## Endpoints

### User Management

- GET /api/users - List all users
- GET /api/users/:id - Get user details
- POST /api/users - Create new user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

### Content Management

- GET /api/pages - List all pages
- GET /api/pages/:id - Get page details
- POST /api/pages - Create new page
- PUT /api/pages/:id - Update page
- DELETE /api/pages/:id - Delete page
        `,
        ru: `
# Документация API

## Аутентификация

Все запросы API требуют аутентификации с использованием JWT токенов.

## Конечные точки

### Управление пользователями

- GET /api/users - Список всех пользователей
- GET /api/users/:id - Получить детали пользователя
- POST /api/users - Создать нового пользователя
- PUT /api/users/:id - Обновить пользователя
- DELETE /api/users/:id - Удалить пользователя

### Управление контентом

- GET /api/pages - Список всех страниц
- GET /api/pages/:id - Получить детали страницы
- POST /api/pages - Создать новую страницу
- PUT /api/pages/:id - Обновить страницу
- DELETE /api/pages/:id - Удалить страницу
        `,
      },
    },
    "3": {
      id: "3",
      pageId: "getting-started",
      date: "2023-04-10",
      user: "Mike Johnson",
      description: "Fixed typos and clarified installation steps",
      content: {
        en: `
# Getting Started with Wiki.js

Welcome to Wiki.js! This guide will help you get up and running quickly.

## Installation

To install Wiki.js, you need:
- Node.js 14.x or later
- MongoDB 4.x or PostgreSQL 10.x or later
- Git (optional, for version control)

## Basic Configuration

After installation, you'll need to configure:
1. Authentication methods
2. User permissions
3. Content organization

## Creating Your First Page

To create a new page:
1. Click the "+" button in the sidebar
2. Enter a title for your page
3. Choose a location in your wiki structure
4. Start writing using Markdown or the visual editor
        `,
        ru: `
# Начало работы с Wiki.js

Добро пожаловать в Wiki.js! Это руководство поможет вам быстро начать работу.

## Установка

Для установки Wiki.js вам потребуется:
- Node.js 14.x или новее
- MongoDB 4.x или PostgreSQL 10.x или новее
- Git (опционально, для контроля версий)

## Базовая настройка

После установки вам нужно настроить:
1. Методы аутентификации
2. Права пользователей
3. Организацию контента

## Создание первой страницы

Чтобы создать новую страницу:
1. Нажмите кнопку "+" на боковой панели
2. Введите заголовок для вашей страницы
3. Выберите расположение в структуре вики
4. Начните писать, используя Markdown или визуальный редактор
        `,
      },
    },
  }

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleEdit = () => {
    router.push(`/editor?id=${pageId}`)
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? "This page has been removed from your favorites"
        : "This page has been added to your favorites",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Page link has been copied to clipboard",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Get the content based on version or current page
    let content = ""
    let title = ""

    if (versionId && versions[versionId as keyof typeof versions]) {
      const version = versions[versionId as keyof typeof versions]
      content = version.content[currentLanguage]
      title = pages[version.pageId as keyof typeof pages].title[currentLanguage]
    } else if (pages[pageId as keyof typeof pages]) {
      content = pages[pageId as keyof typeof pages].content[currentLanguage]
      title = pages[pageId as keyof typeof pages].title[currentLanguage]
    } else {
      toast({
        title: "Error",
        description: "Page not found",
        variant: "destructive",
      })
      return
    }

    // Create a blob with the content
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = `${title}.md`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: "The page is being downloaded as a Markdown file",
    })
  }

  // Get the page data or version data
  let pageData
  let isVersion = false

  if (versionId && versions[versionId as keyof typeof versions]) {
    const version = versions[versionId as keyof typeof versions]
    if (version.pageId === pageId) {
      pageData = {
        title: pages[pageId as keyof typeof pages].title,
        content: version.content,
        updatedAt: version.date,
        updatedBy: version.user,
        path: pages[pageId as keyof typeof pages].path,
      }
      isVersion = true
    } else {
      // Version doesn't match page ID
      pageData = pages[pageId as keyof typeof pages]
    }
  } else {
    pageData = pages[pageId as keyof typeof pages]
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <div className="text-4xl mb-4">404</div>
              <p className="text-gray-500 text-center mb-4">Page not found</p>
              <Button variant="outline" onClick={() => router.push("/pages")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pages
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const t = {
    en: {
      viewingVersion: "Viewing version from",
      currentVersion: "Current version",
      backToLatest: "Back to latest version",
      viewHistory: "View History",
    },
    ru: {
      viewingVersion: "Просмотр версии от",
      currentVersion: "Текущая версия",
      backToLatest: "Вернуться к последней версии",
      viewHistory: "Просмотр истории",
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-64" />
            ) : (
              <h1 className="text-2xl font-bold">{pageData.title[currentLanguage]}</h1>
            )}

            {isLoading ? (
              <Skeleton className="mt-1 h-4 w-48" />
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                <span>
                  {isVersion ? (
                    <>
                      {t[currentLanguage].viewingVersion} {new Date(pageData.updatedAt).toLocaleDateString()} (
                      {pageData.updatedBy})
                    </>
                  ) : (
                    <>
                      {currentLanguage === "en"
                        ? `Last updated on ${new Date(pageData.updatedAt).toLocaleDateString()} by ${pageData.updatedBy}`
                        : `Последнее обновление ${new Date(pageData.updatedAt).toLocaleDateString()} пользователем ${pageData.updatedBy}`}
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentLanguage(currentLanguage === "en" ? "ru" : "en")}
            >
              {currentLanguage === "en" ? "Русский" : "English"}
            </Button>

            {isVersion && (
              <Button variant="outline" size="sm" onClick={() => router.push(`/view/${pageId}`)}>
                {t[currentLanguage].backToLatest}
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={() => router.push(`/history`)}>
              <History className="mr-2 h-4 w-4" />
              {t[currentLanguage].viewHistory}
            </Button>

            {hasPermission("canEdit") && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                {currentLanguage === "en" ? "Edit" : "Редактировать"}
              </Button>
            )}

            <Button variant="outline" size="icon" onClick={handleToggleFavorite}>
              {isFavorite ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
            </Button>

            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="print:shadow-none print:border-none">
          <CardContent className="p-6 md:p-8">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-6 w-1/2 mt-6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(pageData.content[currentLanguage]) }} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Simple markdown renderer (in a real app, you would use a proper markdown library)
function renderMarkdown(markdown: string): string {
  // This is a very simplified markdown renderer
  // In a real app, you would use a library like marked or remark

  const html = markdown
    // Headers
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    // Bold
    .replace(/\*\*(.*)\*\*/gm, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*)\*/gm, "<em>$1</em>")
    // Lists
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/^\d\. (.*$)/gm, "<li>$1</li>")
    // Paragraphs
    .replace(/^(?!<h|<li|<ul|<ol|<p)(.*$)/gm, "<p>$1</p>")

  // Wrap lists
  let inList = false
  const lines = html.split("\n")
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("<li>") && !inList) {
      lines[i] = "<ul>" + lines[i]
      inList = true
    } else if (!lines[i].startsWith("<li>") && inList) {
      lines[i - 1] = lines[i - 1] + "</ul>"
      inList = false
    }
  }
  if (inList) {
    lines.push("</ul>")
  }

  return lines.join("\n")
}
