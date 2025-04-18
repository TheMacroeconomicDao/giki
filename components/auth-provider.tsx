"use client"

import type React from "react"
import { createContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface UserPreferences {
  language: string
  theme: string
  emailNotifications: boolean
}

interface User {
  id: string
  address: string
  name: string | null
  email: string | null
  role: "admin" | "editor" | "viewer"
  preferences?: UserPreferences
}

interface Session {
  id: string
  userAgent: string
  ip: string
  createdAt: string
  lastActive: string
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (address: string, signature?: string, message?: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => Promise<void>
  refreshToken: () => Promise<boolean>
  sessions: Session[]
  fetchSessions: () => Promise<void>
  terminateSession: (sessionId: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  updateUser: async () => {},
  refreshToken: async () => false,
  sessions: [],
  fetchSessions: async () => {},
  terminateSession: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessions, setSessions] = useState<Session[]>([])
  const { toast } = useToast()
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get the current user
        const response = await fetch("/api/auth/me")

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Set up token refresh interval
  useEffect(() => {
    if (!user) return

    // Refresh token every 10 minutes
    const interval = setInterval(
      () => {
        refreshToken()
      },
      10 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [user])

  const login = async (address: string, signature?: string, message?: string) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, signature, message }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      setUser(data.user)

      toast({
        title: "Login successful",
        description: "You are now logged in",
      })

      return data.user
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setUser(null)
      setSessions([])

      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      })

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      })

      return response.ok
    } catch (error) {
      console.error("Token refresh error:", error)
      return false
    }
  }

  const updateUser = async (updatedUser: Partial<User>) => {
    if (!user) return

    try {
      // Instead of using the /api/users/${user.id} endpoint, let's use a more direct approach
      // for profile updates to avoid potential routing issues
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })

      if (!response.ok) {
        // Check if the response is JSON or HTML
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update user")
        } else {
          throw new Error(`Failed to update user: ${response.status} ${response.statusText}`)
        }
      }

      const data = await response.json()

      if (data.user) {
        setUser({ ...user, ...data.user })
      } else if (data.data && data.data.user) {
        setUser({ ...user, ...data.data.user })
      } else {
        // Just update with what we have
        setUser({ ...user, ...updatedUser })
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("Update user error:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchSessions = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/auth/session")

      if (!response.ok) {
        throw new Error("Failed to fetch sessions")
      }

      const data = await response.json()
      setSessions(data.sessions)
    } catch (error) {
      console.error("Fetch sessions error:", error)
      toast({
        title: "Error",
        description: "Failed to fetch active sessions",
        variant: "destructive",
      })
    }
  }

  const terminateSession = async (sessionId: string) => {
    if (!user) return

    try {
      const response = await fetch("/api/auth/session", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      })

      if (!response.ok) {
        throw new Error("Failed to terminate session")
      }

      // Update sessions list
      setSessions(sessions.filter((session) => session.id !== sessionId))

      toast({
        title: "Session terminated",
        description: "The session has been terminated successfully",
      })
    } catch (error) {
      console.error("Terminate session error:", error)
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        refreshToken,
        sessions,
        fetchSessions,
        terminateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
