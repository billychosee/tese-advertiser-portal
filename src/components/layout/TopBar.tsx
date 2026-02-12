"use client";

import React, { useState } from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/utils";
import { Icons } from "@/components/ui/Icons";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useSidebar } from "./SidebarContext";
import { authApi } from "@/services/api";

interface TopBarProps {
  title?: string;
  breadcrumbs?: {
    label: string;
    href?: string;
    icon?: LucideIcon;
  }[];
}

const TopBar: React.FC<TopBarProps> = ({ title, breadcrumbs }) => {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { toggleMobileSidebar } = useSidebar();

  const getPageIcon = (pageTitle: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      Dashboard: Icons.Dashboard,
      Campaigns: Icons.Campaign,
      "Create Campaign": Icons.Plus,
      Reports: Icons.FileText,
      Wallet: Icons.Wallet,
      Settings: Icons.Settings,
      "Team Management": Icons.Users,
    };
    return iconMap[pageTitle] || Icons.ChevronRight;
  };

  const defaultBreadcrumbs = title
    ? [
        { label: "Home", href: "/dashboard", icon: Icons.Home },
        { label: title, icon: getPageIcon(title) },
      ]
    : [];

  const displayBreadcrumbs = breadcrumbs || defaultBreadcrumbs;

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6">
        {/* Breadcrumbs or Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Menu */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors mr-1"
          >
            <Icons.Menu size={20} />
          </button>

          {displayBreadcrumbs.length > 0 ? (
            <nav className="hidden sm:flex items-center gap-2 text-sm">
              {displayBreadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <Icons.ChevronRight
                      size={14}
                      className="text-muted-foreground flex-shrink-0"
                    />
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                    >
                      {crumb.icon && index === 0 && (
                        <crumb.icon size={14} className="flex-shrink-0" />
                      )}
                      <span>{crumb.label}</span>
                    </a>
                  ) : (
                    <span
                      className={`flex items-center gap-1.5 whitespace-nowrap ${
                        index === displayBreadcrumbs.length - 1
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {crumb.icon && index === 0 ? (
                        <crumb.icon
                          size={14}
                          className={
                            index === displayBreadcrumbs.length - 1
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        />
                      ) : null}
                      <span>{crumb.label}</span>
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          ) : (
            <h1 className="hidden sm:block text-xl font-semibold text-foreground">
              {title}
            </h1>
          )}

          {/* Mobile Title - shown when breadcrumbs are hidden */}
          {displayBreadcrumbs.length === 0 && title && (
            <h1 className="sm:hidden text-lg font-semibold text-foreground">
              {title}
            </h1>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <ThemeToggle className="text-muted-foreground hover:text-foreground" />

          {/* Search */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
            <Icons.Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="sm:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            <Icons.Search size={20} />
          </button>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative p-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icons.Bell size={20} />
            {notifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">JD</span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-secondary-foreground">
                John Doe
              </span>
              <Icons.ChevronDown
                size={14}
                className={`hidden sm:block text-muted-foreground transition-transform ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Icons.Users size={16} className="text-muted-foreground" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Icons.Settings size={16} className="text-muted-foreground" />
                  Settings
                </Link>
                <hr className="my-1 border-border" />
                <button
                  className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary w-full text-left transition-colors"
                  onClick={async () => {
                    setIsUserMenuOpen(false);
                    await authApi.logout();
                    router.push("/login");
                  }}
                >
                  <Icons.Logout size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="sm:hidden px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              autoFocus
            />
            <Icons.Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default TopBar;
