"use client";

import React from "react";
import { cn } from "@/utils";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const DashboardContent: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  className,
}) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "pl-16" : "pl-64",
        )}
      >
        <TopBar title={title} />
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
