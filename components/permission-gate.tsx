"use client"

import type React from "react"
import { useAuth } from "@/components/auth-context"
import type { UserPermissions } from "@/components/auth-context"

interface PermissionGateProps {
  permission: keyof Omit<UserPermissions, "role">
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGate({ permission, fallback = null, children }: PermissionGateProps) {
  const { hasPermission, isAuthenticated } = useAuth()

  // User must be authenticated and have the required permission
  if (isAuthenticated && hasPermission(permission)) {
    return <>{children}</>
  }

  // Return fallback if provided
  return <>{fallback}</>
}
