// ============================================
// Advertiser Types
// ============================================

export type AdvertiserType = 'individual' | 'company';

export type KYCStatus = 'pending' | 'approved' | 'rejected';

export interface Advertiser {
  id: string;
  type: AdvertiserType;
  email: string;
  companyName?: string;
  logo?: string;
  contactName: string;
  phone: string;
  address: string;
  kycStatus: KYCStatus;
  kycDocuments: KYCDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface KYCDocument {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  status: KYCStatus;
  uploadedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface IndividualAdvertiser extends Advertiser {
  type: 'individual';
  idCopy: string;
  proofOfResidence: string;
}

export interface CompanyAdvertiser extends Advertiser {
  type: 'company';
  registrationNumber: string;
  registrationDocument: string;
  directorIds: string[];
  companyDetails: CompanyDetails;
}

export interface CompanyDetails {
  address: string;
  phone: string;
  email: string;
  website?: string;
}

// ============================================
// User & Role Types
// ============================================

export type UserRole = 'owner' | 'manager' | 'viewer';

export interface Permission {
  canCreateCampaigns: boolean;
  canAccessWallet: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canEditSettings: boolean;
}

export interface AdvertiserUser {
  id: string;
  advertiserId: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export const DEFAULT_PERMISSIONS: Record<UserRole, Permission> = {
  owner: {
    canCreateCampaigns: true,
    canAccessWallet: true,
    canViewReports: true,
    canManageUsers: true,
    canEditSettings: true,
  },
  manager: {
    canCreateCampaigns: true,
    canAccessWallet: true,
    canViewReports: true,
    canManageUsers: false,
    canEditSettings: false,
  },
  viewer: {
    canCreateCampaigns: false,
    canAccessWallet: false,
    canViewReports: true,
    canManageUsers: false,
    canEditSettings: false,
  },
};

// ============================================
// Wallet Types
// ============================================

export interface Wallet {
  id: string;
  advertiserId: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'topup' | 'spend' | 'refund' | 'adjustment';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  campaignId?: string;
  reference?: string;
  createdAt: string;
  completedAt?: string;
}

export interface TopUpRequest {
  amount: number;
  paymentMethod: string;
  reference: string;
}

// ============================================
// Campaign Types
// ============================================

export type CampaignStatus = 'draft' | 'pending' | 'active' | 'paused' | 'completed' | 'suspended' | 'deleted';
export type CampaignType = 'category' | 'creator';
export type PlacementType = 'pre_roll' | 'mid_roll';
export type TargetType = 'impressions' | 'clicks';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  creatorCount: number;
  isActive: boolean;
}

export interface Creator {
  id: string;
  name: string;
  avatar?: string;
  channelName: string;
  subscriberCount: number;
  categoryIds: string[];
  isActive: boolean;
}

export interface Campaign {
  id: string;
  advertiserId: string;
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  
  // Targeting
  categoryIds?: string[];
  creatorIds?: string[];
  
  // Ad Content
  videoUrl: string;
  thumbnailUrl?: string;
  targetUrl: string;
  duration: number; // seconds
  
  // Placement
  placements: PlacementType[];
  
  // Budget & Targeting
  budget: number;
  dailyBudget?: number;
  durationDays: number;
  targetType: TargetType;
  targetValue: number; // impressions or clicks
  
  // Metrics
  impressions: number;
  views: number; // views after 10 seconds
  clicks: number;
  spend: number;
  
  // Scheduling
  startDate: string;
  endDate: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface CampaignFormData {
  type: CampaignType;
  name: string;
  description?: string;
  categoryIds?: string[];
  creatorIds?: string[];
  videoFile?: File;
  targetUrl: string;
  placements: PlacementType[];
  budget: number;
  durationDays: number;
  targetType: TargetType;
  targetValue: number;
  startDate: string;
  endDate: string;
}

// ============================================
// Report Types
// ============================================

export interface CampaignReport {
  campaignId: string;
  campaignName: string;
  date: string;
  impressions: number;
  views: number;
  clicks: number;
  ctr: number; // click-through rate
  spend: number;
  cpc: number; // cost per click
  cpm: number; // cost per mille (1000 impressions)
}

export interface SpendReport {
  campaignId: string;
  campaignName: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  startDate: string;
  endDate: string;
}

export interface DailyMetrics {
  date: string;
  impressions: number;
  views: number;
  clicks: number;
  spend: number;
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardMetrics {
  activeAds: number;
  pausedAds: number;
  totalViews: number;
  totalImpressions: number;
  totalSpend: number;
  totalBudget: number;
  walletBalance: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Auth Types
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  advertiserId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  expiresAt: string;
}
