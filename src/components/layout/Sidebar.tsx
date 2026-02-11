"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import { Icons } from "@/components/ui/Icons";
import { useSidebar } from "./SidebarContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.FC<{ size?: number | string; className?: string }>;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Icons.Dashboard },
  { name: "Wallet", href: "/wallet", icon: Icons.Wallet },
  { name: "Campaigns", href: "/campaigns", icon: Icons.Campaign },
  { name: "Reports", href: "/reports", icon: Icons.Reports },
  { name: "Team", href: "/users", icon: Icons.Users },
  { name: "Settings", href: "/settings", icon: Icons.Settings },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {!isCollapsed ? (
            <Link href="/dashboard" className="flex items-center gap-2">
              <img
                src="/Tese-Icon.png"
                alt="Tese Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-semibold text-foreground">TESE Ads</span>
            </Link>
          ) : (
            <Link href="/dashboard" className="flex justify-center">
              <img
                src="/Tese-Icon.png"
                alt="Tese Logo"
                className="w-8 h-8 object-contain"
              />
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className={cn(
              "p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors",
              isCollapsed && "mx-auto",
            )}
          >
            <Icons.ChevronRight
              size={20}
              className={cn(
                "transition-transform",
                isCollapsed ? "rotate-180" : "",
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                  isCollapsed && "justify-center",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-5 h-5",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon size={20} />
                </span>
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-border p-4">
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "gap-3",
            )}
          >
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-secondary-foreground">
                JD
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  John Doe
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  demo@example.com
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
