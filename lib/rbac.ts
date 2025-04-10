// Simple role-based access control system

export type Role = "viewer" | "editor" | "admin"

export interface UserPermissions {
  role: Role
  canView: boolean
  canEdit: boolean
  canDelete: boolean
  canManageUsers: boolean
}

// Map roles to permissions
const rolePermissions: Record<Role, Omit<UserPermissions, "role">> = {
  viewer: {
    canView: true,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
  },
  editor: {
    canView: true,
    canEdit: true,
    canDelete: false,
    canManageUsers: false,
  },
  admin: {
    canView: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: true,
  },
}

// In a real app, this would come from a database
// For demo purposes, we'll use a simple mapping of addresses to roles
const addressRoles: Record<string, Role> = {
  // Example addresses - in a real app, these would be actual user addresses
  "0x1234567890123456789012345678901234567890": "admin",
  "0x2345678901234567890123456789012345678901": "editor",
  // Default role for any other address
  default: "viewer",
}

// Get role for an address
export const getRoleForAddress = (address: string): Role => {
  return addressRoles[address.toLowerCase()] || addressRoles.default
}

// Get permissions for a role
export const getPermissionsForRole = (role: Role): UserPermissions => {
  return {
    role,
    ...rolePermissions[role],
  }
}

// Get permissions for an address
export const getPermissionsForAddress = (address: string): UserPermissions => {
  const role = getRoleForAddress(address)
  return getPermissionsForRole(role)
}

// Check if an address has a specific permission
export const hasPermission = (address: string, permission: keyof Omit<UserPermissions, "role">): boolean => {
  const permissions = getPermissionsForAddress(address)
  return permissions[permission]
}
