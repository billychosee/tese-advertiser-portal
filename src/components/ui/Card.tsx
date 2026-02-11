"use client";

import React from "react";
import { cn } from "@/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", padding = "md", children, ...props },
    ref,
  ) => {
    const variants = {
      default: "bg-card shadow-sm",
      bordered: "bg-card border border-border",
      elevated: "bg-card shadow-lg",
    };

    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-4 sm:p-6",
      lg: "p-6 sm:p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl",
          variants[variant],
          paddings[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("flex items-start justify-between mb-4", className)}
      {...props}
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center mt-4 pt-4 border-t border-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Object.assign(Card, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
});
