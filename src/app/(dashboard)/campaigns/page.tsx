"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSidebar } from "@/components/layout/SidebarContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Icons } from "@/components/ui/Icons";
import { campaignsApi } from "@/services/api";
import { formatCurrency, formatNumber, formatDate, cn } from "@/utils";
import { Campaign, CampaignStatus } from "@/types";

const CampaignsPageContent: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">(
    "all",
  );

  useEffect(() => {
    loadCampaigns();

    // Refresh campaigns when page becomes visible again
    // (e.g., after navigating back from create page)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadCampaigns();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", loadCampaigns);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", loadCampaigns);
    };
  }, []);

  const { setCampaignCount } = useSidebar();

  const loadCampaigns = async () => {
    const data = await campaignsApi.getAll();
    setCampaigns(data);
    setCampaignCount(data.length);
  };

  const handlePause = async (campaign: Campaign) => {
    if (campaign.status === "active") {
      await campaignsApi.pause(campaign.id);
    } else {
      await campaignsApi.resume(campaign.id);
    }
    await loadCampaigns();
  };

  const handleDelete = async () => {
    if (selectedCampaign) {
      await campaignsApi.delete(selectedCampaign.id);
      await loadCampaigns();
      setIsDeleteModalOpen(false);
      setSelectedCampaign(null);
    }
  };

  const handleRestart = async (campaign: Campaign) => {
    await campaignsApi.resume(campaign.id);
    await loadCampaigns();
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus && campaign.status !== "deleted";
  });

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "paused":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "pending":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
      case "suspended":
      case "deleted":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Manage your advertising campaigns
          </p>
        </div>
        <Link href="/campaigns/create">
          <Button leftIcon={<Icons.Plus size={18} />}>Create Campaign</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Icons.Search size={18} />}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as CampaignStatus | "all")
            }
            className="px-3 py-2.5 pr-10 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Active",
            value: campaigns.filter((c) => c.status === "active").length,
            icon: Icons.Play,
            color: "green",
          },
          {
            label: "Paused",
            value: campaigns.filter((c) => c.status === "paused").length,
            icon: Icons.Pause,
            color: "amber",
          },
          {
            label: "Pending",
            value: campaigns.filter((c) => c.status === "pending").length,
            icon: Icons.Clock,
            color: "blue",
          },
          {
            label: "Completed",
            value: campaigns.filter((c) => c.status === "completed").length,
            icon: Icons.Check,
            color: "slate",
          },
        ].map((stat) => (
          <Card key={stat.label} padding="sm" className="relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "p-1.5 rounded-full",
                    stat.color === "green" && "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
                    stat.color === "amber" && "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
                    stat.color === "blue" && "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
                    stat.color === "slate" && "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
                  )}
                >
                  <stat.icon size={14} />
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Campaigns
            </p>
          </Card>
        ))}
      </div>

      {/* Campaigns Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                  Preview
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                  Campaign
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50 rounded-t-lg">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                  Impressions
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                  Views
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                  Clicks
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                  Budget Spent
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground bg-secondary/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-border hover:bg-secondary"
                >
                  <td className="py-4 px-4">
                    <button
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setIsViewModalOpen(true);
                      }}
                      className="relative w-16 h-12 rounded-lg overflow-hidden group"
                      title="Preview Video"
                    >
                      {campaign.thumbnailUrl ? (
                        <img
                          src={campaign.thumbnailUrl}
                          alt={campaign.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Icons.Video size={16} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icons.Play size={20} className="text-white" />
                      </div>
                      <span className="absolute bottom-0.5 right-0.5 px-1 bg-black/70 text-white text-xs rounded">
                        {campaign.duration}s
                      </span>
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {campaign.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(campaign.createdAt)}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        getStatusColor(campaign.status),
                      )}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    {formatNumber(campaign.impressions)}
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    {formatNumber(campaign.views)}
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    {formatNumber(campaign.clicks)}
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    {formatCurrency(campaign.spend)}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setIsViewModalOpen(true);
                      }}
                      className="p-1.5 text-muted-foreground hover:text-foreground"
                      title="View Campaign"
                    >
                      <Icons.Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <Icons.Campaign size={48} className="text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">No campaigns found</p>
            <Link href="/campaigns/create">
              <Button className="mt-4" leftIcon={<Icons.Plus size={18} />}>
                Create Your First Campaign
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* View Campaign Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Campaign Details"
        size="lg"
      >
        {selectedCampaign && (
          <div className="space-y-6">
            {/* Video Preview */}
            <div className="bg-muted rounded-lg p-4">
              {selectedCampaign.videoUrl ? (
                <video
                  src={selectedCampaign.videoUrl}
                  controls
                  className="w-full max-h-80 mx-auto rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-48 bg-black/10 rounded-lg">
                  <Icons.Video size={48} className="text-muted-foreground" />
                </div>
              )}
              <p className="text-sm text-muted-foreground text-center mt-2">
                Video Preview - {selectedCampaign.duration}s
              </p>
            </div>

            {/* Campaign Info */}
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {selectedCampaign.name}
              </h3>
              <p className="text-muted-foreground mt-1">
                {selectedCampaign.description}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  getStatusColor(selectedCampaign.status),
                )}
              >
                {selectedCampaign.status}
              </span>
              <span className="text-sm text-muted-foreground">
                Created on {formatDate(selectedCampaign.createdAt)}
              </span>
            </div>

            {/* Campaign Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(selectedCampaign.impressions)}
                </p>
                <p className="text-sm text-muted-foreground">Impressions</p>
              </div>
              <div className="bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(selectedCampaign.views)}
                </p>
                <p className="text-sm text-muted-foreground">Views</p>
              </div>
              <div className="bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(selectedCampaign.clicks)}
                </p>
                <p className="text-sm text-muted-foreground">Clicks</p>
              </div>
              <div className="bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(selectedCampaign.spend)}
                </p>
                <p className="text-sm text-muted-foreground">Budget Spent</p>
              </div>
            </div>

            {/* Target URL */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Target URL
              </p>
              <a
                href={selectedCampaign.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {selectedCampaign.targetUrl}
              </a>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
              {selectedCampaign.status === "active" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handlePause(selectedCampaign);
                    setIsViewModalOpen(false);
                  }}
                  leftIcon={<Icons.Pause size={14} />}
                >
                  Pause
                </Button>
              )}
              {selectedCampaign.status === "paused" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handlePause(selectedCampaign);
                    setIsViewModalOpen(false);
                  }}
                  leftIcon={<Icons.Play size={14} />}
                >
                  Restart
                </Button>
              )}
              {selectedCampaign.status === "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleRestart(selectedCampaign);
                    setIsViewModalOpen(false);
                  }}
                  leftIcon={<Icons.Play size={14} />}
                >
                  Activate
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsDeleteModalOpen(true);
                }}
                leftIcon={<Icons.Trash size={14} />}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Campaign"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete{" "}
            <strong>{selectedCampaign?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const CampaignsPage: React.FC = () => {
  return (
    <DashboardLayout title="Campaigns">
      <CampaignsPageContent />
    </DashboardLayout>
  );
};

export default CampaignsPage;
