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
  WeeklyMetrics,
  YearlyMetrics,
  Role,
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
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&h=300&fit=crop",
    creatorCount: 1250,
    isActive: true,
  },
  {
    id: "cat-2",
    name: "Drama",
    description: "Drama series and movies",
    icon: "🎭",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=300&fit=crop",
    creatorCount: 890,
    isActive: true,
  },
  {
    id: "cat-3",
    name: "Music",
    description: "Music videos and performances",
    icon: "🎵",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
    creatorCount: 2100,
    isActive: true,
  },
  {
    id: "cat-4",
    name: "Sports",
    description: "Sports highlights and commentary",
    icon: "⚽",
    image: "https://images.unsplash.com/photo-1461896836934- voices-of-the-deep?w=400&h=300&fit=crop",
    creatorCount: 750,
    isActive: true,
  },
  {
    id: "cat-5",
    name: "News",
    description: "News and current affairs",
    icon: "📰",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
    creatorCount: 450,
    isActive: true,
  },
  {
    id: "cat-6",
    name: "Fitness",
    description: "Workout and health content",
    icon: "💪",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop",
    creatorCount: 680,
    isActive: true,
  },
  {
    id: "cat-7",
    name: "Education",
    description: "Educational tutorials",
    icon: "📚",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
    creatorCount: 920,
    isActive: true,
  },
  {
    id: "cat-8",
    name: "Gaming",
    description: "Gaming content and streams",
    icon: "🎮",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop",
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
    avatar: "https://i.pravatar.cc/150?u=cr-1",
    subscriberCount: 500000,
    categoryIds: ["cat-1", "cat-3"],
    isActive: true,
  },
  {
    id: "cr-2",
    name: "Jane Smith",
    channelName: "@janesmith",
    avatar: "https://i.pravatar.cc/150?u=cr-2",
    subscriberCount: 350000,
    categoryIds: ["cat-2"],
    isActive: true,
  },
  {
    id: "cr-3",
    name: "Mike Johnson",
    channelName: "@mikej",
    avatar: "https://i.pravatar.cc/150?u=cr-3",
    subscriberCount: 800000,
    categoryIds: ["cat-4", "cat-8"],
    isActive: true,
  },
  {
    id: "cr-4",
    name: "Sarah Williams",
    channelName: "@sarahw",
    avatar: "https://i.pravatar.cc/150?u=cr-4",
    subscriberCount: 250000,
    categoryIds: ["cat-6"],
    isActive: true,
  },
  {
    id: "cr-5",
    name: "Tom Brown",
    channelName: "@tombrown",
    avatar: "https://i.pravatar.cc/150?u=cr-5",
    subscriberCount: 600000,
    categoryIds: ["cat-7", "cat-1"],
    isActive: true,
  },
  {
    id: "cr-6",
    name: "Emily Davis",
    channelName: "@emilyd",
    avatar: "https://i.pravatar.cc/150?u=cr-6",
    subscriberCount: 420000,
    categoryIds: ["cat-3", "cat-5"],
    isActive: true,
  },
  {
    id: "cr-7",
    name: "Chris Wilson",
    channelName: "@chrisw",
    avatar: "https://i.pravatar.cc/150?u=cr-7",
    subscriberCount: 950000,
    categoryIds: ["cat-8"],
    isActive: true,
  },
  {
    id: "cr-8",
    name: "Lisa Anderson",
    channelName: "@lisaa",
    avatar: "https://i.pravatar.cc/150?u=cr-8",
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
  currency: "USD",
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
    currency: "USD",
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
    currency: "USD",
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
    currency: "USD",
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
    currency: "USD",
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
    currency: "USD",
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
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
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
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
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
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
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
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
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
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",
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
    impressions: 32000,
    views: 16000,
    clicks: 1280,
    spend: 1600,
  },
  {
    date: "2024-02-11",
    impressions: 30000,
    views: 15000,
    clicks: 1200,
    spend: 1500,
  },
  {
    date: "2024-02-12",
    impressions: 27000,
    views: 13500,
    clicks: 1080,
    spend: 1350,
  },
  {
    date: "2024-02-13",
    impressions: 24000,
    views: 12000,
    clicks: 960,
    spend: 1200,
  },
  {
    date: "2024-02-14",
    impressions: 21000,
    views: 10500,
    clicks: 840,
    spend: 1050,
  },
];

// ============================================
// Mock Weekly Metrics
// ============================================

export const mockWeeklyMetrics: WeeklyMetrics[] = [
  {
    week: "Week 1",
    startDate: "2024-02-01",
    endDate: "2024-02-07",
    impressions: 117000,
    views: 58500,
    clicks: 4680,
    spend: 5850,
  },
  {
    week: "Week 2",
    startDate: "2024-02-08",
    endDate: "2024-02-14",
    impressions: 181000,
    views: 90500,
    clicks: 7240,
    spend: 9050,
  },
];

// ============================================
// Mock Yearly Metrics
// ============================================

export const mockYearlyMetrics: YearlyMetrics[] = [
  {
    year: 2024,
    month: "Jan",
    impressions: 450000,
    views: 225000,
    clicks: 18000,
    spend: 22500,
  },
  {
    year: 2024,
    month: "Feb",
    impressions: 298000,
    views: 149000,
    clicks: 11920,
    spend: 14900,
  },
];

// ============================================
// Mock Campaign Reports
// ============================================

export const mockCampaignReports: CampaignReport[] = [
  {
    campaignId: "camp-1",
    campaignName: "Summer Sale Promo",
    date: "2024-02-01",
    impressions: 12000,
    views: 6000,
    clicks: 480,
    ctr: 4.0,
    spend: 600,
    cpc: 1.25,
    cpm: 50.0,
  },
  {
    campaignId: "camp-1",
    campaignName: "Summer Sale Promo",
    date: "2024-02-02",
    impressions: 15000,
    views: 7500,
    clicks: 600,
    ctr: 4.0,
    spend: 750,
    cpc: 1.25,
    cpm: 50.0,
  },
  {
    campaignId: "camp-2",
    campaignName: "New Product Launch",
    date: "2024-02-05",
    impressions: 8000,
    views: 4000,
    clicks: 320,
    ctr: 4.0,
    spend: 450,
    cpc: 1.41,
    cpm: 56.25,
  },
  {
    campaignId: "camp-2",
    campaignName: "New Product Launch",
    date: "2024-02-06",
    impressions: 10000,
    views: 5000,
    clicks: 400,
    ctr: 4.0,
    spend: 562.5,
    cpc: 1.41,
    cpm: 56.25,
  },
];

// ============================================
// Mock Spend Reports
// ============================================

export const mockSpendReports: SpendReport[] = [
  {
    campaignId: "camp-1",
    campaignName: "Summer Sale Promo",
    totalBudget: 5000,
    spent: 2500,
    remaining: 2500,
    startDate: "2024-02-01",
    endDate: "2024-02-11",
  },
  {
    campaignId: "camp-2",
    campaignName: "New Product Launch",
    totalBudget: 8000,
    spent: 1800,
    remaining: 6200,
    startDate: "2024-02-05",
    endDate: "2024-02-19",
  },
  {
    campaignId: "camp-3",
    campaignName: "Brand Awareness",
    totalBudget: 3000,
    spent: 900,
    remaining: 2100,
    startDate: "2024-02-08",
    endDate: "2024-02-15",
  },
];

// ============================================
// Mock Advertiser Users
// ============================================

export const mockAdvertiserUsers: AdvertiserUser[] = [
  {
    id: "user-1",
    advertiserId: "adv-1",
    email: "john@example.com",
    name: "John Owner",
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
    lastLoginAt: "2024-02-14T09:00:00Z",
  },
  {
    id: "user-2",
    advertiserId: "adv-1",
    email: "sarah@example.com",
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
    createdAt: "2024-01-12T10:00:00Z",
    lastLoginAt: "2024-02-13T14:30:00Z",
  },
  {
    id: "user-3",
    advertiserId: "adv-1",
    email: "mike@example.com",
    name: "Mike Viewer",
    role: "viewer",
    permissions: {
      canCreateCampaigns: false,
      canAccessWallet: false,
      canViewReports: true,
      canManageUsers: false,
      canEditSettings: false,
    },
    isActive: true,
    createdAt: "2024-01-15T12:00:00Z",
    lastLoginAt: "2024-02-10T11:15:00Z",
  },
];

// ============================================
// Mock Roles
// ============================================

export const mockRoles: Role[] = [
  {
    id: "role-1",
    name: "owner",
    description: "Full access to all features",
    isSystem: true,
    permissions: {
      canCreateCampaigns: true,
      canAccessWallet: true,
      canViewReports: true,
      canManageUsers: true,
      canEditSettings: true,
    },
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "role-2",
    name: "manager",
    description: "Can manage campaigns and view reports",
    isSystem: true,
    permissions: {
      canCreateCampaigns: true,
      canAccessWallet: true,
      canViewReports: true,
      canManageUsers: false,
      canEditSettings: false,
    },
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "role-3",
    name: "viewer",
    description: "Read-only access to reports",
    isSystem: true,
    permissions: {
      canCreateCampaigns: false,
      canAccessWallet: false,
      canViewReports: true,
      canManageUsers: false,
      canEditSettings: false,
    },
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
