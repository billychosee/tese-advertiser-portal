"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Icons } from "@/components/ui/Icons";
import { campaignsApi } from "@/services/api";
import {
  formatCurrency,
  formatNumber,
  formatDate,
  getCampaignStatusColor,
  cn,
} from "@/utils";
import { Campaign, CampaignStatus } from "@/types";

const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">(
    "all",
  );

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const data = await campaignsApi.getAll();
    setCampaigns(data);
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

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus && campaign.status !== "deleted";
  });

  const getStatusBadgeVariant = (status: CampaignStatus) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "pending":
        return "info";
      case "completed":
        return "default";
      case "suspended":
      case "deleted":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <DashboardLayout title="Campaigns">
      {/* Header */}
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
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as CampaignStatus | "all")
              }
              className="px-4 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Active",
            value: campaigns.filter((c) => c.status === "active").length,
            color: "bg-green-500/10 text-green-500",
          },
          {
            label: "Paused",
            value: campaigns.filter((c) => c.status === "paused").length,
            color: "bg-accent/10 text-accent",
          },
          {
            label: "Pending",
            value: campaigns.filter((c) => c.status === "pending").length,
            color: "bg-blue-500/10 text-blue-500",
          },
          {
            label: "Completed",
            value: campaigns.filter((c) => c.status === "completed").length,
            color: "bg-muted text-muted-foreground",
          },
        ].map((stat) => (
          <Card key={stat.label} padding="sm">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label} Campaigns</p>
          </Card>
        ))}
      </div>

      {/* Campaigns Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Campaign
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Impressions
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Views
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Clicks
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Budget
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Spend
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
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
                    <Badge variant={getStatusBadgeVariant(campaign.status)}>
                      {campaign.status}
                    </Badge>
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
                    {formatCurrency(campaign.budget)}
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    {formatCurrency(campaign.spend)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-1">
                      <Link href={`/campaigns/${campaign.id}`}>
                        <button className="p-1.5 text-muted-foreground hover:text-foreground">
                          <Icons.Eye size={16} />
                        </button>
                      </Link>
                      {campaign.status !== "pending" &&
                        campaign.status !== "completed" && (
                          <button
                            onClick={() => handlePause(campaign)}
                            className="p-1.5 text-muted-foreground hover:text-foreground"
                          >
                            {campaign.status === "active" ? (
                              <Icons.Pause size={16} />
                            ) : (
                              <Icons.Play size={16} />
                            )}
                          </button>
                        )}
                      <button
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-destructive"
                      >
                        <Icons.Trash size={16} />
                      </button>
                    </div>
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
    </DashboardLayout>
  );
};

export default CampaignsPage;
