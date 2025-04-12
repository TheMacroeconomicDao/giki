"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FileText,
  Folder,
  Star,
  Clock,
  Users,
  Settings,
  Search,
  PlusCircle,
  Tag,
  BookOpen,
  HelpCircle,
  Menu,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Language } from "@/lib/translation-service"
import { useAuth } from "@/components/auth-context"

interface SidebarProps {
  currentLanguage: Language
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ currentLanguage, isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { hasPermission } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const t = {
    en: {
      search: "Search...",
      home: "Home",
      pages: "Pages",
      recentChanges: "Recent Changes",
      folders: "Folders",
      tags: "Tags",
      favorites: "Favorites",
      history: "History",
      users: "Users",
      settings: "Settings",
      help: "Help & Support",
      newPage: "New Page",
    },
    ru: {
      search: "Поиск...",
      home: "Главная",
      pages: "Страницы",
      recentChanges: "Недавние изменения",
      folders: "Папки",
      tags: "Теги",
      favorites: "Избранное",
      history: "История",
      users: "Пользователи",
      settings: "Настройки",
      help: "Помощь & Поддержка",
      newPage: "Новая страница",
    },
  }

  const mainNavItems = [
    { path: "/", label: t[currentLanguage].home, icon: Home },
    { path: "/pages", label: t[currentLanguage].pages, icon: FileText },
    { path: "/recent", label: t[currentLanguage].recentChanges, icon: Clock },
    { path: "/folders", label: t[currentLanguage].folders, icon: Folder },
    { path: "/tags", label: t[currentLanguage].tags, icon: Tag },
    { path: "/favorites", label: t[currentLanguage].favorites, icon: Star },
    { path: "/history", label: t[currentLanguage].history, icon: Clock },
  ]

  const adminNavItems = [
    { path: "/users", label: t[currentLanguage].users, icon: Users, permission: "canManageUsers" as const },
    { path: "/settings", label: t[currentLanguage].settings, icon: Settings, permission: "canManageUsers" as const },
    { path: "/help", label: t[currentLanguage].help, icon: HelpCircle },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={onToggle} aria-hidden="true" />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-white shadow-md transition-all dark:bg-gray-800",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            {isOpen && <span className="text-xl font-semibold">Wiki.js</span>}
          </Link>
          <Button variant="ghost" size="icon" onClick={onToggle} className="hidden md:flex">
            {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggle} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            {isOpen && (
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder={t[currentLanguage].search}
                  className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            )}

            {!isOpen && (
              <Button variant="ghost" size="icon" className="mb-4 w-full" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}

            <TooltipProvider>
              <nav className="space-y-1">
                {mainNavItems.map((item) => (
                  <Tooltip key={item.path} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.path}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          pathname === item.path
                            ? "bg-gray-100 text-emerald-600 dark:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                          !isOpen && "justify-center px-0",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {isOpen && <span>{item.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {!isOpen && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                ))}

                <div className="my-3 h-px bg-gray-200 dark:bg-gray-700" />

                {adminNavItems.map((item) => {
                  // Skip rendering if permission is required but not granted
                  if (item.permission && !hasPermission(item.permission)) {
                    return null
                  }

                  return (
                    <Tooltip key={item.path} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.path}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            pathname === item.path
                              ? "bg-gray-100 text-emerald-600 dark:bg-gray-700"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                            !isOpen && "justify-center px-0",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {isOpen && <span>{item.label}</span>}
                        </Link>
                      </TooltipTrigger>
                      {!isOpen && <TooltipContent side="right">{item.label}</TooltipContent>}
                    </Tooltip>
                  )
                })}
              </nav>
            </TooltipProvider>
          </div>
        </ScrollArea>

        {hasPermission("canEdit") && (
          <div className="border-t p-4">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link href="/editor">
                    <Button
                      className={cn("bg-emerald-600 hover:bg-emerald-700", isOpen ? "w-full" : "w-full p-0 h-10")}
                    >
                      <PlusCircle className={cn("h-5 w-5", isOpen && "mr-2")} />
                      {isOpen && <span>{currentLanguage === "en" ? "New Page" : "Новая страница"}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right">
                    {currentLanguage === "en" ? "New Page" : "Новая страница"}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </aside>
    </>
  )
}
