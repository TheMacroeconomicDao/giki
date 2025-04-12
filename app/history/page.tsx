"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, Clock, FileText, User, Filter, RefreshCcw } from "lucide-react"
import type { Language } from "@/lib/translation-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export default function HistoryPage() {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Translation objects
  const t = {
    en: {
      pageTitle: "Edit History",
      search: "Search history...",
      filter: "Filter",
      refresh: "Refresh",
      compare: "Compare Selected",
      date: "Date",
      page: "Page",
      user: "User",
      description: "Description",
      viewVersion: "View this version",
      restoreVersion: "Restore this version",
      compareVersions: "Compare versions",
      clearSelection: "Clear selection",
      selectedVersions: "Selected versions",
      noResults: "No history items found",
      noSelection: "Select two versions to compare",
    },
    ru: {
      pageTitle: "История изменений",
      search: "Поиск в истории...",
      filter: "Фильтр",
      refresh: "Обновить",
      compare: "Сравнить выбранные",
      date: "Дата",
      page: "Страница",
      user: "Пользователь",
      description: "Описание",
      viewVersion: "Просмотреть эту версию",
      restoreVersion: "Восстановить эту версию",
      compareVersions: "Сравнить версии",
      clearSelection: "Очистить выбор",
      selectedVersions: "Выбранные версии",
      noResults: "История изменений не найдена",
      noSelection: "Выберите две версии для сравнения",
    },
  }

  // Sample history data
  const historyItems = [
    {
      id: "1",
      date: "2023-04-12",
      page: "Installation Guide",
      pageId: "installation-guide",
      user: "John Doe",
      description: "Updated server requirements section",
    },
    {
      id: "2",
      date: "2023-04-11",
      page: "API Documentation",
      pageId: "api-documentation",
      user: "Jane Smith",
      description: "Added new endpoints for user management",
    },
    {
      id: "3",
      date: "2023-04-10",
      page: "Getting Started",
      pageId: "getting-started",
      user: "Mike Johnson",
      description: "Fixed typos and clarified installation steps",
    },
  ]

  // Filter history items based on search query
  const filteredItems = searchQuery
    ? historyItems.filter(
        (item) =>
          item.page.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : historyItems

  const toggleVersionSelection = (id: string) => {
    if (selectedVersions.includes(id)) {
      setSelectedVersions(selectedVersions.filter((v) => v !== id))
    } else {
      if (selectedVersions.length < 2) {
        setSelectedVersions([...selectedVersions, id])
      } else {
        // If already 2 selected, replace the oldest one
        setSelectedVersions([selectedVersions[1], id])
      }
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      router.push(`/compare/${selectedVersions[0]}/${selectedVersions[1]}`)
    }
  }

  const handleViewVersion = (id: string, pageId: string) => {
    router.push(`/view/${pageId}?version=${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t[currentLanguage].pageTitle}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t[currentLanguage].filter}
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {t[currentLanguage].refresh}
            </Button>
            <Button
              disabled={selectedVersions.length !== 2}
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleCompare}
            >
              {t[currentLanguage].compare}
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder={t[currentLanguage].search}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {selectedVersions.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="p-4">
              <CardTitle className="text-base font-medium">
                {t[currentLanguage].selectedVersions}: {selectedVersions.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <div>
                  {selectedVersions.length === 1 && (
                    <p className="text-sm text-gray-500">{t[currentLanguage].noSelection}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedVersions([])}>
                    {t[currentLanguage].clearSelection}
                  </Button>
                  {selectedVersions.length === 2 && (
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleCompare}>
                      {t[currentLanguage].compareVersions}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Card
                key={item.id}
                className={`transition-colors ${
                  selectedVersions.includes(item.id) ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedVersions.includes(item.id)}
                        onCheckedChange={() => toggleVersionSelection(item.id)}
                        id={`version-${item.id}`}
                        className="h-5 w-5"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 cursor-pointer" onClick={() => handleViewVersion(item.id, item.pageId)}>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium hover:text-emerald-600 hover:underline">{item.page}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.user}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewVersion(item.id, item.pageId)}
                        className="w-full md:w-auto"
                      >
                        {t[currentLanguage].viewVersion}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full md:w-auto text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                      >
                        {t[currentLanguage].restoreVersion}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-center">{t[currentLanguage].noResults}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
