export type ServiceType =
  | 'roofing'
  | 'hvac'
  | 'plumbing'
  | 'electrical'
  | 'solar'
  | 'remodeling'
  | 'painting'
  | 'landscaping'
  | 'masonry'
  | 'windows'
  | 'flooring'
  | 'deck'
  | 'siding'
  | 'garage'
  | 'pest'
  | 'security';

export interface Review {
  id: number;
  rating: number;
  author: string;
  type: string;
  location: string;
  text: string;
}

export interface FunnelState {
  funnelMode: 'homeowner' | 'contractor';
  serviceType: ServiceType | '';
  zipCode: string;
  specificNeeds: string;
  projectUrgency: string;
  estimatedBudget: string;
  companyName: string;
  licenseNumber: string;
  yearsInBusiness: string;
  dailyLeadBudget: string;
  coverageRadius: string;
  name: string;
  phone: string;
  email: string;
}

export interface TradeDetail {
  id: ServiceType;
  title: string;
  estPrice: string;
  monthlyVolume: string;
  description: string;
  image: string;
  keywords: string[];
  applyLabel: string;
  fieldSpecs: string;
}

export interface TradeCategory {
  id: string;
  name: string;
  description: string;
  estPrice: number;
  monthlyVolume: string;
  averageCloseRate: string;
  demandTrend: 'high' | 'low';
  popularServices: string[];
}

export interface ReviewItem {
  id: number;
  stars: number;
  reviewer: string;
  company: string;
  trade: string;
  city: string;
  comment: string;
}

export interface OnboardingState {
  trade: string;
  zipCode: string;
  projectScope: string;
  timeframe: string;
  fullName: string;
  phone: string;
  email: string;
  otpCode: string;
  isOtpSent: boolean;
  isOtpVerified: boolean;
  submitted: boolean;
  otpError?: string;
}

export interface BookingState {
  date: string;
  time: string;
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  trade: string;
  dailyBudget: number;
  zipCodes: string;
  booked: boolean;
}

export interface Leader {
  name: string;
  role: string;
  initials: string;
}

export interface ApplicationDraft {
  trade: ServiceType | '';
  coverageMode: 'radius' | 'zip';
  coverageRadius: string;
  zipCodes: string;
  weeklyVolume: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
}
