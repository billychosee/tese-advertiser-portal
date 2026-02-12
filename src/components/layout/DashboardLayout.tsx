"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: {
    label: string;
    href?: string;
    icon?: LucideIcon;
  }[];
  className?: string;
}

const DashboardContent: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  breadcrumbs,
  className,
}) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300",
          // Mobile: no padding when sidebar is open (full width)
          "lg:pl-20",
          // Desktop: adjust based on collapsed state
          isCollapsed ? "lg:pl-20" : "lg:pl-72",
        )}
      >
        <TopBar title={title} breadcrumbs={breadcrumbs} />
        <main className={cn("p-4 sm:p-6 lg:p-8", className)}>{children}</main>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  return (
    <SidebarProvider>
      <DashboardContent {...props} />
    </SidebarProvider>
  );
};

export default DashboardLayout;
