import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/shared/ui/toaster"
import { ErrorBoundary } from "@/shared/ui/error-boundary"
import { Header } from "@/widgets/header"
import { AppProvider } from "@/app/providers"

// Update the import path to match the new location
import "./_init"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Giki.js",
  description: "Next-Generation Wiki Platform",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>
          <ErrorBoundary>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </ErrorBoundary>
        </AppProvider>
      </body>
    </html>
  )
}
