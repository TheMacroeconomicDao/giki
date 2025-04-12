"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SignInButton } from "@/components/sign-in-button"
import { LanguageSelector } from "@/components/language-selector"
import { Input } from "@/components/ui/input"
import { Search, Bell, HelpCircle, Menu } from "lucide-react"
import Link from "next/link"
import type { Language } from "@/lib/translation-service"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationsPanel } from "@/components/notifications-panel"
import { useAuth } from "@/components/auth-context"
import { UserRoleBadge } from "@/components/user-role-badge"

interface HeaderProps {
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
  onMenuClick: () => void
}

export function Header({ currentLanguage, onLanguageChange, onMenuClick }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { isAuthenticated } = useAuth()

  const searchPlaceholder = currentLanguage === "en" ? "Search wiki..." : "Поиск в вики..."

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800 md:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold">Wiki.js</span>
          </Link>
        </div>

        <div className="hidden md:block">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input type="search" placeholder={searchPlaceholder} className="w-full rounded-full pl-10 pr-4" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Mobile search button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSearch(!showSearch)}>
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications - only show if authenticated */}
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
        )}

        {/* Help */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{currentLanguage === "en" ? "Help & Support" : "Помощь & Поддержка"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/docs" className="flex w-full">
                {currentLanguage === "en" ? "Documentation" : "Документация"}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/faq" className="flex w-full">
                {currentLanguage === "en" ? "FAQ" : "Часто задаваемые вопросы"}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/support" className="flex w-full">
                {currentLanguage === "en" ? "Contact Support" : "Связаться с поддержкой"}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />

        <div className="hidden md:block">
          <SignInButton />
        </div>

        {isAuthenticated && (
          <div className="hidden md:block">
            <UserRoleBadge />
          </div>
        )}
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="absolute inset-x-0 top-16 z-20 border-b bg-white p-4 dark:bg-gray-800 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4"
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute right-0 top-16 z-20 w-80 md:right-4">
          <NotificationsPanel currentLanguage={currentLanguage} onClose={() => setShowNotifications(false)} />
        </div>
      )}
    </header>
  )
}
