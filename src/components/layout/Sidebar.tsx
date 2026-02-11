"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import { Icons } from "@/components/ui/Icons";
import { useSidebar } from "./SidebarContext";
import { useTheme } from "@/hooks/useTheme";

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
  const { theme } = useTheme();

  const fullLogo =
    theme === "dark" ? "/Tese-Light-Logo.png" : "/Tese-Dark-logo.png";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "bg-card border-r border-border shadow-[20px_0_40px_rgba(0,0,0,0.02)]",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo Section - Clean & Geometric */}
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center w-full group">
            <img
              src={isCollapsed ? "/Tese-Icon.png" : fullLogo}
              alt="Tese Logo"
              className={cn(
                "object-contain transition-all duration-300",
                isCollapsed ? "w-20 h-16" : "w-40 h-24"
              )}
            />
          </Link>
        </div>

        {/* Navigation - Responsive Active State */}
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative flex items-center h-12 rounded-xl transition-all duration-300",
                  isActive
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  isCollapsed ? "justify-center" : "px-4",
                )}
              >
                {/* Active Nav Item Left Bar */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full" />
                )}

                <div
                  className={cn(
                    "relative z-10 transition-colors",
                    isActive ? "text-primary" : "group-hover:text-foreground",
                  )}
                >
                  <Icon size={20} />
                </div>

                {!isCollapsed && (
                  <span
                    className={cn(
                      "relative z-10 ml-3.5 text-[13px] font-semibold tracking-tight transition-opacity",
                      isActive ? "opacity-100" : "opacity-100",
                    )}
                  >
                    {item.name}
                  </span>
                )}

                {/* Notification Badge Style from reference */}
                {item.name === "Campaigns" && !isCollapsed && (
                  <span className="ml-auto relative z-10 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                    12
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border mt-auto">
          <div
            className={cn(
              "flex items-center gap-2 pl-1 p-2 rounded-2xl bg-secondary transition-colors cursor-pointer",
              isCollapsed ? "justify-center" : "pl-2",
            )}
          >
            <button
              className={cn(
                "group relative flex items-center h-10 rounded-xl transition-all duration-300",
                "text-muted-foreground hover:text-primary",
                isCollapsed ? "w-full justify-center" : "",
              )}
              onClick={() => console.log("Logout")}
            >
              {/* Left Bar Indicator on Hover */}
              <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />

              <div
                className={cn(
                  "relative z-10 transition-colors group-hover:text-primary",
                )}
              >
                <Icons.Logout size={20} />
              </div>

              {!isCollapsed && (
                <span
                  className={cn(
                    "relative z-10 ml-3 text-[13px] font-semibold tracking-tight transition-colors group-hover:text-primary",
                  )}
                >
                  Logout
                </span>
              )}
            </button>

            {!isCollapsed && (
              <button
                onClick={toggleSidebar}
                className="ml-auto p-1.5 text-muted-foreground hover:text-primary transition-colors"
              >
                <Icons.ChevronRight size={16} className="rotate-180" />
              </button>
            )}
          </div>

          {isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="w-full flex justify-center mt-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Icons.ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
