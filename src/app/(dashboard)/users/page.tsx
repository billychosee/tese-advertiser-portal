"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Icons } from "@/components/ui/Icons";
import { usersApi, rolesApi } from "@/services/api";
import { formatDateTime, cn } from "@/utils";
import { AdvertiserUser, UserRole, Permission, Role, DEFAULT_PERMISSIONS } from "@/types";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdvertiserUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdvertiserUser | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer" as UserRole,
  });
  const [roleFormData, setRoleFormData] = useState({
    name: "",
    description: "",
    permissions: {
      canCreateCampaigns: false,
      canAccessWallet: false,
      canViewReports: true,
      canManageUsers: false,
      canEditSettings: false,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    const data = await usersApi.getAll();
    setUsers(data);
  };

  const loadRoles = async () => {
    const data = await rolesApi.getAll();
    setRoles(data);
  };

  const handleOpenUserModal = (user?: AdvertiserUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        role: "viewer",
      });
    }
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "viewer" });
  };

  const handleOpenRoleModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setRoleFormData({
        name: role.name,
        description: role.description || "",
        permissions: { ...role.permissions },
      });
    } else {
      setEditingRole(null);
      setRoleFormData({
        name: "",
        description: "",
        permissions: {
          canCreateCampaigns: false,
          canAccessWallet: false,
          canViewReports: true,
          canManageUsers: false,
          canEditSettings: false,
        },
      });
    }
    setIsRoleModalOpen(true);
  };

  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false);
    setEditingRole(null);
    setRoleFormData({
      name: "",
      description: "",
      permissions: {
        canCreateCampaigns: false,
        canAccessWallet: false,
        canViewReports: true,
        canManageUsers: false,
        canEditSettings: false,
      },
    });
  };

  const handleSubmitUser = async () => {
    setIsLoading(true);
    try {
      if (editingUser) {
        await usersApi.update(editingUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          permissions: DEFAULT_PERMISSIONS[formData.role] || DEFAULT_PERMISSIONS.custom,
        });
      } else {
        await usersApi.create({
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });
      }
      await loadUsers();
      handleCloseUserModal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRole = async () => {
    setIsLoading(true);
    try {
      if (editingRole) {
        await rolesApi.update(editingRole.id, {
          name: roleFormData.name,
          description: roleFormData.description,
          permissions: roleFormData.permissions,
        });
      } else {
        await rolesApi.create({
          name: roleFormData.name,
          description: roleFormData.description,
          permissions: roleFormData.permissions,
        });
      }
      await loadRoles();
      handleCloseRoleModal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (user: AdvertiserUser) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      await usersApi.delete(user.id);
      await loadUsers();
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.isSystem) {
      alert("System roles cannot be deleted");
      return;
    }
    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      await rolesApi.delete(role.id);
      await loadRoles();
    }
  };

  const getRoleBadgeVariant = (
    role: string,
  ): "default" | "success" | "warning" | "error" | "info" | "brand" => {
    switch (role) {
      case "owner":
        return "brand";
      case "manager":
        return "info";
      case "viewer":
        return "default";
      default:
        return "warning";
    }
  };

  return (
    <DashboardLayout title="Users Roles and Permission">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage your advertising team and roles
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<Icons.Shield size={18} />}
            onClick={() => handleOpenRoleModal()}
          >
            Add Role
          </Button>
          <Button
            leftIcon={<Icons.Plus size={18} />}
            onClick={() => handleOpenUserModal()}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card padding="sm" className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-secondary">
                <Icons.Users size={14} className="text-foreground" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">Total</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{users.length}</p>
          <p className="text-xs text-muted-foreground">Users</p>
        </Card>
        <Card padding="sm" className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
                <Icons.Crown
                  size={14}
                  className="text-emerald-500 dark:text-emerald-400"
                />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Owners
              </p>
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
            {users.filter((u) => u.role === "owner").length}
          </p>
        </Card>
        <Card padding="sm" className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20">
                <Icons.Settings
                  size={14}
                  className="text-amber-500 dark:text-amber-400"
                />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Managers
              </p>
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">
            {users.filter((u) => u.role === "manager").length}
          </p>
        </Card>
        <Card padding="sm" className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-red-500/10 dark:bg-red-500/20">
                <Icons.Eye
                  size={14}
                  className="text-red-500 dark:text-red-400"
                />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Viewers
              </p>
            </div>
          </div>
          <p className="text-2xl font-bold text-red-500 dark:text-red-400">
            {users.filter((u) => u.role === "viewer").length}
          </p>
        </Card>
      </div>

      {/* Users List - Mobile */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => (
          <Card
            key={user.id}
            padding="md"
            className="hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-secondary-foreground">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Badge variant={user.isActive ? "success" : "error"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {user.role}
              </Badge>
              <div className="flex gap-1">
                <button
                  onClick={() => handleOpenUserModal(user)}
                  className="p-1.5 text-muted-foreground hover:text-foreground"
                >
                  <Icons.Edit size={16} />
                </button>
                {user.role !== "owner" && (
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="p-1.5 text-muted-foreground hover:text-destructive"
                  >
                    <Icons.Trash size={16} />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Last login:{" "}
                {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "Never"}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Users Table - Desktop */}
      <Card className="hidden lg:block mb-6">
        <Card.Header title="Users" subtitle="Team members with their roles" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Last Login
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border hover:bg-secondary"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-secondary-foreground">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={user.isActive ? "success" : "error"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    {user.lastLoginAt
                      ? formatDateTime(user.lastLoginAt)
                      : "Never"}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenUserModal(user)}
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Icons.Edit size={16} />
                      </button>
                      {user.role !== "owner" && (
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 text-muted-foreground hover:text-destructive"
                        >
                          <Icons.Trash size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Roles and Permissions */}
      <Card className="mt-6">
        <Card.Header
          title="Roles and Permissions"
          subtitle="Define roles and their access levels"
          action={
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Icons.Plus size={16} />}
              onClick={() => handleOpenRoleModal()}
            >
              Add Role
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Create Campaigns
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Access Wallet
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  View Reports
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Manage Users
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Edit Settings
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr
                  key={role.id}
                  className="border-b border-border hover:bg-secondary"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={getRoleBadgeVariant(role.name)}>
                        {role.name}
                      </Badge>
                      {role.isSystem && (
                        <Badge variant="default" size="sm">
                          System
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground text-sm">
                    {role.description || "-"}
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center justify-center w-5 h-5">
                      {role.permissions.canCreateCampaigns ? (
                        <Icons.Check size={18} className="text-green-500" />
                      ) : (
                        <Icons.Minus size={18} className="text-muted-foreground" />
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center justify-center w-5 h-5">
                      {role.permissions.canAccessWallet ? (
                        <Icons.Check size={18} className="text-green-500" />
                      ) : (
                        <Icons.Minus size={18} className="text-muted-foreground" />
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center justify-center w-5 h-5">
                      {role.permissions.canViewReports ? (
                        <Icons.Check size={18} className="text-green-500" />
                      ) : (
                        <Icons.Minus size={18} className="text-muted-foreground" />
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center justify-center w-5 h-5">
                      {role.permissions.canManageUsers ? (
                        <Icons.Check size={18} className="text-green-500" />
                      ) : (
                        <Icons.Minus size={18} className="text-muted-foreground" />
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center justify-center w-5 h-5">
                      {role.permissions.canEditSettings ? (
                        <Icons.Check size={18} className="text-green-500" />
                      ) : (
                        <Icons.Minus size={18} className="text-muted-foreground" />
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenRoleModal(role)}
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Icons.Edit size={16} />
                      </button>
                      {!role.isSystem && (
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="p-1.5 text-muted-foreground hover:text-destructive"
                        >
                          <Icons.Trash size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        title={editingUser ? "Edit User" : "Add New User"}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter email address"
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role
            </label>
            <div className="relative">
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as UserRole })
                }
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground appearance-none cursor-pointer"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.name} className="py-2 rounded-lg bg-background">
                    {role.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                <Icons.ChevronDown size={16} />
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCloseUserModal}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmitUser}
              isLoading={isLoading}
            >
              {editingUser ? "Save Changes" : "Add User"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add/Edit Role Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={handleCloseRoleModal}
        title={editingRole ? "Edit Role" : "Add New Role"}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Role Name"
            value={roleFormData.name}
            onChange={(e) =>
              setRoleFormData({ ...roleFormData, name: e.target.value })
            }
            placeholder="Enter role name"
            disabled={editingRole?.isSystem}
          />
          <Input
            label="Description"
            value={roleFormData.description}
            onChange={(e) =>
              setRoleFormData({ ...roleFormData, description: e.target.value })
            }
            placeholder="Enter role description"
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Permissions
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={roleFormData.permissions.canCreateCampaigns}
                  onChange={(e) =>
                    setRoleFormData({
                      ...roleFormData,
                      permissions: {
                        ...roleFormData.permissions,
                        canCreateCampaigns: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary"
                />
                <span className="text-sm">Create Campaigns</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={roleFormData.permissions.canAccessWallet}
                  onChange={(e) =>
                    setRoleFormData({
                      ...roleFormData,
                      permissions: {
                        ...roleFormData.permissions,
                        canAccessWallet: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary"
                />
                <span className="text-sm">Access Wallet</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={roleFormData.permissions.canViewReports}
                  onChange={(e) =>
                    setRoleFormData({
                      ...roleFormData,
                      permissions: {
                        ...roleFormData.permissions,
                        canViewReports: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary"
                />
                <span className="text-sm">View Reports</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={roleFormData.permissions.canManageUsers}
                  onChange={(e) =>
                    setRoleFormData({
                      ...roleFormData,
                      permissions: {
                        ...roleFormData.permissions,
                        canManageUsers: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary"
                />
                <span className="text-sm">Manage Users</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={roleFormData.permissions.canEditSettings}
                  onChange={(e) =>
                    setRoleFormData({
                      ...roleFormData,
                      permissions: {
                        ...roleFormData.permissions,
                        canEditSettings: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary"
                />
                <span className="text-sm">Edit Settings</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCloseRoleModal}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmitRole}
              isLoading={isLoading}
            >
              {editingRole ? "Save Changes" : "Create Role"}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default UsersPage;
