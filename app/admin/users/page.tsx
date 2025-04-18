"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Edit, MoreHorizontal, Plus, Search, Trash, UserPlus } from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface User {
  id: string
  address: string
  name: string | null
  email: string | null
  role: "admin" | "editor" | "viewer"
  createdAt: string
  updatedAt: string
  lastLogin: string | null
}

export default function AdminUsersPage() {
  const { toast } = useToast()
  const { user: currentUser, isAuthenticated } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    address: "",
    name: "",
    email: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })

  useEffect(() => {
    // Check if user is admin
    if (isAuthenticated && currentUser?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    fetchUsers()
  }, [isAuthenticated, currentUser, router, toast])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // In a real app, this would be an API call
      // const response = await fetch("/api/users")
      // const data = await response.json()

      // Mock data for demonstration
      const mockUsers: User[] = [
        {
          id: "1",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          name: "Admin User",
          email: "admin@giki.js",
          role: "admin",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          lastLogin: new Date().toISOString(),
        },
        {
          id: "2",
          address: "0xabcdef1234567890abcdef1234567890abcdef12",
          name: "Editor User",
          email: "editor@giki.js",
          role: "editor",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          lastLogin: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        },
        {
          id: "3",
          address: "0x7890abcdef1234567890abcdef1234567890abcd",
          name: "Viewer User",
          email: "viewer@giki.js",
          role: "viewer",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        },
        {
          id: "4",
          address: "0x567890abcdef1234567890abcdef1234567890ab",
          name: null,
          email: null,
          role: "viewer",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
          lastLogin: null,
        },
      ]

      setUsers(mockUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async () => {
    try {
      if (!newUser.address) {
        toast({
          title: "Error",
          description: "Wallet address is required",
          variant: "destructive",
        })
        return
      }

      // In a real app, this would be an API call
      // const response = await fetch("/api/users", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(newUser),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add the new user to the list
      const createdUser: User = {
        id: String(users.length + 1),
        ...newUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null,
      }

      setUsers([...users, createdUser])
      setIsAddUserDialogOpen(false)
      setNewUser({
        address: "",
        name: "",
        email: "",
        role: "viewer",
      })

      toast({
        title: "User added",
        description: "The user has been added successfully",
      })
    } catch (error) {
      console.error("Error adding user:", error)
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/users/${userId}`, {
      //   method: "DELETE",
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove the user from the list
      setUsers(users.filter((user) => user.id !== userId))

      toast({
        title: "User deleted",
        description: "The user has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.address.toLowerCase().includes(searchLower) ||
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      user.role.toLowerCase().includes(searchLower)
    )
  })

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "editor":
        return "secondary"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Add a new user to the platform.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="wallet-address">Wallet Address</Label>
                <Input
                  id="wallet-address"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  placeholder="0x..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="User Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "editor" | "viewer" })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage users and their permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="text-xs">
                              {user.name ? user.name.slice(0, 2).toUpperCase() : user.address.slice(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name || "Unnamed User"}</div>
                            <div className="text-sm text-muted-foreground">{user.email || "No email"}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {user.address.slice(0, 6)}...{user.address.slice(-4)}
                      </TableCell>
                      <TableCell>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        {user.lastLogin ? format(new Date(user.lastLogin), "MMM d, yyyy") : "Never"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.id === currentUser?.id}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
