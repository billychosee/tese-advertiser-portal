"use client";

import React from "react";
import { cn } from "@/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "brand";
  size?: "sm" | "md";
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}) => {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-primary/10 text-primary",
    warning: "bg-accent/10 text-accent",
    error: "bg-destructive/10 text-destructive",
    info: "bg-secondary text-secondary-foreground",
    brand: "bg-primary text-primary-foreground",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
