"use client"

import { Shield, Settings, Users, FileText, Database, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"

export function AdminButton({ variant = "default" }: { variant?: "default" | "large" | "hero" }) {
  const { hasPermission } = useAuth()

  // If user doesn't have admin permissions, don't render anything
  if (!hasPermission("canManageUsers")) {
    return null
  }

  // Render different button styles based on variant
  if (variant === "large") {
    return (
      <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 h-auto">
        <Link href="/admin">
          <Shield className="mr-2 h-5 w-5" />
          Admin Panel
        </Link>
      </Button>
    )
  }

  if (variant === "hero") {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/30 dark:bg-amber-900/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-800/30">
            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-500">Admin Access</h3>
            <p className="text-sm text-amber-600 dark:text-amber-400">You have administrator privileges</p>
          </div>
        </div>
        <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
          <Link href="/admin">Go to Admin Panel</Link>
        </Button>
      </div>
    )
  }

  // Default variant - dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Shield className="mr-2 h-4 w-4" />
          Admin
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Admin Controls</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin">
            <Shield className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/content/pages">
            <FileText className="mr-2 h-4 w-4" />
            Manage Pages
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/users/list">
            <Users className="mr-2 h-4 w-4" />
            Manage Users
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/system/general">
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/storage">
            <Database className="mr-2 h-4 w-4" />
            Storage
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
