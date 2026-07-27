import React from 'react';
import { Building2, Sparkles, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { formatCurrency } from '../../lib/utils';

export const MultiBranchView: React.FC = () => {
  const { branches, setActiveBranch } = useRestaurantStore();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
              Chain-Wide Telemetry
            </span>
            <h1 className="text-xl font-bold text-[var(--text-heading)]">Multi-Branch Intelligence OS</h1>
          </div>
        </div>
      </div>

      {/* Cross-Branch AI Insight Banner */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-white block">Cross-Outlet Performance Optimization</span>
          <p className="text-[var(--text-secondary)]">
            Branch AX-03 (Airport Express) is generating +38% higher cocktail upsell revenue than HQ-01 using an automated tablet prompt script. Recommended: Replicate AX-03 waiter script across all 3 outlets.
          </p>
        </div>
      </div>

      {/* Branch Ranking Table */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-[var(--text-heading)] mb-2">Branch Telemetry Ranking</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div key={b.id} className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border-muted)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold block">{b.code}</span>
                  <h3 className="text-base font-bold text-[var(--text-heading)]">{b.name}</h3>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  Health {b.healthScore}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface-1)] text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Daily Revenue:</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(b.dailyRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Active Orders:</span>
                  <span className="font-bold text-indigo-400">{b.activeOrders} orders</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Capacity:</span>
                  <span className="text-[var(--text-heading)]">{b.tablesCount} tables</span>
                </div>
              </div>

              <button
                onClick={() => setActiveBranch(b.id)}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Switch Active Scope</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
