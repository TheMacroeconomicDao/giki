"use client"

import { useAuth } from "@/components/auth-context"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"

export function UserRoleBadge() {
  const { permissions, isAuthenticated } = useAuth()

  if (!isAuthenticated || !permissions) {
    return null
  }

  const roleColors = {
    admin: "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300",
    editor: "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
    viewer: "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300",
  }

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${roleColors[permissions.role]}`}>
      <Shield className="h-3 w-3" />
      {permissions.role.charAt(0).toUpperCase() + permissions.role.slice(1)}
    </Badge>
  )
}
