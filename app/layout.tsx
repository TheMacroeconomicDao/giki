import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { Web3Provider } from "@/components/web3-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import Header from "@/components/header"

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Web3Provider>
            <AuthProvider>
              <ErrorBoundary>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                </div>
                <Toaster />
              </ErrorBoundary>
            </AuthProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
