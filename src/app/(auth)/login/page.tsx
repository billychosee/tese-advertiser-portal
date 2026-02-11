"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Icons } from "@/components/ui/Icons";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/utils";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (email === "demo@example.com" && password === "demo123") {
        setShowOnboarding(true);
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    router.push("/dashboard");
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <Card className="shadow-xl w-full max-w-md">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground text-center">
            Welcome Back
          </h2>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">
              or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary hover:opacity-80">
              Forgot password?
            </a>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-primary hover:opacity-80 font-medium"
            >
              Sign Up
            </a>
          </p>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            Demo credentials: demo@example.com / demo123
          </p>
        </div>
      </Card>

      {showOnboarding && (
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      )}
    </>
  );
};

export default LoginPage;
