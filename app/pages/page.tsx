"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, FolderOpen, MoreHorizontal, ArrowUpDown, Filter, RefreshCcw, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PermissionGate } from "@/components/permission-gate"
import type { Language } from "@/lib/translation-service"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function WikiPages() {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Translation objects
  const t = {
    en: {
      allPages: "All Pages",
      newPage: "New Page",
      search: "Search pages...",
      filter: "Filter",
      filterByFolder: "Filter by Folder",
      refresh: "Refresh",
      title: "Title",
      path: "Path",
      lastUpdated: "Last Updated",
      updatedBy: "Updated By",
      actions: {
        view: "View",
        edit: "Edit",
        move: "Move",
        delete: "Delete",
      },
    },
    ru: {
      allPages: "Все страницы",
      newPage: "Новая страница",
      search: "Поиск страниц...",
      filter: "Фильтр",
      filterByFolder: "Фильтр по папке",
      refresh: "Обновить",
      title: "Заголовок",
      path: "Путь",
      lastUpdated: "Последнее обновление",
      updatedBy: "Кем обновлено",
      actions: {
        view: "Просмотр",
        edit: "Редактировать",
        move: "Переместить",
        delete: "Удалить",
      },
    },
  }

  const pages = [
    {
      id: "installation-guide",
      title: "Installation Guide",
      path: "/documentation/installation",
      updatedAt: "2023-04-12T10:30:00Z",
      updatedBy: "John Doe",
    },
    {
      id: "api-documentation",
      title: "API Documentation",
      path: "/api/reference",
      updatedAt: "2023-04-11T14:45:00Z",
      updatedBy: "Jane Smith",
    },
    {
      id: "getting-started",
      title: "Getting Started",
      path: "/documentation/getting-started",
      updatedAt: "2023-04-10T09:15:00Z",
      updatedBy: "Mike Johnson",
    },
    {
      id: "user-management",
      title: "User Management",
      path: "/administration/users",
      updatedAt: "2023-04-09T16:20:00Z",
      updatedBy: "Sarah Williams",
    },
    {
      id: "configuration",
      title: "Configuration Options",
      path: "/administration/config",
      updatedAt: "2023-04-08T11:10:00Z",
      updatedBy: "David Brown",
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      path: "/support/troubleshooting",
      updatedAt: "2023-04-07T13:25:00Z",
      updatedBy: "Emily Davis",
    },
  ]

  // Filter pages based on search query
  const filteredPages = searchQuery
    ? pages.filter(
        (page) =>
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.updatedBy.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : pages

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleViewPage = (id: string) => {
    router.push(`/view/${id}`)
  }

  const handleEditPage = (id: string) => {
    router.push(`/editor?id=${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t[currentLanguage].allPages}</h1>
          <div className="flex items-center gap-4">
            <PermissionGate permission="canEdit">
              <Link href="/editor">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  {t[currentLanguage].newPage}
                </Button>
              </Link>
            </PermissionGate>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder={t[currentLanguage].search}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t[currentLanguage].filter}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              {t[currentLanguage].filterByFolder}
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {t[currentLanguage].refresh}
            </Button>
          </div>
        </div>

        <Card>
          <div className="rounded-md border-0 bg-white dark:bg-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">
                    <div className="flex items-center">
                      {t[currentLanguage].title}
                      <Button variant="ghost" size="icon" className="ml-2">
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      {t[currentLanguage].path}
                      <Button variant="ghost" size="icon" className="ml-2">
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      {t[currentLanguage].lastUpdated}
                      <Button variant="ghost" size="icon" className="ml-2">
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead>{t[currentLanguage].updatedBy}</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.length > 0 ? (
                  filteredPages.map((page) => (
                    <TableRow key={page.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <TableCell className="font-medium" onClick={() => handleViewPage(page.id)}>
                        <span className="hover:text-emerald-600">{page.title}</span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500" onClick={() => handleViewPage(page.id)}>
                        {page.path}
                      </TableCell>
                      <TableCell className="text-sm" onClick={() => handleViewPage(page.id)}>
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm" onClick={() => handleViewPage(page.id)}>
                        {page.updatedBy}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <PermissionGate permission="canView">
                              <DropdownMenuItem onClick={() => handleViewPage(page.id)}>
                                {t[currentLanguage].actions.view}
                              </DropdownMenuItem>
                            </PermissionGate>

                            <PermissionGate permission="canEdit">
                              <DropdownMenuItem onClick={() => handleEditPage(page.id)}>
                                {t[currentLanguage].actions.edit}
                              </DropdownMenuItem>
                              <DropdownMenuItem>{t[currentLanguage].actions.move}</DropdownMenuItem>
                            </PermissionGate>

                            <PermissionGate permission="canDelete">
                              <DropdownMenuItem className="text-red-600">
                                {t[currentLanguage].actions.delete}
                              </DropdownMenuItem>
                            </PermissionGate>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {searchQuery ? (
                        <div className="flex flex-col items-center justify-center">
                          <Search className="mb-2 h-8 w-8 text-gray-400" />
                          <p className="text-gray-500">
                            {currentLanguage === "en"
                              ? `No results found for "${searchQuery}"`
                              : `Результаты не найдены для "${searchQuery}"`}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="mb-2 h-8 w-8 text-gray-400" />
                          <p className="text-gray-500">
                            {currentLanguage === "en" ? "No pages found" : "Страницы не найдены"}
                          </p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
