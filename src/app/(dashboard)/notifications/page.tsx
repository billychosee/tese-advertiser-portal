"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { formatDate, cn } from "@/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Campaign Approved",
    message: "Your campaign 'Summer Sale 2024' has been approved and is now live.",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Budget Alert",
    message: "Your campaign 'Product Launch' has spent 80% of its budget.",
    type: "warning",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "New Review",
    message: "You have a new review on your campaign 'Brand Awareness'.",
    type: "info",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "Campaign Paused",
    message: "Your campaign 'Holiday Special' was paused due to budget constraints.",
    type: "error",
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    title: "Performance Report",
    message: "Your weekly performance report for 'Spring Collection' is ready.",
    type: "info",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 300);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Icons.CheckCircle size={20} className="text-emerald-500" />;
      case "warning":
        return <Icons.AlertTriangle size={20} className="text-amber-500" />;
      case "error":
        return <Icons.AlertCircle size={20} className="text-red-500" />;
      default:
        return <Icons.Info size={20} className="text-blue-500" />;
    }
  };

  // Color config for notification types
  const getTypeColors = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return {
          light: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", icon: "text-emerald-600" },
          dark: { bg: "dark:bg-emerald-900/20", iconBg: "dark:bg-emerald-500/20", icon: "dark:text-emerald-400" },
        };
      case "warning":
        return {
          light: { bg: "bg-amber-50", iconBg: "bg-amber-100", icon: "text-amber-600" },
          dark: { bg: "dark:bg-amber-900/20", iconBg: "dark:bg-amber-500/20", icon: "dark:text-amber-400" },
        };
      case "error":
        return {
          light: { bg: "bg-red-50", iconBg: "bg-red-100", icon: "text-red-600" },
          dark: { bg: "dark:bg-red-900/20", iconBg: "dark:bg-red-500/20", icon: "dark:text-red-400" },
        };
      default:
        return {
          light: { bg: "bg-blue-50", iconBg: "bg-blue-100", icon: "text-blue-600" },
          dark: { bg: "dark:bg-blue-900/20", iconBg: "dark:bg-blue-500/20", icon: "dark:text-blue-400" },
        };
    }
  };

  return (
    <DashboardLayout title="Notifications">
      <div className="min-h-screen bg-background text-foreground space-y-8 selection:bg-primary/30">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter italic uppercase text-foreground">
              Notifications
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs font-medium uppercase tracking-widest">
                {unreadCount > 0
                  ? `${unreadCount} Unread Message${unreadCount > 1 ? "s" : ""}`
                  : "You're all caught up!"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              className="bg-white text-primary border-primary border hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all duration-200 dark:bg-transparent dark:text-primary dark:border-primary dark:hover:bg-transparent dark:hover:text-white dark:hover:border-white"
            >
              <Icons.Check size={16} className="mr-2" />
              Mark All as Read
            </Button>
          )}
        </header>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl border border-border w-fit">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200",
                filter === f
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "all" ? "All" : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse bg-card border-border rounded-[20px] p-4 sm:p-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="bg-card border-border rounded-[20px] p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Icons.BellOff size={32} className="sm:text-40 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-card-foreground mb-2">
              No Notifications
            </h3>
            <p className="text-muted-foreground text-sm">
              {filter === "unread"
                ? "You have no unread notifications"
                : "You don't have any notifications yet"}
            </p>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredNotifications.map((notification) => {
              const colors = getTypeColors(notification.type);
              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "bg-card border-border rounded-xl sm:rounded-[20px] p-4 sm:p-6 transition-all duration-200",
                    !notification.read && "border-l-4 border-l-primary",
                  )}
                >
                  <div className="flex items-start gap-3 sm:gap-5">
                    {/* Icon */}
                    <div
                      className={cn(
                        "p-2 sm:p-3 rounded-full flex-shrink-0",
                        colors.light.iconBg,
                        colors.dark.iconBg,
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3
                            className={cn(
                              "text-base sm:text-lg font-bold tracking-tight",
                              !notification.read
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap sm:mt-1">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0 sm:ml-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Icons.Check size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1.5 sm:p-2 text-muted-foreground hover:text-destructive hover:bg-secondary rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Icons.Trash size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
