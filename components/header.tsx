"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown, Menu, Moon, Search, Settings, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"
import { useWeb3 } from "@/hooks/use-web3"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { address, connect, disconnect, isConnected } = useWeb3()
  const { user, isAuthenticated, login, logout, isLoading } = useAuth()
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    // Set avatar URL from user data or localStorage
    if (user) {
      if (user.avatarUrl) {
        setAvatarUrl(user.avatarUrl)
      } else {
        const storedAvatarUrl = localStorage.getItem(`avatar_${user.id}`)
        if (storedAvatarUrl) {
          setAvatarUrl(storedAvatarUrl)
        }
      }
    } else {
      setAvatarUrl(null)
    }
  }, [user])

  const shortenAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ""
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleConnect = async () => {
    try {
      const connectedAddress = await connect()
      if (connectedAddress) {
        await login(connectedAddress)
      }
    } catch (error) {
      console.error("Connection error:", error)
    }
  }

  const handleDisconnect = async () => {
    try {
      disconnect()
      await logout()
    } catch (error) {
      console.error("Disconnect error:", error)
    }
  }

  return (
    <header className="border-b sticky top-0 z-30 bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 pt-10">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/" className="font-bold text-xl">
            Giki.js
          </Link>
        </div>

        <div className={`${searchOpen ? "flex" : "hidden md:flex"} flex-1 items-center mx-4`}>
          <form className="w-full" onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search pages..."
                className="w-full pl-8 md:w-[300px] lg:w-[400px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    {avatarUrl ? <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile" /> : null}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.slice(0, 2).toUpperCase() || address?.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-flex">{user?.name || shortenAddress(address || "")}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDisconnect}>Disconnect Wallet</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleConnect} disabled={isLoading}>
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
