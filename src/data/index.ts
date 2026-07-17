import { TRADES } from './trades';
import { REVIEWS } from './reviews';
import { TradeCategory, ReviewItem } from '../types';

export { TRADES, REVIEWS };

export const TRADE_CATEGORIES: TradeCategory[] = TRADES.map((t) => ({
  id: t.id,
  name: t.title,
  description: t.description,
  estPrice: parseFloat(t.estPrice.replace(/[^0-9.]/g, '')) || 0,
  monthlyVolume: t.monthlyVolume,
  averageCloseRate: '45%',
  demandTrend: 'high',
  popularServices: t.keywords,
}));

export const ACTIVE_U_S_CITIES: string[] = [
  'Austin, TX',
  'Denver, CO',
  'Seattle, WA',
  'Miami, FL',
  'Boston, MA',
  'Chicago, IL',
  'Phoenix, AZ',
  'Dallas, TX',
  'Portland, OR',
  'Minneapolis, MN',
  'San Diego, CA',
  'Nashville, TN',
  'Las Vegas, NV',
  'Philadelphia, PA',
  'Charlotte, NC',
  'Columbus, OH',
  'San Francisco, CA',
  'New York, NY',
  'Indianapolis, IN',
  'Orlando, FL',
  'Detroit, MI',
  'Houston, TX',
  'Kansas City, MO',
];

export const CLIENT_REVIEWS: ReviewItem[] = REVIEWS.map((r, i) => ({
  id: r.id,
  stars: r.rating,
  reviewer: r.author,
  company: r.type === 'Contractor' ? r.author : 'Verified Homeowner',
  trade: TRADE_CATEGORIES[i % TRADE_CATEGORIES.length].name,
  city: r.location,
  comment: r.text,
}));
