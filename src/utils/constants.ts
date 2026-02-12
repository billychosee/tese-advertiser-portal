// Demo credentials for testing purposes
export const DEMO_CREDENTIALS = {
  email: "demo@example.com",
  password: "demo123",
};

export const API_ENDPOINTS = {
  // Auth
  login: "/api/auth/login",
  logout: "/api/auth/logout",
  register: "/api/auth/register",

  // Dashboard
  dashboardMetrics: "/api/dashboard/metrics",
  dashboardDailyMetrics: "/api/dashboard/daily-metrics",

  // Campaigns
  campaigns: "/api/campaigns",
  campaignCreate: "/api/campaigns/create",
  campaignPause: (id: string) => `/api/campaigns/${id}/pause`,
  campaignResume: (id: string) => `/api/campaigns/${id}/resume`,
  campaignDelete: (id: string) => `/api/campaigns/${id}`,

  // Wallet
  walletBalance: "/api/wallet/balance",
  walletTransactions: "/api/wallet/transactions",
  walletTopUp: "/api/wallet/topup",

  // Users
  users: "/api/users",

  // Reports
  reports: "/api/reports",
};

export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
};

export const FILE_UPLOAD = {
  maxSizeMB: 10,
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  allowedDocTypes: ["application/pdf"],
};
