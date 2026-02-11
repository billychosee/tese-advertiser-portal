import {
  Advertiser,
  Campaign,
  Category,
  Creator,
  DashboardMetrics,
  Transaction,
  Wallet,
  AdvertiserUser,
  CampaignReport,
  DailyMetrics,
  SpendReport,
} from "@/types";

// ============================================
// Mock Categories (TESE Categories)
// ============================================

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Comedy",
    description: "Funny videos and skits",
    icon: "😄",
    creatorCount: 1250,
    isActive: true,
  },
  {
    id: "cat-2",
    name: "Drama",
    description: "Drama series and movies",
    icon: "🎭",
    creatorCount: 890,
    isActive: true,
  },
  {
    id: "cat-3",
    name: "Music",
    description: "Music videos and performances",
    icon: "🎵",
    creatorCount: 2100,
    isActive: true,
  },
  {
    id: "cat-4",
    name: "Sports",
    description: "Sports highlights and commentary",
    icon: "⚽",
    creatorCount: 750,
    isActive: true,
  },
  {
    id: "cat-5",
    name: "News",
    description: "News and current affairs",
    icon: "📰",
    creatorCount: 450,
    isActive: true,
  },
  {
    id: "cat-6",
    name: "Fitness",
    description: "Workout and health content",
    icon: "💪",
    creatorCount: 680,
    isActive: true,
  },
  {
    id: "cat-7",
    name: "Education",
    description: "Educational tutorials",
    icon: "📚",
    creatorCount: 920,
    isActive: true,
  },
  {
    id: "cat-8",
    name: "Gaming",
    description: "Gaming content and streams",
    icon: "🎮",
    creatorCount: 1850,
    isActive: true,
  },
];

// ============================================
// Mock Creators (TESE Creators)
// ============================================

export const mockCreators: Creator[] = [
  {
    id: "cr-1",
    name: "John Doe",
    channelName: "@johndoe",
    avatar: "/avatars/creator1.png",
    subscriberCount: 500000,
    categoryIds: ["cat-1", "cat-3"],
    isActive: true,
  },
  {
    id: "cr-2",
    name: "Jane Smith",
    channelName: "@janesmith",
    avatar: "/avatars/creator2.png",
    subscriberCount: 350000,
    categoryIds: ["cat-2"],
    isActive: true,
  },
  {
    id: "cr-3",
    name: "Mike Johnson",
    channelName: "@mikej",
    avatar: "/avatars/creator3.png",
    subscriberCount: 800000,
    categoryIds: ["cat-4", "cat-8"],
    isActive: true,
  },
  {
    id: "cr-4",
    name: "Sarah Williams",
    channelName: "@sarahw",
    avatar: "/avatars/creator4.png",
    subscriberCount: 250000,
    categoryIds: ["cat-6"],
    isActive: true,
  },
  {
    id: "cr-5",
    name: "Tom Brown",
    channelName: "@tombrown",
    avatar: "/avatars/creator5.png",
    subscriberCount: 600000,
    categoryIds: ["cat-7", "cat-1"],
    isActive: true,
  },
  {
    id: "cr-6",
    name: "Emily Davis",
    channelName: "@emilyd",
    avatar: "/avatars/creator6.png",
    subscriberCount: 420000,
    categoryIds: ["cat-3", "cat-5"],
    isActive: true,
  },
  {
    id: "cr-7",
    name: "Chris Wilson",
    channelName: "@chrisw",
    avatar: "/avatars/creator7.png",
    subscriberCount: 950000,
    categoryIds: ["cat-8"],
    isActive: true,
  },
  {
    id: "cr-8",
    name: "Lisa Anderson",
    channelName: "@lisaa",
    avatar: "/avatars/creator8.png",
    subscriberCount: 320000,
    categoryIds: ["cat-2", "cat-3"],
    isActive: true,
  },
];

// ============================================
// Mock Advertiser
// ============================================

export const mockAdvertiser: Advertiser = {
  id: "adv-1",
  type: "company",
  email: "marketing@example.com",
  companyName: "Tech Solutions Ltd",
  logo: "/logos/company.png",
  contactName: "John Marketing",
  phone: "+27 11 123 4567",
  address: "123 Business Street, Johannesburg, South Africa",
  kycStatus: "approved",
  kycDocuments: [
    {
      id: "doc-1",
      type: "registration",
      fileName: "registration.pdf",
      fileUrl: "/docs/reg.pdf",
      status: "approved",
      uploadedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "doc-2",
      type: "director_id",
      fileName: "director_id.pdf",
      fileUrl: "/docs/id.pdf",
      status: "approved",
      uploadedAt: "2024-01-15T10:00:00Z",
    },
  ],
  createdAt: "2024-01-10T08:00:00Z",
  updatedAt: "2024-01-20T12:00:00Z",
};

// ============================================
// Mock Wallet
// ============================================

export const mockWallet: Wallet = {
  id: "wallet-1",
  advertiserId: "adv-1",
  balance: 50000,
  currency: "ZAR",
  createdAt: "2024-01-10T08:00:00Z",
  updatedAt: "2024-02-15T10:00:00Z",
};

// ============================================
// Mock Transactions
// ============================================

export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    walletId: "wallet-1",
    type: "topup",
    amount: 10000,
    currency: "ZAR",
    status: "completed",
    description: "Wallet top-up via SmatPay",
    reference: "TXN001",
    createdAt: "2024-02-01T10:00:00Z",
    completedAt: "2024-02-01T10:05:00Z",
  },
  {
    id: "tx-2",
    walletId: "wallet-1",
    type: "spend",
    amount: 2500,
    currency: "ZAR",
    status: "completed",
    description: "Campaign: Summer Sale Promo",
    campaignId: "camp-1",
    createdAt: "2024-02-05T14:00:00Z",
    completedAt: "2024-02-05T14:00:00Z",
  },
  {
    id: "tx-3",
    walletId: "wallet-1",
    type: "topup",
    amount: 5000,
    currency: "ZAR",
    status: "completed",
    description: "Wallet top-up via SmatPay",
    reference: "TXN002",
    createdAt: "2024-02-10T09:00:00Z",
    completedAt: "2024-02-10T09:05:00Z",
  },
  {
    id: "tx-4",
    walletId: "wallet-1",
    type: "spend",
    amount: 1800,
    currency: "ZAR",
    status: "completed",
    description: "Campaign: New Product Launch",
    campaignId: "camp-2",
    createdAt: "2024-02-12T16:00:00Z",
    completedAt: "2024-02-12T16:00:00Z",
  },
  {
    id: "tx-5",
    walletId: "wallet-1",
    type: "spend",
    amount: 3200,
    currency: "ZAR",
    status: "pending",
    description: "Campaign: Brand Awareness",
    campaignId: "camp-3",
    createdAt: "2024-02-14T11:00:00Z",
  },
];

// ============================================
// Mock Campaigns
// ============================================

export const mockCampaigns: Campaign[] = [
  {
    id: "camp-1",
    advertiserId: "adv-1",
    name: "Summer Sale Promo",
    description: "Promote our summer sale across TESE videos",
    type: "category",
    status: "active",
    categoryIds: ["cat-1", "cat-2", "cat-3"],
    videoUrl: "/videos/summer-sale.mp4",
    thumbnailUrl: "/thumbnails/summer-sale.png",
    targetUrl: "https://example.com/summer-sale",
    duration: 15,
    placements: ["pre_roll", "mid_roll"],
    budget: 5000,
    dailyBudget: 500,
    durationDays: 10,
    targetType: "impressions",
    targetValue: 100000,
    impressions: 45000,
    views: 22500,
    clicks: 1800,
    spend: 2500,
    startDate: "2024-02-01",
    endDate: "2024-02-11",
    createdAt: "2024-01-28T10:00:00Z",
    updatedAt: "2024-02-10T14:00:00Z",
  },
  {
    id: "camp-2",
    advertiserId: "adv-1",
    name: "New Product Launch",
    description: "Launch our new smartphone model",
    type: "creator",
    status: "active",
    creatorIds: ["cr-1", "cr-3", "cr-7"],
    videoUrl: "/videos/product-launch.mp4",
    thumbnailUrl: "/thumbnails/product-launch.png",
    targetUrl: "https://example.com/new-phone",
    duration: 30,
    placements: ["pre_roll"],
    budget: 8000,
    durationDays: 14,
    targetType: "clicks",
    targetValue: 5000,
    impressions: 32000,
    views: 16000,
    clicks: 1280,
    spend: 1800,
    startDate: "2024-02-05",
    endDate: "2024-02-19",
    createdAt: "2024-02-03T08:00:00Z",
    updatedAt: "2024-02-12T16:00:00Z",
  },
  {
    id: "camp-3",
    advertiserId: "adv-1",
    name: "Brand Awareness",
    description: "Increase brand visibility among young audiences",
    type: "category",
    status: "paused",
    categoryIds: ["cat-8", "cat-1"],
    videoUrl: "/videos/brand.mp4",
    thumbnailUrl: "/thumbnails/brand.png",
    targetUrl: "https://example.com/brand",
    duration: 20,
    placements: ["mid_roll"],
    budget: 3000,
    durationDays: 7,
    targetType: "impressions",
    targetValue: 50000,
    impressions: 15000,
    views: 7500,
    clicks: 600,
    spend: 900,
    startDate: "2024-02-08",
    endDate: "2024-02-15",
    createdAt: "2024-02-06T12:00:00Z",
    updatedAt: "2024-02-13T10:00:00Z",
  },
  {
    id: "camp-4",
    advertiserId: "adv-1",
    name: "Holiday Special",
    description: "Holiday campaign for December",
    type: "category",
    status: "completed",
    categoryIds: ["cat-2", "cat-4", "cat-5"],
    videoUrl: "/videos/holiday.mp4",
    thumbnailUrl: "/thumbnails/holiday.png",
    targetUrl: "https://example.com/holiday",
    duration: 25,
    placements: ["pre_roll", "mid_roll"],
    budget: 10000,
    durationDays: 30,
    targetType: "impressions",
    targetValue: 200000,
    impressions: 200000,
    views: 100000,
    clicks: 8000,
    spend: 10000,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    createdAt: "2023-11-25T09:00:00Z",
    updatedAt: "2024-01-02T08:00:00Z",
  },
  {
    id: "camp-5",
    advertiserId: "adv-1",
    name: "Fitness App Promo",
    description: "Promote our new fitness mobile app",
    type: "creator",
    status: "pending",
    creatorIds: ["cr-4", "cr-6"],
    videoUrl: "/videos/fitness.mp4",
    thumbnailUrl: "/thumbnails/fitness.png",
    targetUrl: "https://example.com/fitness-app",
    duration: 15,
    placements: ["pre_roll", "mid_roll"],
    budget: 4500,
    durationDays: 14,
    targetType: "clicks",
    targetValue: 3000,
    impressions: 0,
    views: 0,
    clicks: 0,
    spend: 0,
    startDate: "2024-03-01",
    endDate: "2024-03-15",
    createdAt: "2024-02-14T11:00:00Z",
    updatedAt: "2024-02-14T11:00:00Z",
  },
];

// ============================================
// Mock Dashboard Metrics
// ============================================

export const mockDashboardMetrics: DashboardMetrics = {
  activeAds: 2,
  pausedAds: 1,
  totalViews: 143500,
  totalImpressions: 287000,
  totalSpend: 15100,
  totalBudget: 28000,
  walletBalance: 50000,
};

// ============================================
// Mock Daily Metrics (for charts)
// ============================================

export const mockDailyMetrics: DailyMetrics[] = [
  {
    date: "2024-02-01",
    impressions: 12000,
    views: 6000,
    clicks: 480,
    spend: 600,
  },
  {
    date: "2024-02-02",
    impressions: 15000,
    views: 7500,
    clicks: 600,
    spend: 750,
  },
  {
    date: "2024-02-03",
    impressions: 11000,
    views: 5500,
    clicks: 440,
    spend: 550,
  },
  {
    date: "2024-02-04",
    impressions: 18000,
    views: 9000,
    clicks: 720,
    spend: 900,
  },
  {
    date: "2024-02-05",
    impressions: 20000,
    views: 10000,
    clicks: 800,
    spend: 1000,
  },
  {
    date: "2024-02-06",
    impressions: 22000,
    views: 11000,
    clicks: 880,
    spend: 1100,
  },
  {
    date: "2024-02-07",
    impressions: 19000,
    views: 9500,
    clicks: 760,
    spend: 950,
  },
  {
    date: "2024-02-08",
    impressions: 25000,
    views: 12500,
    clicks: 1000,
    spend: 1250,
  },
  {
    date: "2024-02-09",
    impressions: 28000,
    views: 14000,
    clicks: 1120,
    spend: 1400,
  },
  {
    date: "2024-02-10",
    impressions: 26000,
    views: 13000,
    clicks: 1040,
    spend: 1300,
  },
];

export const mockWeeklyMetrics: DailyMetrics[] = [
  {
    date: "Week 1",
    impressions: 85000,
    views: 42500,
    clicks: 3400,
    spend: 4250,
  },
  {
    date: "Week 2",
    impressions: 120000,
    views: 60000,
    clicks: 4800,
    spend: 6000,
  },
  {
    date: "Week 3",
    impressions: 98000,
    views: 49000,
    clicks: 3920,
    spend: 4900,
  },
  {
    date: "Week 4",
    impressions: 145000,
    views: 72500,
    clicks: 5800,
    spend: 7250,
  },
];

export const mockYearlyMetrics: DailyMetrics[] = [
  {
    date: "Jan",
    impressions: 450000,
    views: 225000,
    clicks: 18000,
    spend: 22500,
  },
  {
    date: "Feb",
    impressions: 520000,
    views: 260000,
    clicks: 20800,
    spend: 26000,
  },
  {
    date: "Mar",
    impressions: 480000,
    views: 240000,
    clicks: 19200,
    spend: 24000,
  },
  {
    date: "Apr",
    impressions: 590000,
    views: 295000,
    clicks: 23600,
    spend: 29500,
  },
  {
    date: "May",
    impressions: 620000,
    views: 310000,
    clicks: 24800,
    spend: 31000,
  },
  {
    date: "Jun",
    impressions: 550000,
    views: 275000,
    clicks: 22000,
    spend: 27500,
  },
];

// ============================================
// Mock Campaign Reports
// ============================================

export const mockCampaignReports: CampaignReport[] = mockCampaigns.map(
  (campaign) => ({
    campaignId: campaign.id,
    campaignName: campaign.name,
    date: new Date().toISOString().split("T")[0],
    impressions: campaign.impressions,
    views: campaign.views,
    clicks: campaign.clicks,
    ctr:
      campaign.impressions > 0
        ? (campaign.clicks / campaign.impressions) * 100
        : 0,
    spend: campaign.spend,
    cpc: campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0,
    cpm:
      campaign.impressions > 0
        ? (campaign.spend / campaign.impressions) * 1000
        : 0,
  }),
);

// ============================================
// Mock Spend Reports
// ============================================

export const mockSpendReports: SpendReport[] = mockCampaigns.map(
  (campaign) => ({
    campaignId: campaign.id,
    campaignName: campaign.name,
    totalBudget: campaign.budget,
    spent: campaign.spend,
    remaining: campaign.budget - campaign.spend,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
  }),
);

// ============================================
// Mock Team Users
// ============================================

export const mockTeamUsers: AdvertiserUser[] = [
  {
    id: "user-1",
    advertiserId: "adv-1",
    email: "owner@example.com",
    name: "John Marketing",
    role: "owner",
    permissions: {
      canCreateCampaigns: true,
      canAccessWallet: true,
      canViewReports: true,
      canManageUsers: true,
      canEditSettings: true,
    },
    isActive: true,
    createdAt: "2024-01-10T08:00:00Z",
    lastLoginAt: "2024-02-15T09:00:00Z",
  },
  {
    id: "user-2",
    advertiserId: "adv-1",
    email: "manager@example.com",
    name: "Sarah Manager",
    role: "manager",
    permissions: {
      canCreateCampaigns: true,
      canAccessWallet: true,
      canViewReports: true,
      canManageUsers: false,
      canEditSettings: false,
    },
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    lastLoginAt: "2024-02-14T16:00:00Z",
  },
  {
    id: "user-3",
    advertiserId: "adv-1",
    email: "viewer@example.com",
    name: "Tom Viewer",
    role: "viewer",
    permissions: {
      canCreateCampaigns: false,
      canAccessWallet: false,
      canViewReports: true,
      canManageUsers: false,
      canEditSettings: false,
    },
    isActive: true,
    createdAt: "2024-02-01T12:00:00Z",
    lastLoginAt: "2024-02-13T11:00:00Z",
  },
];
