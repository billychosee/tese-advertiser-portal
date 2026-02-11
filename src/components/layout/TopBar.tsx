"use client";

import React, { useState } from "react";
import { cn } from "@/utils";
import { Icons } from "@/components/ui/Icons";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface TopBarProps {
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Title */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
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
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Icons.Eye size={20} />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-secondary transition-colors">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">JD</span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-secondary-foreground">
                John Doe
              </span>
              <Icons.ChevronDown
                size={16}
                className="hidden sm:block text-muted-foreground"
              />
            </button>
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
    </header>
  );
};

export default TopBar;
