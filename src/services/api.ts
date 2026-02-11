import axios from 'axios';
import {
  Advertiser,
  AdvertiserUser,
  ApiResponse,
  AuthResponse,
  Campaign,
  Category,
  Creator,
  DashboardMetrics,
  LoginCredentials,
  PaginatedResponse,
  SpendReport,
  Transaction,
  Wallet,
  CampaignReport,
  DailyMetrics,
} from '@/types';
import {
  mockAdvertiser,
  mockCampaigns,
  mockCategories,
  mockCreators,
  mockDashboardMetrics,
  mockDailyMetrics,
  mockSpendReports,
  mockTeamUsers,
  mockTransactions,
  mockCampaignReports,
  mockWallet,
} from './mockData';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// Auth API
// ============================================

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate API call delay
    await delay(500);
    
    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      return {
        user: {
          id: 'user-1',
          email: credentials.email,
          name: 'Demo User',
          role: 'advertiser',
          advertiserId: 'adv-1',
        },
        token: 'mock-jwt-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
    }
    throw new Error('Invalid credentials');
  },

  logout: async (): Promise<void> => {
    await delay(200);
  },

  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    await delay(300);
    return {
      id: 'user-1',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'advertiser',
      advertiserId: 'adv-1',
    };
  },
};

// ============================================
// Categories API
// ============================================

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    await delay(300);
    return mockCategories;
  },

  getById: async (id: string): Promise<Category | undefined> => {
    await delay(200);
    return mockCategories.find((cat) => cat.id === id);
  },
};

// ============================================
// Creators API
// ============================================

export const creatorsApi = {
  getAll: async (): Promise<Creator[]> => {
    await delay(300);
    return mockCreators;
  },

  getById: async (id: string): Promise<Creator | undefined> => {
    await delay(200);
    return mockCreators.find((cr) => cr.id === id);
  },

  search: async (query: string): Promise<Creator[]> => {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return mockCreators.filter(
      (cr) =>
        cr.name.toLowerCase().includes(lowerQuery) ||
        cr.channelName.toLowerCase().includes(lowerQuery)
    );
  },
};

// ============================================
// Wallet API
// ============================================

export const walletApi = {
  getBalance: async (): Promise<Wallet> => {
    await delay(300);
    return mockWallet;
  },

  getTransactions: async (page = 1, pageSize = 10): Promise<PaginatedResponse<Transaction>> => {
    await delay(400);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = mockTransactions.slice(start, end);
    
    return {
      data,
      total: mockTransactions.length,
      page,
      pageSize,
      totalPages: Math.ceil(mockTransactions.length / pageSize),
    };
  },

  topUp: async (amount: number, paymentMethod: string): Promise<Transaction> => {
    await delay(800);
    const transaction: Transaction = {
      id: 'tx-' + Date.now(),
      walletId: mockWallet.id,
      type: 'topup',
      amount,
      currency: 'ZAR',
      status: 'completed',
      description: 'Wallet top-up via ' + paymentMethod,
      reference: 'TXN' + Date.now(),
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    
    // Update mock wallet balance
    mockWallet.balance += amount;
    mockWallet.updatedAt = new Date().toISOString();
    
    return transaction;
  },
};

// ============================================
// Campaigns API
// ============================================

export const campaignsApi = {
  getAll: async (): Promise<Campaign[]> => {
    await delay(400);
    return mockCampaigns;
  },

  getById: async (id: string): Promise<Campaign | undefined> => {
    await delay(300);
    return mockCampaigns.find((camp) => camp.id === id);
  },

  create: async (campaign: Partial<Campaign>): Promise<Campaign> => {
    await delay(600);
    const newCampaign: Campaign = {
      id: 'camp-' + Date.now(),
      advertiserId: 'adv-1',
      name: campaign.name || '',
      description: campaign.description,
      type: campaign.type || 'category',
      status: 'pending',
      categoryIds: campaign.categoryIds,
      creatorIds: campaign.creatorIds,
      videoUrl: campaign.videoUrl || '',
      thumbnailUrl: campaign.thumbnailUrl,
      targetUrl: campaign.targetUrl || '',
      duration: campaign.duration || 15,
      placements: campaign.placements || ['pre_roll'],
      budget: campaign.budget || 0,
      dailyBudget: campaign.dailyBudget,
      durationDays: campaign.durationDays || 7,
      targetType: campaign.targetType || 'impressions',
      targetValue: campaign.targetValue || 0,
      impressions: 0,
      views: 0,
      clicks: 0,
      spend: 0,
      startDate: campaign.startDate || new Date().toISOString().split('T')[0],
      endDate: campaign.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockCampaigns.push(newCampaign);
    return newCampaign;
  },

  update: async (id: string, updates: Partial<Campaign>): Promise<Campaign> => {
    await delay(400);
    const index = mockCampaigns.findIndex((camp) => camp.id === id);
    if (index === -1) throw new Error('Campaign not found');
    
    mockCampaigns[index] = {
      ...mockCampaigns[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return mockCampaigns[index];
  },

  pause: async (id: string): Promise<Campaign> => {
    await delay(300);
    return campaignsApi.update(id, { status: 'paused' });
  },

  resume: async (id: string): Promise<Campaign> => {
    await delay(300);
    return campaignsApi.update(id, { status: 'active' });
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockCampaigns.findIndex((camp) => camp.id === id);
    if (index !== -1) {
      mockCampaigns[index].status = 'deleted';
    }
  },
};

// ============================================
// Dashboard API
// ============================================

export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    await delay(400);
    return mockDashboardMetrics;
  },

  getDailyMetrics: async (period: 'daily' | 'weekly' | 'yearly' = 'daily'): Promise<DailyMetrics[]> => {
    await delay(350);
    return mockDailyMetrics;
  },
};

// ============================================
// Reports API
// ============================================

export const reportsApi = {
  getCampaignReports: async (campaignId?: string): Promise<CampaignReport[]> => {
    await delay(400);
    if (campaignId) {
      return mockCampaignReports.filter((r) => r.campaignId === campaignId);
    }
    return mockCampaignReports;
  },

  getSpendReports: async (): Promise<SpendReport[]> => {
    await delay(350);
    return mockSpendReports;
  },

  exportCampaignReport: async (campaignId: string): Promise<Blob> => {
    await delay(500);
    const report = mockCampaignReports.find((r) => r.campaignId === campaignId);
    if (!report) throw new Error('Report not found');
    
    // Create CSV content
    const headers = ['Campaign Name', 'Date', 'Impressions', 'Views', 'Clicks', 'CTR', 'Spend', 'CPC', 'CPM'];
    const values = [
      report.campaignName,
      report.date,
      report.impressions,
      report.views,
      report.clicks,
      report.ctr.toFixed(2),
      report.spend.toFixed(2),
      report.cpc.toFixed(2),
      report.cpm.toFixed(2),
    ];
    
    const csv = [headers.join(','), values.join(',')].join('\n');
    return new Blob([csv], { type: 'text/csv' });
  },

  exportSpendReport: async (): Promise<Blob> => {
    await delay(500);
    
    // Create CSV content
    const headers = ['Campaign Name', 'Total Budget', 'Spent', 'Remaining', 'Start Date', 'End Date'];
    const rows = mockSpendReports.map((r) => [
      r.campaignName,
      r.totalBudget,
      r.spent,
      r.remaining,
      r.startDate,
      r.endDate,
    ]);
    
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return new Blob([csv], { type: 'text/csv' });
  },
};

// ============================================
// Users API
// ============================================

export const usersApi = {
  getAll: async (): Promise<AdvertiserUser[]> => {
    await delay(300);
    return mockTeamUsers;
  },

  getById: async (id: string): Promise<AdvertiserUser | undefined> => {
    await delay(200);
    return mockTeamUsers.find((u) => u.id === id);
  },

  create: async (user: Partial<AdvertiserUser>): Promise<AdvertiserUser> => {
    await delay(400);
    const newUser: AdvertiserUser = {
      id: 'user-' + Date.now(),
      advertiserId: 'adv-1',
      email: user.email || '',
      name: user.name || '',
      role: user.role || 'viewer',
      permissions: user.permissions || {
        canCreateCampaigns: false,
        canAccessWallet: false,
        canViewReports: true,
        canManageUsers: false,
        canEditSettings: false,
      },
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    mockTeamUsers.push(newUser);
    return newUser;
  },

  update: async (id: string, updates: Partial<AdvertiserUser>): Promise<AdvertiserUser> => {
    await delay(300);
    const index = mockTeamUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    mockTeamUsers[index] = {
      ...mockTeamUsers[index],
      ...updates,
    };
    
    return mockTeamUsers[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(200);
    const index = mockTeamUsers.findIndex((u) => u.id === id);
    if (index !== -1) {
      mockTeamUsers.splice(index, 1);
    }
  },
};

// ============================================
// Advertiser API
// ============================================

export const advertiserApi = {
  getProfile: async (): Promise<Advertiser> => {
    await delay(300);
    return mockAdvertiser;
  },

  updateProfile: async (updates: Partial<Advertiser>): Promise<Advertiser> => {
    await delay(400);
    Object.assign(mockAdvertiser, updates, { updatedAt: new Date().toISOString() });
    return mockAdvertiser;
  },
};

// ============================================
// Helper Functions
// ============================================

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default api;
