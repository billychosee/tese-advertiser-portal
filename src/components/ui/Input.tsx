"use client";

import React from "react";
import { cn } from "@/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, leftIcon, rightIcon, ...props },
    ref,
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground",
              "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
              "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed",
              error &&
                "border-destructive focus:border-destructive focus:ring-destructive/20",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
