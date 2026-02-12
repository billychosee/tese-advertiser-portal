"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
import Modal from "@/components/ui/Modal";
import { Icons } from "@/components/ui/Icons";
import { dashboardApi, walletApi } from "@/services/api";
import { formatCurrency, formatNumber, cn } from "@/utils";
import Input from "@/components/ui/Input";

// Measurement Card with theme-aware colors (white cards, colored icons)
const MeasurementCard = ({
  title,
  value,
  color,
  icon: Icon,
  isCurrency = false,
}: any) => {
  // Project color configurations - only icons are colored
  const colorConfig = {
    green: {
      light: {
        bg: "bg-white",
        border: "border-gray-200",
        iconBg: "bg-green-100",
        icon: "text-green-600",
        title: "text-gray-600",
        value: "text-gray-900",
      },
      dark: {
        bg: "dark:bg-gray-800",
        border: "dark:border-gray-700",
        iconBg: "dark:bg-green-500/20",
        icon: "dark:text-green-400",
        title: "dark:text-gray-400",
        value: "dark:text-white",
      },
    },
    red: {
      light: {
        bg: "bg-white",
        border: "border-gray-200",
        iconBg: "bg-red-100",
        icon: "text-red-600",
        title: "text-gray-600",
        value: "text-gray-900",
      },
      dark: {
        bg: "dark:bg-gray-800",
        border: "dark:border-gray-700",
        iconBg: "dark:bg-red-500/20",
        icon: "dark:text-red-400",
        title: "dark:text-gray-400",
        value: "dark:text-white",
      },
    },
    gold: {
      light: {
        bg: "bg-white",
        border: "border-gray-200",
        iconBg: "bg-amber-100",
        icon: "text-amber-600",
        title: "text-gray-600",
        value: "text-gray-900",
      },
      dark: {
        bg: "dark:bg-gray-800",
        border: "dark:border-gray-700",
        iconBg: "dark:bg-amber-500/20",
        icon: "dark:text-amber-400",
        title: "dark:text-gray-400",
        value: "dark:text-white",
      },
    },
  };

  const config =
    colorConfig[color as keyof typeof colorConfig] || colorConfig.green;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 transition-all hover:scale-[1.02] cursor-pointer",
        config.light.bg,
        config.light.border,
        config.dark.bg,
        config.dark.border,
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "p-2.5 rounded-full",
            config.light.iconBg,
            config.dark.iconBg,
          )}
        >
          <Icon size={18} className={cn(config.light.icon, config.dark.icon)} />
        </div>
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-wide",
            config.light.title,
            config.dark.title,
          )}
        >
          {title}
        </p>
      </div>
      <h3
        className={cn(
          "text-2xl font-bold tracking-tight",
          config.light.value,
          config.dark.value,
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
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);

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

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return;
    setIsTopUpLoading(true);
    try {
      await walletApi.topUp(parseFloat(topUpAmount), "DirectPay");
      setIsTopUpModalOpen(false);
      setTopUpAmount("");
      // Refresh data
      const m = await dashboardApi.getMetrics();
      setMetrics(m);
    } catch (error) {
      console.error("Top-up failed:", error);
    } finally {
      setIsTopUpLoading(false);
    }
  };

  return (
    <DashboardLayout title="Dashboard">
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
          <a href="/reports" className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-2 bg-white text-primary border-primary border hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all duration-200 dark:bg-transparent dark:text-primary dark:border-primary dark:hover:bg-transparent dark:hover:text-white dark:hover:border-white"
            >
              <Icons.FileText size={16} />
              View Reports
            </Button>
          </a>
        </header>

        {/* Action Grid: Wallet & Ad Campaign Creation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top up Wallet Card */}
          <Card className="lg:col-span-4 bg-card border-border p-8 rounded-[32px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                  Wallet Balance
                </p>
                <h3 className="text-3xl font-bold text-card-foreground mt-1">
                  {formatCurrency(metrics?.walletBalance || 0)}
                </h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Icons.Wallet className="text-primary" size={24} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                  $
                </span>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="w-full bg-background border border-input rounded-[20px] py-4 pl-14 pr-4 text-foreground font-bold focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90 py-4 rounded-[20px] font-bold uppercase tracking-widest text-xs transition-all"
                onClick={() => setIsTopUpModalOpen(true)}
              >
                Top up Wallet
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
              <Link href="/campaigns/create">
                <Button className="bg-background text-primary hover:bg-background/90 font-black uppercase tracking-[0.2em] text-xs px-10 py-5 rounded-[20px] mt-8 shadow-2xl">
                  Get Started
                </Button>
              </Link>
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
            {/* Period Toggle */}
            <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
              {(["daily", "weekly", "yearly"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200",
                    period === p
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p}
                </button>
              ))}
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
                  formatter={(value: number, name: string) => [
                    <span key={name} className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full bg-current"
                        style={{
                          color:
                            name === "impressions"
                              ? "var(--primary)"
                              : "var(--accent)",
                        }}
                      />
                      {name === "impressions" ? "Impressions" : "Clicks"}:{" "}
                      {value.toLocaleString()}
                    </span>,
                    name,
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="impressions"
                  stroke="var(--primary)"
                  strokeWidth={5}
                  fill="url(#purpleGlow)"
                  fillOpacity={1}
                  dot={{ fill: "var(--primary)", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  fill="transparent"
                  dot={{ fill: "var(--accent)", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
        {/* Top Up Modal */}
        <Modal
          isOpen={isTopUpModalOpen}
          onClose={() => setIsTopUpModalOpen(false)}
          title="Top Up Wallet"
          size="sm"
        >
          <div className="space-y-4">
            <Input
              label="Amount (USD)"
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="Enter amount"
              leftIcon={
                <span className="text-muted-foreground font-bold">$</span>
              }
            />

            <div className="grid grid-cols-3 gap-2">
              {[100, 500, 1000, 2000, 5000, 10000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTopUpAmount(amount.toString())}
                  className={cn(
                    "py-2 px-4 rounded-lg border font-medium transition-colors",
                    topUpAmount === amount.toString()
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input hover:border-primary",
                  )}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsTopUpModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleTopUp}
                isLoading={isTopUpLoading}
                disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
              >
                Top Up
              </Button>
            </div>
          </div>
        </Modal>
      </DashboardLayout>
  );
};

export default DashboardPage;
