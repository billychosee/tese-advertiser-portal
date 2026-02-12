"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { reportsApi, campaignsApi } from "@/services/api";
import { formatCurrency, formatNumber, formatPercentage, cn } from "@/utils";
import { CampaignReport, SpendReport, Campaign } from "@/types";

const COLORS = ["#2e7d32", "#f9a825", "#c62828"];

// Tab Navigation - horizontal tabs within a single card, half-half centered
const TabNav = ({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: { id: string; label: string; icon: React.ElementType }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}) => (
  <div className="flex items-center justify-center gap-3 p-2 bg-card border border-border rounded-2xl mb-6">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 flex-1",
          activeTab === tab.id
            ? "bg-primary text-primary-foreground shadow-lg font-medium"
            : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground",
        )}
      >
        <tab.icon size={18} />
        <span>{tab.label}</span>
      </button>
    ))}
  </div>
);

// Measurement Card with theme-aware colors (white cards, colored icons)
const MeasurementCard = ({
  title,
  value,
  color,
  icon: Icon,
  isCurrency = false,
  isPercentage = false,
}: any) => {
  // Project color configurations - only icons are colored (using product colors)
  const colorConfig = {
    green: {
      light: {
        bg: "bg-white",
        border: "border-gray-200",
        iconBg: "bg-[#2e7d32]/10",
        icon: "text-[#2e7d32]",
        title: "text-gray-600",
        value: "text-gray-900",
      },
      dark: {
        bg: "dark:bg-gray-800",
        border: "dark:border-gray-700",
        iconBg: "dark:bg-[#2e7d32]/20",
        icon: "dark:text-[#2e7d32]",
        title: "dark:text-gray-400",
        value: "dark:text-white",
      },
    },
    red: {
      light: {
        bg: "bg-white",
        border: "border-gray-200",
        iconBg: "bg-[#c62828]/10",
        icon: "text-[#c62828]",
        title: "text-gray-600",
        value: "text-gray-900",
      },
      dark: {
        bg: "dark:bg-gray-800",
        border: "dark:border-gray-700",
        iconBg: "dark:bg-[#c62828]/20",
        icon: "dark:text-[#c62828]",
        title: "dark:text-gray-400",
        value: "dark:text-white",
      },
    },
    gold: {
      light: {
        bg: "bg-white",
        border: "border-gray-200",
        iconBg: "bg-[#f9a825]/10",
        icon: "text-[#f9a825]",
        title: "text-gray-600",
        value: "text-gray-900",
      },
      dark: {
        bg: "dark:bg-gray-800",
        border: "dark:border-gray-700",
        iconBg: "dark:bg-[#f9a825]/20",
        icon: "dark:text-[#f9a825]",
        title: "dark:text-gray-400",
        value: "dark:text-white",
      },
    },
  };

  const config =
    colorConfig[color as keyof typeof colorConfig] || colorConfig.green;

  const formatValue = (val: number) => {
    if (isCurrency) return formatCurrency(val);
    if (isPercentage) return formatPercentage(val);
    return formatNumber(val);
  };

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
        {formatValue(value as number)}
      </h3>
    </div>
  );
};

const ReportsPage: React.FC = () => {
  const [campaignReports, setCampaignReports] = useState<CampaignReport[]>([]);
  const [spendReports, setSpendReports] = useState<SpendReport[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"performance" | "spend">(
    "performance",
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [campaignData, spendData, campaignList] = await Promise.all([
      reportsApi.getCampaignReports(),
      reportsApi.getSpendReports(),
      campaignsApi.getAll(),
    ]);
    setCampaignReports(campaignData);
    setSpendReports(spendData);
    setCampaigns(campaignList);
  };

  const handleExportCampaign = async (campaignId: string) => {
    const blob = await reportsApi.exportCampaignReport(campaignId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign-report-${campaignId}.csv`;
    a.click();
  };

  const handleExportSpend = async () => {
    const blob = await reportsApi.exportSpendReport();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spend-report.csv";
    a.click();
  };

  const filteredCampaignReports =
    selectedCampaign === "all"
      ? campaignReports
      : campaignReports.filter((r) => r.campaignId === selectedCampaign);

  const chartData = filteredCampaignReports.map((report) => ({
    name:
      report.campaignName.length > 15
        ? report.campaignName.slice(0, 15) + "..."
        : report.campaignName,
    impressions: report.impressions,
    views: report.views,
    clicks: report.clicks,
  }));

  const spendChartData = spendReports.map((report) => ({
    name:
      report.campaignName.length > 15
        ? report.campaignName.slice(0, 15) + "..."
        : report.campaignName,
    spent: report.spent,
    remaining: report.remaining,
  }));

  const pieData = spendReports.map((report) => ({
    name: report.campaignName,
    value: report.spent,
  }));

  const totalSpend = spendReports.reduce((sum, r) => sum + r.spent, 0);
  const totalBudget = spendReports.reduce((sum, r) => sum + r.totalBudget, 0);
  const totalImpressions = campaignReports.reduce(
    (sum, r) => sum + r.impressions,
    0,
  );
  const totalClicks = campaignReports.reduce((sum, r) => sum + r.clicks, 0);

  return (
    <DashboardLayout title="Reports">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Analyze your campaign performance
          </p>
        </div>
        <Button
          leftIcon={<Icons.Download size={18} />}
          onClick={handleExportSpend}
        >
          Export All
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MeasurementCard
          title="Total Impressions"
          value={totalImpressions}
          color="green"
          icon={Icons.Eye}
        />
        <MeasurementCard
          title="Total Clicks"
          value={totalClicks}
          color="green"
          icon={Icons.TrendingUp}
        />
        <MeasurementCard
          title="Total Spend"
          value={totalSpend}
          color="gold"
          icon={Icons.Wallet}
          isCurrency
        />
        <MeasurementCard
          title="Average CTR"
          value={
            totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
          }
          color="red"
          icon={Icons.TrendingUp}
          isPercentage
        />
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <TabNav
          tabs={[
            { id: "performance", label: "Performance", icon: Icons.TrendingUp },
            { id: "spend", label: "Spend Analysis", icon: Icons.Wallet },
          ]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as "performance" | "spend")}
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="relative">
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Campaigns</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground">
            <Icons.ChevronDown size={16} />
          </div>
        </div>
      </div>

      {activeTab === "performance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <Card>
            <Card.Header
              title="Campaign Performance"
              subtitle="Impressions, Views, and Clicks"
            />
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="impressions"
                    fill="#2e7d32"
                    name="Impressions"
                  />
                  <Bar dataKey="views" fill="#f9a825" name="Views" />
                  <Bar dataKey="clicks" fill="#c62828" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Performance Metrics - Mobile Cards */}
          <div className="lg:hidden space-y-4">
            <h3 className="font-semibold text-foreground">Detailed Metrics</h3>
            {filteredCampaignReports.slice(0, 5).map((report) => (
              <Card key={report.campaignId} padding="md" className="hover:bg-secondary/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">{report.campaignName}</h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center gap-2 p-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Icons.Eye size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-lg font-bold text-foreground">{formatNumber(report.impressions)}</p>
                    <p className="text-xs text-muted-foreground">Impressions</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-2">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <Icons.TrendingUp size={20} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <p className="text-lg font-bold text-foreground">{formatPercentage(report.ctr)}</p>
                    <p className="text-xs text-muted-foreground">CTR</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-2">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <Icons.Wallet size={20} className="text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(report.cpm)}</p>
                    <p className="text-xs text-muted-foreground">CPM</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Performance Table - Desktop */}
          <Card className="hidden lg:block">
            <Card.Header
              title="Detailed Metrics"
              subtitle="Campaign performance breakdown"
            />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                      Campaign
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                      Impressions
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                      CTR
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                      CPM
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaignReports.slice(0, 5).map((report) => (
                    <tr
                      key={report.campaignId}
                      className="border-b border-border"
                    >
                      <td className="py-2 px-3 font-medium text-foreground">
                        {report.campaignName}
                      </td>
                      <td className="py-2 px-3 text-right text-muted-foreground">
                        {formatNumber(report.impressions)}
                      </td>
                      <td className="py-2 px-3 text-right text-muted-foreground">
                        {formatPercentage(report.ctr)}
                      </td>
                      <td className="py-2 px-3 text-right text-muted-foreground">
                        {formatCurrency(report.cpm)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "spend" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spend Chart */}
          <Card>
            <Card.Header
              title="Budget vs Spend"
              subtitle="Campaign budget utilization"
            />
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [formatCurrency(value), ""]}
                  />
                  <Bar dataKey="spent" fill="#2e7d32" name="Spent" />
                  <Bar
                    dataKey="remaining"
                    fill="var(--muted)"
                    name="Remaining"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Spend Distribution */}
          <Card>
            <Card.Header
              title="Spend Distribution"
              subtitle="Budget allocation by campaign"
            />
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name.slice(0, 10)}... ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Spend Table - Desktop */}
      <Card className="hidden lg:block mt-6">
        <Card.Header
          title="Campaign Spending"
          subtitle="Detailed spend breakdown"
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                  Campaign
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                  Budget
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                  Spent
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                  Remaining
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {spendReports.map((report) => (
                <tr
                  key={report.campaignId}
                  className="border-b border-border hover:bg-secondary"
                >
                  <td className="py-3 px-4 font-medium text-foreground">
                    {report.campaignName}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground">
                    {formatCurrency(report.totalBudget)}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground">
                    {formatCurrency(report.spent)}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground">
                    {formatCurrency(report.remaining)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExportCampaign(report.campaignId)}
                      leftIcon={<Icons.Download size={14} />}
                    >
                      Export
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Campaign Spending - Mobile Cards */}
      <div className="lg:hidden mt-6 space-y-4">
        <h3 className="font-semibold text-foreground">Campaign Spending</h3>
        {spendReports.map((report) => (
          <Card key={report.campaignId} padding="md" className="hover:bg-secondary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">{report.campaignName}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExportCampaign(report.campaignId)}
                leftIcon={<Icons.Download size={14} />}
              >
                Export
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2 p-2">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Icons.Wallet size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(report.totalBudget)}</p>
                <p className="text-xs text-muted-foreground">Budget</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-2">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Icons.TrendingUp size={20} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(report.spent)}</p>
                <p className="text-xs text-muted-foreground">Spent</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-2">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Icons.Pause size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(report.remaining)}</p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
