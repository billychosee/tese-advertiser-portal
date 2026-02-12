"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { Icons } from "@/components/ui/Icons";
import { advertiserApi } from "@/services/api";
import { formatDate, cn } from "@/utils";
import { Advertiser } from "@/types";

const ProfilePage: React.FC = () => {
  const [advertiser, setAdvertiser] = useState<Advertiser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "activity" | "security"
  >("overview");
  // Security tab states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  // Edit profile states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    contactName: "",
    companyName: "",
    phone: "",
    address: "",
    logo: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  // Password form state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [show2FASetup, setShow2FASetup] = useState(false);

  useEffect(() => {
    loadAdvertiser();
  }, []);

  useEffect(() => {
    if (showEditModal && advertiser?.logo) {
      setLogoPreview(advertiser.logo);
    }
  }, [showEditModal, advertiser?.logo]);

  const loadAdvertiser = async () => {
    setIsLoading(true);
    try {
      const data = await advertiserApi.getProfile();
      setAdvertiser(data);
      // Initialize edit form
      setEditForm({
        contactName: data.contactName || "",
        companyName: data.companyName || "",
        phone: data.phone || "",
        address: data.address || "",
        logo: data.logo || "",
      });
      setLogoPreview(data.logo || null);
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

  // Security handlers
  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters",
      });
      return;
    }

    setIsChangingPassword(true);
    setMessage(null);

    try {
      await advertiserApi.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );
      setMessage({ type: "success", text: "Password changed successfully" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordModal(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to change password",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    setMessage(null);

    try {
      const { qrCode: qr } = await advertiserApi.enable2FA();
      setQrCode(qr);
      setShow2FASetup(true);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to enable 2FA" });
    } finally {
      setIsEnabling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      setMessage({ type: "error", text: "Please enter a 6-digit code" });
      return;
    }

    setIsEnabling2FA(true);
    try {
      const isValid = await advertiserApi.verify2FA(verificationCode);
      if (isValid) {
        setTwoFactorEnabled(true);
        setMessage({ type: "success", text: "2FA enabled successfully" });
        setShow2FASetup(false);
        setVerificationCode("");
        setQrCode(null);
      } else {
        setMessage({ type: "error", text: "Invalid verification code" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to verify code" });
    } finally {
      setIsEnabling2FA(false);
    }
  };

  const handleSignOutAllSessions = async () => {
    if (!confirm("Are you sure you want to sign out of all other sessions?")) {
      return;
    }

    setIsSigningOut(true);
    setMessage(null);

    try {
      await advertiserApi.signOutAllSessions();
      setMessage({ type: "success", text: "Signed out of all other sessions" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to sign out sessions" });
    } finally {
      setIsSigningOut(false);
    }
  };

  const closeMessage = () => setMessage(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image must be less than 2MB" });
        return;
      }
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setEditForm({ ...editForm, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setSelectedLogo(null);
    setLogoPreview(null);
    setEditForm({ ...editForm, logo: "" });
  };

  const handleUpdateProfile = async () => {
    if (!editForm.contactName.trim()) {
      setMessage({ type: "error", text: "Contact name is required" });
      return;
    }

    setIsSavingProfile(true);
    setMessage(null);

    try {
      const updated = await advertiserApi.updateProfile(editForm);
      setAdvertiser(updated);
      setLogoPreview(null);
      setSelectedLogo(null);
      setMessage({ type: "success", text: "Profile updated successfully" });
      setShowEditModal(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Profile">
        <div className="flex items-center justify-center h-64">
          <Icons.Loader size={32} className="animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile">
      {message && (
        <div
          className={cn(
            "mb-4 p-4 rounded-lg flex items-center gap-2",
            message.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
          )}
        >
          {message.type === "success" ? (
            <Icons.Check size={18} />
          ) : (
            <Icons.AlertCircle size={18} />
          )}
          <span className="flex-1">{message.text}</span>
          <button onClick={closeMessage} className="hover:opacity-70">
            <Icons.Close size={18} />
          </button>
        </div>
      )}

      {/* Profile Header */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt={advertiser?.contactName || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : advertiser?.logo ? (
              <img
                src={advertiser.logo}
                alt={advertiser.contactName || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <Icons.User size={40} className="text-primary" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
              <h2 className="text-2xl font-semibold text-foreground">
                {advertiser?.contactName || "User"}
              </h2>
              <Badge
                variant={getKYCStatusVariant(
                  advertiser?.kycStatus || "pending",
                )}
              >
                {advertiser?.kycStatus || "pending"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {advertiser?.companyName || "Individual Advertiser"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Member since{" "}
              {formatDate(advertiser?.createdAt || new Date().toISOString())}
            </p>
          </div>
          <Button
            variant="outline"
            leftIcon={<Icons.Edit size={16} />}
            onClick={() => setShowEditModal(true)}
          >
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex items-center justify-center gap-3 p-2 bg-card border border-border rounded-2xl mb-6">
        {" "}
        {(
          [
            { id: "overview", label: "Overview", icon: Icons.Users },
            { id: "activity", label: "Activity", icon: Icons.Clock },
            { id: "security", label: "Security", icon: Icons.Lock },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <Card.Header
                title="Personal Information"
                subtitle="Your account details"
              />
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Contact Name
                    </p>
                    <p className="font-medium text-foreground">
                      {advertiser?.contactName || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">
                      {advertiser?.email || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">
                      {advertiser?.phone || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Advertiser Type
                    </p>
                    <p className="font-medium text-foreground capitalize">
                      {advertiser?.type || "individual"}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium text-foreground">
                    {advertiser?.address || "N/A"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card>
              <Card.Header
                title="Account Status"
                subtitle="Your account overview"
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
                  <span className="text-secondary-foreground">
                    Account Type
                  </span>
                  <Badge variant="info">
                    {advertiser?.type || "individual"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-secondary-foreground">
                    Member Since
                  </span>
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

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <Card>
          <Card.Header
            title="Recent Activity"
            subtitle="Your account activity"
          />
          <div className="space-y-4">
            {[
              {
                icon: Icons.FileText,
                title: "Campaign Created",
                description: "Created new campaign 'Summer Sale 2024'",
                time: "2 hours ago",
              },
              {
                icon: Icons.Wallet,
                title: "Wallet Top-up",
                description: "Added $500.00 to your wallet",
                time: "1 day ago",
              },
              {
                icon: Icons.Check,
                title: "KYC Documents Approved",
                description: "Your identity verification has been approved",
                time: "3 days ago",
              },
              {
                icon: Icons.FileText,
                title: "Campaign Completed",
                description:
                  "Campaign 'Brand Awareness' completed successfully",
                time: "1 week ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <div className="p-3 bg-background rounded-lg flex items-center justify-center">
                  <activity.icon size={20} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <Card.Header title="Password" subtitle="Manage your password" />
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Keep your account secure by using a strong password.
                </p>
                <Button
                  variant="outline"
                  leftIcon={<Icons.Lock size={16} />}
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </Button>
              </div>
            </Card>

            <Card>
              <Card.Header
                title="Two-Factor Authentication"
                subtitle="Extra security"
              />
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled
                    ? "2FA is enabled on your account for added security."
                    : "Add an extra layer of security to your account by enabling two-factor authentication."}
                </p>
                <Button
                  variant="outline"
                  leftIcon={
                    twoFactorEnabled ? (
                      <Icons.Check size={16} />
                    ) : (
                      <Icons.Shield size={16} />
                    )
                  }
                  onClick={handleEnable2FA}
                  isLoading={isEnabling2FA}
                  disabled={twoFactorEnabled}
                >
                  {twoFactorEnabled ? "2FA Enabled" : "Enable 2FA"}
                </Button>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <Card.Header title="Sessions" subtitle="Active sessions" />
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-background rounded-lg">
                      <Icons.Laptop
                        size={20}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Current Session
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Chrome on Windows • Johannesburg, South Africa
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={handleSignOutAllSessions}
                  isLoading={isSigningOut}
                  leftIcon={<Icons.Logout size={16} />}
                >
                  Sign Out All Other Sessions
                </Button>
              </div>
            </Card>
          </div>

          {/* Change Password Modal */}
          <Modal
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            title="Change Password"
            size="sm"
          >
            <div className="space-y-4">
              <Input
                type="password"
                label="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="Enter current password"
                showPasswordToggle
              />
              <Input
                type="password"
                label="New Password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                placeholder="Enter new password"
                showPasswordToggle
              />
              <Input
                type="password"
                label="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Confirm new password"
                showPasswordToggle
              />
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleChangePassword}
                  isLoading={isChangingPassword}
                >
                  Change Password
                </Button>
              </div>
            </div>
          </Modal>

          {/* 2FA Setup Modal */}
          <Modal
            isOpen={show2FASetup}
            onClose={() => {
              setShow2FASetup(false);
              setQrCode(null);
              setVerificationCode("");
            }}
            title="Set Up Two-Factor Authentication"
            size="sm"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Scan the QR code below with your authenticator app, then enter
                the verification code.
              </p>
              <div className="flex justify-center p-4 bg-background rounded-lg">
                {qrCode && (
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                    <img
                      src={qrCode}
                      alt="2FA QR Code"
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
              <Input
                label="Verification Code"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShow2FASetup(false);
                    setQrCode(null);
                    setVerificationCode("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleVerify2FA}
                  isLoading={isEnabling2FA}
                  disabled={verificationCode.length !== 6}
                >
                  Verify & Enable
                </Button>
              </div>
            </div>
          </Modal>

          {/* Edit Profile Modal */}
          <Modal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedLogo(null);
              setLogoPreview(null);
            }}
            title="Edit Profile"
            size="md"
          >
            <div className="space-y-4">
              {/* Logo Upload */}
              <div className="flex flex-col items-center pb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icons.User size={40} className="text-primary" />
                    )}
                  </div>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-1 -right-1 p-1 bg-destructive text-white rounded-full hover:bg-destructive/80 transition-colors"
                    >
                      <Icons.Close size={14} />
                    </button>
                  )}
                </div>
                <label
                  htmlFor="logo-upload"
                  className="mt-3 text-sm text-primary hover:text-primary/80 cursor-pointer font-medium"
                >
                  {logoPreview ? "Change Photo" : "Upload Photo"}
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max 2MB, PNG or JPG
                </p>
              </div>

              <Input
                label="Contact Name"
                value={editForm.contactName}
                onChange={(e) =>
                  setEditForm({ ...editForm, contactName: e.target.value })
                }
                placeholder="Enter your name"
                required
              />
              <Input
                label="Company Name"
                value={editForm.companyName}
                onChange={(e) =>
                  setEditForm({ ...editForm, companyName: e.target.value })
                }
                placeholder="Enter company name (optional)"
              />
              <Input
                label="Phone"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Address
                </label>
                <textarea
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  placeholder="Enter your address"
                  rows={3}
                  className="block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedLogo(null);
                    setLogoPreview(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleUpdateProfile}
                  isLoading={isSavingProfile}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </DashboardLayout>
  );
};

export default ProfilePage;
