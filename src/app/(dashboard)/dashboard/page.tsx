"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { dashboardApi } from "@/services/api";
import { formatCurrency, formatNumber, cn } from "@/utils";

// Measurement Card with theme-aware colors (using project colors: green, red, gold)
const MeasurementCard = ({
  title,
  value,
  color,
  icon: Icon,
  isCurrency = false,
}: any) => {
  // Project color configurations
  const colorConfig = {
    green: {
      dark: {
        bg: "dark:bg-gradient-to-br dark:from-green-900/40 dark:to-transparent",
        border: "dark:border-green-500/30",
        text: "dark:text-green-400",
        iconBg: "dark:bg-green-500/20 dark:border-green-500/30",
        title: "dark:text-green-400/70",
        value: "dark:text-green-300",
      },
      light: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        iconBg: "bg-green-100 border-green-200",
        title: "text-green-700",
        value: "text-green-900",
      },
    },
    red: {
      dark: {
        bg: "dark:bg-gradient-to-br dark:from-red-900/40 dark:to-transparent",
        border: "dark:border-red-500/30",
        text: "dark:text-red-400",
        iconBg: "dark:bg-red-500/20 dark:border-red-500/30",
        title: "dark:text-red-400/70",
        value: "dark:text-red-300",
      },
      light: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        iconBg: "bg-red-100 border-red-200",
        title: "text-red-700",
        value: "text-red-900",
      },
    },
    gold: {
      dark: {
        bg: "dark:bg-gradient-to-br dark:from-yellow-900/40 dark:to-transparent",
        border: "dark:border-yellow-500/30",
        text: "dark:text-yellow-400",
        iconBg: "dark:bg-yellow-500/20 dark:border-yellow-500/30",
        title: "dark:text-yellow-400/70",
        value: "dark:text-yellow-300",
      },
      light: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        iconBg: "bg-yellow-100 border-yellow-200",
        title: "text-yellow-700",
        value: "text-yellow-900",
      },
    },
  };

  const config =
    colorConfig[color as keyof typeof colorConfig] || colorConfig.green;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border p-5 transition-all hover:scale-[1.02] cursor-pointer",
        config.dark.bg,
        config.dark.border,
        config.light.bg,
        config.light.border,
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "p-2.5 rounded-full border backdrop-blur-md",
            config.dark.iconBg,
            config.light.iconBg,
          )}
        >
          <Icon size={16} className={cn(config.dark.text, config.light.text)} />
        </div>
        <p
          className={cn(
            "text-xs font-bold uppercase tracking-widest",
            config.dark.title,
            config.light.title,
          )}
        >
          {title}
        </p>
      </div>
      <h3
        className={cn(
          "text-2xl font-bold tracking-tighter",
          config.dark.value,
          config.light.value,
        )}
      >
        {isCurrency ? formatCurrency(value) : formatNumber(value)}
      </h3>
    </div>
  );
};

const DashboardPage = () => {
  const [period, setPeriod] = useState<"daily" | "weekly" | "yearly">("daily");
  const [metrics, setMetrics] = useState<any>(null);
  const [dailyMetrics, setDailyMetrics] = useState<any[]>([]);
  const [topUpAmount, setTopUpAmount] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [m, d] = await Promise.all([
        dashboardApi.getMetrics(),
        dashboardApi.getDailyMetrics(period),
      ]);
      setMetrics(m);
      setDailyMetrics(d);
    };
    fetchData();
  }, [period]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground space-y-8 selection:bg-primary/30">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter italic uppercase text-foreground">
              Dashboard
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs font-medium uppercase tracking-widest">
                System Live: Overview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-secondary p-1.5 rounded-2xl border border-border backdrop-blur-xl">
            {(["daily", "weekly", "yearly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300",
                  period === p
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </header>

        {/* Action Grid: Wallet & Ad Campaign Creation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top up Wallet Card */}
          <Card className="lg:col-span-4 bg-card border-border p-8 rounded-[32px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-card-foreground">
                Top up Wallet
              </h3>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icons.Wallet className="text-primary" size={20} />
              </div>
            </div>
            <div className="space-y-5">
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black tracking-tighter">
                  R
                </span>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="w-full bg-background border border-input rounded-[20px] py-5 pl-10 pr-4 text-foreground font-bold focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 py-8 rounded-[20px] font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:scale-[1.01] active:scale-[0.98]">
                Pay Using Smartpay
              </Button>
            </div>
          </Card>

          {/* Ad Campaign Creation Card - Hero Style */}
          <Card className="lg:col-span-8 bg-primary rounded-[32px] p-10 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between items-start">
              <div className="space-y-4">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none text-primary-foreground">
                  Create Ad Campaign
                </h3>
                <p className="text-primary-foreground/80 font-medium max-w-sm text-sm">
                  Target customers, set your budget, and launch in minutes.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["Retail", "Technology", "Health", "Finance", "Travel"].map(
                    (cat) => (
                      <span
                        key={cat}
                        className="px-4 py-1.5 bg-black/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20 text-primary-foreground"
                      >
                        {cat}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <Button className="bg-background text-primary hover:bg-background/90 font-black uppercase tracking-[0.2em] text-xs px-10 py-5 rounded-[20px] mt-8 shadow-2xl">
                Get Started
              </Button>
            </div>
            <Icons.Campaign className="absolute -bottom-16 -right-16 w-80 h-80 text-black/10 rotate-12 group-hover:rotate-0 transition-all duration-700 ease-out" />
          </Card>
        </div>

        {/* 8 Required Measurement Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <MeasurementCard
            title="Active Ads"
            value={metrics?.activeAds || 0}
            color="green"
            icon={Icons.Campaign}
          />
          <MeasurementCard
            title="Paused Ads"
            value={metrics?.pausedAds || 0}
            color="red"
            icon={Icons.Pause}
          />
          <MeasurementCard
            title="Total Views"
            value={metrics?.totalViews || 0}
            color="gold"
            icon={Icons.Eye}
          />
          <MeasurementCard
            title="Total Impressions"
            value={metrics?.totalImpressions || 0}
            color="green"
            icon={Icons.TrendingUp}
          />

          <MeasurementCard
            title="Total Spend"
            value={metrics?.totalSpend || 0}
            color="gold"
            icon={Icons.Wallet}
            isCurrency
          />
          <MeasurementCard
            title="Total Budget"
            value={metrics?.totalBudget || 0}
            color="green"
            icon={Icons.Wallet}
            isCurrency
          />
          <MeasurementCard
            title="Credits"
            value={metrics?.walletBalance || 0}
            color="green"
            icon={Icons.Wallet}
            isCurrency
          />
          <MeasurementCard
            title="Avg. CTR"
            value="2.84%"
            color="gold"
            icon={Icons.TrendingUp}
          />
        </div>

        {/* Performance Chart */}
        <Card className="bg-card border-border rounded-[32px] p-8 lg:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-card-foreground">
                Ad Campaign Performance
              </h3>
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1 italic">
                Real-time Data Visualization
              </p>
            </div>
            <div className="flex gap-6 text-[10px] font-black tracking-widest uppercase text-muted-foreground">
              <span className="flex items-center gap-2 text-primary">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />{" "}
                Reach
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />{" "}
                Clicks
              </span>
            </div>
          </div>
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyMetrics}>
                <defs>
                  <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="rgba(128,128,128,0.1)"
                  className="dark:stroke-white/10 light:stroke-gray-200"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  dy={15}
                />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    fontSize: "12px",
                    color: "var(--card-foreground)",
                  }}
                  cursor={{ stroke: "var(--primary)", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="impressions"
                  stroke="var(--primary)"
                  strokeWidth={5}
                  fill="url(#purpleGlow)"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="rgba(128,128,128,0.4)"
                  strokeWidth={2}
                  fill="transparent"
                  className="dark:stroke-white/20 light:stroke-gray-400"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
