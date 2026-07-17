import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, ArrowUpRight, ShieldAlert, BadgePercent, Check, 
  ChevronDown, Flame, Zap, Droplet, Paintbrush, Hammer, Layers, LayoutGrid
} from 'lucide-react';
import { TradeCategory } from '../types';

interface TradeCardProps {
  trade: TradeCategory;
  onClaimLeads: (tradeName: string) => void;
}

export default function TradeCard({ trade, onClaimLeads }: TradeCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Match trades with custom icons
  const getIcon = (id: string) => {
    switch (id) {
      case 'roofing': return <Layers className="w-5 h-5 text-terra" />;
      case 'hvac': return <Flame className="w-5 h-5 text-terra" />;
      case 'plumbing': return <Droplet className="w-5 h-5 text-terra" />;
      case 'electrical': return <Zap className="w-5 h-5 text-terra" />;
      case 'painting': return <Paintbrush className="w-5 h-5 text-terra" />;
      case 'landscaping': return <LayoutGrid className="w-5 h-5 text-terra" />;
      case 'carpentry': return <Hammer className="w-5 h-5 text-terra" />;
      case 'flooring': return <Layers className="w-5 h-5 text-terra" />;
      default: return <Zap className="w-5 h-5 text-terra" />;
    }
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
      className={`bg-white rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full ${
        isHovered 
          ? 'shadow-xl border-terra/40 -translate-y-1' 
          : 'shadow-sm border-charcoal/10'
      }`}
    >
      {/* Visual Accent Corner Ribbon on Hover */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-terra/5 rounded-full blur-xl transition-all duration-300 ${isHovered ? 'scale-150 bg-terra/10' : 'scale-100'}`} />

      <div className="space-y-4 relative z-10">
        {/* Trade Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-terra/10 p-3 rounded-2xl group-hover:scale-105 transition-transform duration-300">
              {getIcon(trade.id)}
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-charcoal tracking-tight leading-tight">
                {trade.name}
              </h4>
              <p className="text-[11px] text-warmgray font-mono mt-0.5">EST. PRICE: ${trade.estPrice.toFixed(2)}</p>
            </div>
          </div>

          <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${
            trade.demandTrend === 'high' 
              ? 'bg-red-50 text-red-500 border-red-100' 
              : 'bg-green-50 text-green-500 border-green-100'
          }`}>
            <TrendingUp className="w-3 h-3" />
            <span>{trade.demandTrend}</span>
          </span>
        </div>

        {/* Short description */}
        <p className="text-xs text-warmgray leading-relaxed">
          {trade.description}
        </p>

        {/* Live Metrics Block */}
        <div className="grid grid-cols-2 gap-3 bg-charcoal/5 rounded-2xl p-3.5 border border-charcoal/5">
          <div>
            <p className="text-[9px] uppercase font-mono font-bold text-warmgray">Monthly leads</p>
            <p className="text-sm font-bold text-charcoal">{trade.monthlyVolume}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-mono font-bold text-warmgray">Avg Close Rate</p>
            <p className="text-sm font-bold text-terra flex items-center gap-1">
              <BadgePercent className="w-4 h-4 shrink-0" />
              <span>{trade.averageCloseRate}</span>
            </p>
          </div>
        </div>

        {/* Interactive service list drawer toggle */}
        <div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-charcoal/80 hover:text-terra transition-colors"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180 text-terra' : ''}`} />
            <span>{isOpen ? 'Hide services & stats' : 'View active service types'}</span>
          </button>

          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 space-y-2 border-t border-charcoal/5 pt-3"
            >
              <div className="flex flex-wrap gap-1.5">
                {trade.popularServices.map((service) => (
                  <span 
                    key={service} 
                    className="text-[10px] bg-white border border-charcoal/10 text-charcoal px-2.5 py-1 rounded-lg flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-terra" />
                    {service}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-warmgray leading-relaxed italic mt-2">
                * Note: Dispatches on ReferralClose are 100% phone OTP-verified before dispatching to your dashboard.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-5 pt-3 border-t border-charcoal/5 relative z-10">
        <button
          onClick={() => onClaimLeads(trade.name)}
          className="w-full bg-charcoal hover:bg-terra text-white hover:text-white rounded-2xl py-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300"
        >
          <span>Claim {trade.name.split(' & ')[0]} Leads</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </motion.div>
  );
}
