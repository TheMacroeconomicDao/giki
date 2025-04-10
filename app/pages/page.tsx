import Link from "next/link"
import { Search, Plus, FileText, FolderOpen, MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { SignInButton } from "@/components/sign-in-button"
import { PermissionGate } from "@/components/permission-gate"

export default function WikiPages() {
  const pages = [
    {
      id: 1,
      title: "Getting Started",
      path: "/documentation/getting-started",
      updatedAt: "2023-09-15T10:30:00Z",
      updatedBy: "John Doe",
    },
    {
      id: 2,
      title: "Installation Guide",
      path: "/documentation/installation",
      updatedAt: "2023-09-14T14:45:00Z",
      updatedBy: "Jane Smith",
    },
    {
      id: 3,
      title: "API Reference",
      path: "/api/reference",
      updatedAt: "2023-09-13T09:15:00Z",
      updatedBy: "Mike Johnson",
    },
    {
      id: 4,
      title: "User Management",
      path: "/administration/users",
      updatedAt: "2023-09-12T16:20:00Z",
      updatedBy: "Sarah Williams",
    },
    {
      id: 5,
      title: "Configuration Options",
      path: "/administration/config",
      updatedAt: "2023-09-11T11:10:00Z",
      updatedBy: "David Brown",
    },
    {
      id: 6,
      title: "Troubleshooting",
      path: "/support/troubleshooting",
      updatedAt: "2023-09-10T13:25:00Z",
      updatedBy: "Emily Davis",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - This would be a shared component in a real app */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-semibold">Wiki.js</span>
          </Link>
        </div>
        <nav className="p-4">{/* Sidebar content would go here */}</nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">All Pages</h1>
            <div className="flex items-center gap-4">
              <SignInButton />
              <WalletConnectButton />

              <PermissionGate permission="canEdit">
                <Link href="/editor">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" />
                    New Page
                  </Button>
                </Link>
              </PermissionGate>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input type="search" placeholder="Search pages..." className="pl-10" />
            </div>
            <Button variant="outline">
              <FolderOpen className="mr-2 h-4 w-4" />
              Filter by Folder
            </Button>
          </div>

          <div className="rounded-md border bg-white dark:bg-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">
                    <div className="flex items-center">
                      Title
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Path
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Last Updated
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Updated By</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">
                      <Link href="/editor" className="hover:text-emerald-600">
                        {page.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{page.path}</TableCell>
                    <TableCell className="text-sm">{new Date(page.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-sm">{page.updatedBy}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <PermissionGate permission="canView">
                            <DropdownMenuItem>View</DropdownMenuItem>
                          </PermissionGate>

                          <PermissionGate permission="canEdit">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Move</DropdownMenuItem>
                          </PermissionGate>

                          <PermissionGate permission="canDelete">
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </PermissionGate>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}
