import React from 'react';
import { Leaf, Sparkles, TrendingDown, DollarSign, Droplets, Wind, CheckCircle2 } from 'lucide-react';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { formatCurrency } from '../../lib/utils';

export const SustainabilityView: React.FC = () => {
  const { sustainability } = useRestaurantStore();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Eco-Intelligence Layer
            </span>
            <h1 className="text-xl font-bold text-[var(--text-heading)]">Sustainability & Waste Playbook</h1>
          </div>
        </div>
      </div>

      {/* 4 Sustainability Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Food Waste Today</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 block">{sustainability.totalFoodWasteKgToday} kg</span>
          <span className="text-[11px] font-mono text-emerald-400/80">-14.2% vs last week</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Cost Waste Impact</span>
          <span className="text-2xl font-bold font-mono text-amber-400 block">{formatCurrency(sustainability.costImpactWasteToday)}</span>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">Daily prep loss</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Carbon Footprint</span>
          <span className="text-2xl font-bold font-mono text-cyan-400 block">{sustainability.carbonFootprintKg} kg CO₂</span>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">Calculated impact</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Water Saved</span>
          <span className="text-2xl font-bold font-mono text-indigo-400 block">{sustainability.waterSavedLiters} L</span>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">Via prep optimization</span>
        </div>
      </div>

      {/* AI Waste Reduction Playbook */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h2 className="text-base font-bold text-[var(--text-heading)]">AI Food Waste Reduction Playbook</h2>
        </div>

        <div className="space-y-3">
          {sustainability.aiWasteReductionPlaybook.map((play, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">{play}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
