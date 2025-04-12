"use client"

import type React from "react"
import { useState } from "react"
import type { Language } from "@/lib/translation-service"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800 md:px-6">
        <div className="flex items-center">
          <span className="text-xl font-semibold">Wiki.js</span>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
