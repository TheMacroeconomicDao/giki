"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, User, Clock } from "lucide-react"
import type { Language } from "@/lib/translation-service"

export default function CompareVersionsPage() {
  const params = useParams()
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")

  const versionA = params.versionA as string
  const versionB = params.versionB as string

  // Translation objects
  const t = {
    en: {
      pageTitle: "Compare Versions",
      version: "Version",
      date: "Date",
      user: "User",
      changes: "Changes",
      additions: "Additions",
      deletions: "Deletions",
      unchanged: "Unchanged",
      backToHistory: "Back to History",
      restoreVersion: "Restore This Version",
      viewFullVersion: "View Full Version",
    },
    ru: {
      pageTitle: "Сравнение версий",
      version: "Версия",
      date: "Дата",
      user: "Пользователь",
      changes: "Изменения",
      additions: "Добавления",
      deletions: "Удаления",
      unchanged: "Без изменений",
      backToHistory: "Назад к истории",
      restoreVersion: "Восстановить эту версию",
      viewFullVersion: "Просмотреть полную версию",
    },
  }

  // Mock version data
  const versions = {
    "1": {
      id: "1",
      date: "2023-04-12",
      page: "Installation Guide",
      pageId: "installation-guide",
      user: "John Doe",
      description: "Updated server requirements section",
      content: `
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
    },
    "2": {
      id: "2",
      date: "2023-04-11",
      page: "API Documentation",
      pageId: "api-documentation",
      user: "Jane Smith",
      description: "Added new endpoints for user management",
      content: `
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
    },
    "3": {
      id: "3",
      date: "2023-04-10",
      page: "Getting Started",
      pageId: "getting-started",
      user: "Mike Johnson",
      description: "Fixed typos and clarified installation steps",
      content: `
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
    },
  }

  const versionAData = versions[versionA as keyof typeof versions]
  const versionBData = versions[versionB as keyof typeof versions]

  // Simple diff highlighting (in a real app, you would use a proper diff library)
  const highlightDiff = (textA: string, textB: string) => {
    const linesA = textA.split("\n")
    const linesB = textB.split("\n")

    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
          <div className="prose dark:prose-invert max-w-none">
            {linesA.map((line, index) => {
              const isInB = linesB.includes(line)
              return (
                <div
                  key={`a-${index}`}
                  className={`${isInB ? "" : "bg-red-100 dark:bg-red-900/20"} -mx-4 px-4`}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(line) }}
                />
              )
            })}
          </div>
        </div>
        <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
          <div className="prose dark:prose-invert max-w-none">
            {linesB.map((line, index) => {
              const isInA = linesA.includes(line)
              return (
                <div
                  key={`b-${index}`}
                  className={`${isInA ? "" : "bg-green-100 dark:bg-green-900/20"} -mx-4 px-4`}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(line) }}
                />
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (!versionAData || !versionBData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">Version not found</p>
              <Button variant="outline" className="mt-4" onClick={() => router.push("/history")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t[currentLanguage].backToHistory}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t[currentLanguage].pageTitle}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {versionAData.page} - {versionBData.page}
            </p>
          </div>
          <div>
            <Button variant="outline" onClick={() => router.push("/history")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t[currentLanguage].backToHistory}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t[currentLanguage].version} A</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{versionAData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{versionAData.user}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{versionAData.description}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/view/${versionAData.pageId}?version=${versionAData.id}`)}
                >
                  {t[currentLanguage].viewFullVersion}
                </Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  {t[currentLanguage].restoreVersion}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t[currentLanguage].version} B</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{versionBData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{versionBData.user}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{versionBData.description}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/view/${versionBData.pageId}?version=${versionBData.id}`)}
                >
                  {t[currentLanguage].viewFullVersion}
                </Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  {t[currentLanguage].restoreVersion}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t[currentLanguage].changes}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-red-100 dark:bg-red-900/20 rounded"></div>
                <span className="text-sm">{t[currentLanguage].deletions}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-green-100 dark:bg-green-900/20 rounded"></div>
                <span className="text-sm">{t[currentLanguage].additions}</span>
              </div>
            </div>

            {highlightDiff(versionAData.content, versionBData.content)}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Simple markdown renderer
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

  return html
}
