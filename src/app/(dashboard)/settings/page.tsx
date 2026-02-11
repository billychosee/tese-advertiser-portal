"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { Icons } from "@/components/ui/Icons";
import { advertiserApi } from "@/services/api";
import { formatDate, formatDateTime, cn } from "@/utils";
import { Advertiser } from "@/types";

const SettingsPage: React.FC = () => {
  const [advertiser, setAdvertiser] = useState<Advertiser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "kyc" | "notifications"
  >("profile");
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadAdvertiser();
  }, []);

  const loadAdvertiser = async () => {
    const data = await advertiserApi.getProfile();
    setAdvertiser(data);
    setFormData({
      companyName: data.companyName || "",
      contactName: data.contactName,
      phone: data.phone,
      address: data.address,
    });
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await advertiserApi.updateProfile(formData);
      await loadAdvertiser();
    } finally {
      setIsLoading(false);
    }
  };

  const getKYCStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <DashboardLayout title="Settings">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors",
            activeTab === "profile"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("kyc")}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors",
            activeTab === "kyc"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          KYC Documents
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors",
            activeTab === "notifications"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          Notifications
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <Card.Header
                title="Company Information"
                subtitle="Update your advertiser details"
              />
              <div className="space-y-4">
                <Input
                  label="Company Name"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  placeholder="Enter company name"
                />
                <Input
                  label="Contact Name"
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                  placeholder="Enter contact name"
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter address"
                    className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-foreground"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveProfile} isLoading={isLoading}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card>
              <Card.Header
                title="Account Status"
                subtitle="Your advertiser account"
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-secondary-foreground">KYC Status</span>
                  <Badge
                    variant={getKYCStatusVariant(
                      advertiser?.kycStatus || "pending",
                    )}
                  >
                    {advertiser?.kycStatus || "pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-secondary-foreground">Advertiser Type</span>
                  <Badge variant="info">
                    {advertiser?.type || "individual"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-secondary-foreground">Member Since</span>
                  <span className="text-foreground font-medium">
                    {formatDate(
                      advertiser?.createdAt || new Date().toISOString(),
                    )}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* KYC Tab */}
      {activeTab === "kyc" && (
        <Card>
          <Card.Header
            title="KYC Documents"
            subtitle="Your verification documents"
            action={
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Icons.Upload size={16} />}
              >
                Upload New
              </Button>
            }
          />
          <div className="space-y-4">
            {advertiser?.kycDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-background rounded-lg flex items-center justify-center">
                    <Icons.Image size={24} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{doc.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={getKYCStatusVariant(doc.status)}>
                    {doc.status}
                  </Badge>
                  <button className="p-2 text-muted-foreground hover:text-foreground">
                    <Icons.Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 rounded-lg">
            <div className="flex gap-3">
              <Icons.Info
                size={20}
                className="text-blue-500 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-blue-500">
                  KYC Verification
                </p>
                <p className="text-sm text-blue-500/80 mt-1">
                  Your documents are being reviewed. This typically takes 1-2
                  business days. You'll be notified once the verification is
                  complete.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <Card>
          <Card.Header
            title="Notification Preferences"
            subtitle="Choose how you want to be notified"
          />
          <div className="space-y-6">
            {[
              {
                id: "campaign",
                title: "Campaign Updates",
                description:
                  "Get notified about campaign performance and status changes",
              },
              {
                id: "budget",
                title: "Budget Alerts",
                description: "Receive alerts when your wallet balance is low",
              },
              {
                id: "approval",
                title: "KYC Updates",
                description: "Get notified about your KYC verification status",
              },
              {
                id: "reports",
                title: "Weekly Reports",
                description: "Receive weekly performance reports via email",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-input peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-input after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-6">
            <Button>Save Preferences</Button>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default SettingsPage;
