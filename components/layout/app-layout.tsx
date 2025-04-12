"use client"

import type React from "react"
import { useState } from "react"
import type { Language } from "@/lib/translation-service"
import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")
  const { hasPermission } = useAuth()

  // Check if user has admin permissions
  const isAdmin = hasPermission("canManageUsers")

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800 md:px-6">
        <div className="flex items-center">
          <span className="text-xl font-semibold">Giki.js</span>
        </div>

        {/* Add admin button if user has permissions */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/admin">
                <Shield className="h-4 w-4" />
                <span>{currentLanguage === "en" ? "Admin Panel" : "Панель администратора"}</span>
              </Link>
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
