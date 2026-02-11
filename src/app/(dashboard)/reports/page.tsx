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

const COLORS = ["#0ea5e9", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444"];

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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card padding="sm">
          <p className="text-2xl font-bold text-foreground">
            {formatNumber(totalImpressions)}
          </p>
          <p className="text-sm text-muted-foreground">Total Impressions</p>
        </Card>
        <Card padding="sm">
          <p className="text-2xl font-bold text-foreground">
            {formatNumber(totalClicks)}
          </p>
          <p className="text-sm text-muted-foreground">Total Clicks</p>
        </Card>
        <Card padding="sm">
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(totalSpend)}
          </p>
          <p className="text-sm text-muted-foreground">Total Spend</p>
        </Card>
        <Card padding="sm">
          <p className="text-2xl font-bold text-foreground">
            {formatPercentage(
              totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
            )}
          </p>
          <p className="text-sm text-muted-foreground">Average CTR</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("performance")}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors",
            activeTab === "performance"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          Performance
        </button>
        <button
          onClick={() => setActiveTab("spend")}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors",
            activeTab === "spend"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          Spend Analysis
        </button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          >
            <option value="all">All Campaigns</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

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
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
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
                    fill="#0ea5e9"
                    name="Impressions"
                  />
                  <Bar dataKey="views" fill="#8b5cf6" name="Views" />
                  <Bar dataKey="clicks" fill="#22c55e" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Performance Table */}
          <Card>
            <Card.Header
              title="Detailed Metrics"
              subtitle="Campaign performance breakdown"
            />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">
                      Campaign
                    </th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">
                      Impressions
                    </th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">
                      CTR
                    </th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">
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
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickFormatter={(value) => `R${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [formatCurrency(value), ""]}
                  />
                  <Bar dataKey="spent" fill="#0ea5e9" name="Spent" />
                  <Bar dataKey="remaining" fill="var(--muted)" name="Remaining" />
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

      {/* Spend Table */}
      <Card className="mt-6">
        <Card.Header
          title="Campaign Spending"
          subtitle="Detailed spend breakdown"
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Campaign
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Budget
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Spent
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Remaining
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
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
    </DashboardLayout>
  );
};

export default ReportsPage;
