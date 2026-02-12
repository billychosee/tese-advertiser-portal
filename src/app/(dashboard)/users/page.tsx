"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Icons } from "@/components/ui/Icons";
import { usersApi } from "@/services/api";
import { formatDateTime, cn } from "@/utils";
import { AdvertiserUser, UserRole, DEFAULT_PERMISSIONS } from "@/types";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdvertiserUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdvertiserUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer" as UserRole,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await usersApi.getAll();
    setUsers(data);
  };

  const handleOpenModal = (user?: AdvertiserUser) => {
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "viewer" });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (editingUser) {
        await usersApi.update(editingUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          permissions: DEFAULT_PERMISSIONS[formData.role],
        });
      } else {
        await usersApi.create({
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });
      }
      await loadUsers();
      handleCloseModal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (user: AdvertiserUser) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      await usersApi.delete(user.id);
      await loadUsers();
    }
  };

  const getRoleBadgeVariant = (
    role: UserRole,
  ): "default" | "success" | "warning" | "error" | "info" | "brand" => {
    switch (role) {
      case "owner":
        return "brand";
      case "manager":
        return "info";
      case "viewer":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <DashboardLayout title="Team Management">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage your advertising team
          </p>
        </div>
        <Button
          leftIcon={<Icons.Plus size={18} />}
          onClick={() => handleOpenModal()}
        >
          Add User
        </Button>
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
                  onClick={() => handleOpenModal(user)}
                  className="p-1.5 text-muted-foreground hover:text-foreground"
                >
                  <Icons.Edit size={16} />
                </button>
                {user.role !== "owner" && (
                  <button
                    onClick={() => handleDelete(user)}
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
      <Card className="hidden lg:block">
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
                        onClick={() => handleOpenModal(user)}
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Icons.Edit size={16} />
                      </button>
                      {user.role !== "owner" && (
                        <button
                          onClick={() => handleDelete(user)}
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

      {/* Role Permissions */}
      <Card className="mt-6">
        <Card.Header
          title="Role Permissions"
          subtitle="Available roles and their permissions"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(["owner", "manager", "viewer"] as UserRole[]).map((role) => (
            <div key={role} className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={getRoleBadgeVariant(role)}>{role}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-3.5 h-3.5">
                    <Icons.Check
                      size={14}
                      className={
                        DEFAULT_PERMISSIONS[role].canCreateCampaigns
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }
                    />
                  </span>
                  Create Campaigns
                </p>
                <p className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-3.5 h-3.5">
                    <Icons.Check
                      size={14}
                      className={
                        DEFAULT_PERMISSIONS[role].canAccessWallet
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }
                    />
                  </span>
                  Access Wallet
                </p>
                <p className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-3.5 h-3.5">
                    <Icons.Check
                      size={14}
                      className={
                        DEFAULT_PERMISSIONS[role].canViewReports
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }
                    />
                  </span>
                  View Reports
                </p>
                <p className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-3.5 h-3.5">
                    <Icons.Check
                      size={14}
                      className={
                        DEFAULT_PERMISSIONS[role].canManageUsers
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }
                    />
                  </span>
                  Manage Users
                </p>
                <p className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-3.5 h-3.5">
                    <Icons.Check
                      size={14}
                      className={
                        DEFAULT_PERMISSIONS[role].canEditSettings
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }
                    />
                  </span>
                  Edit Settings
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? "Edit User" : "Add User"}
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
                <option value="owner" className="py-2 rounded-lg bg-background">
                  Owner
                </option>
                <option
                  value="manager"
                  className="py-2 rounded-lg bg-background"
                >
                  Manager
                </option>
                <option
                  value="viewer"
                  className="py-2 rounded-lg bg-background"
                >
                  Viewer
                </option>
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
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              {editingUser ? "Save Changes" : "Add User"}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default UsersPage;
