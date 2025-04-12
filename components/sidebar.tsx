"use client"

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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { useState } from "react"
import type { Language } from "@/lib/translation-service"

interface SidebarProps {
  currentLanguage: Language
}

export function Sidebar({ currentLanguage }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    { path: "/users", label: t[currentLanguage].users, icon: Users },
    { path: "/settings", label: t[currentLanguage].settings, icon: Settings },
    { path: "/help", label: t[currentLanguage].help, icon: HelpCircle },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-10 hidden w-64 flex-col bg-white shadow-md transition-all dark:bg-gray-800 md:flex",
          isCollapsed && "w-20",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            {!isCollapsed && <span className="text-xl font-semibold">Wiki.js</span>}
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {!isCollapsed && (
            <div className="mb-4">
              <Input
                type="search"
                placeholder={t[currentLanguage].search}
                className="w-full"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
          )}
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.path
                    ? "bg-gray-100 text-emerald-600 dark:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                )}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}

            {!isCollapsed && <div className="my-3 h-px bg-gray-200 dark:bg-gray-700" />}

            {adminNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.path
                    ? "bg-gray-100 text-emerald-600 dark:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                )}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
        {!isCollapsed && (
          <div className="border-t p-4">
            <Link href="/editor">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                {currentLanguage === "en" ? "New Page" : "Новая страница"}
              </Button>
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile Menu Button */}
      <div className="fixed bottom-4 right-4 z-20 md:hidden">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          size="icon"
          className="h-12 w-12 rounded-full bg-emerald-600 shadow-lg"
        >
          <Menu className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Mobile Menu */}
      <Collapsible open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} className="md:hidden">
        <CollapsibleContent className="fixed inset-x-0 bottom-0 z-20 rounded-t-xl bg-white p-4 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Menu</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="sr-only">Close</span>
              &times;
            </Button>
          </div>
          <nav className="grid grid-cols-3 gap-2">
            {mainNavItems.slice(0, 6).map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="flex flex-col items-center rounded-md p-3 text-center hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="mb-1 h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-4">
            <Link href="/editor" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                {currentLanguage === "en" ? "New Page" : "Новая страница"}
              </Button>
            </Link>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}
