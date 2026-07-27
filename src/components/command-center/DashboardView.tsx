import React from 'react';
import { Sparkles, ArrowRight, Activity, BarChart3, LayoutGrid } from 'lucide-react';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { useUIStore } from '../../stores/useUIStore';
import { HealthScoreGauge } from '../ui/HealthScoreGauge';
import { MetricCard } from '../ui/MetricCard';
import { AIInsightCard } from '../ui/AIInsightCard';
import { formatCurrency } from '../../lib/utils';

export const DashboardView: React.FC = () => {
  const { healthScore, insights, tables } = useRestaurantStore();
  const { setActiveTab } = useUIStore();

  const occupiedTables = tables.filter((t) => t.status !== 'empty').length;
  const occupiedPercent = Math.round((occupiedTables / tables.length) * 100);

  const topInsights = insights.slice(0, 3);

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 sm:space-y-10">
      {/* Calm Briefing Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-muted)]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 font-semibold">
            Morning Briefing • Restaurant Brain
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-heading)] tracking-tight">
            Executive Summary
          </h1>
        </div>
        <div className="text-xs font-mono text-[var(--text-muted)] sm:text-right">
          Real-time AI Synthesis Active
        </div>
      </div>

      {/* Hero Section: Restaurant Health Score Gauge */}
      <HealthScoreGauge healthScore={healthScore} />

      {/* Key Metric Cards (Max 3 for spacious clarity) */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
          Core Performance Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <MetricCard
            title="Daily Revenue"
            value={formatCurrency(8420)}
            comparisonText="vs $7,500 forecast"
            changePercent={+12.3}
            sparklineData={[{ val: 4200 }, { val: 5100 }, { val: 6800 }, { val: 7900 }, { val: 8420 }]}
          />
          <MetricCard
            title="Active Covers"
            value="142"
            comparisonText="vs 120 yesterday"
            changePercent={+18.3}
            sparklineData={[{ val: 80 }, { val: 105 }, { val: 118 }, { val: 130 }, { val: 142 }]}
          />
          <MetricCard
            title="Avg Kitchen Prep Time"
            value="12.4m"
            comparisonText="Target < 14m"
            changePercent={-6.2}
            isGoodWhenUp={false}
            sparklineData={[{ val: 16 }, { val: 15 }, { val: 14 }, { val: 13 }, { val: 12.4 }]}
          />
        </div>
      </div>

      {/* Top AI Insight Cards (Max 3) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[var(--text-heading)]">
              Top Priority Recommendations
            </h2>
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Top {topInsights.length} evaluated
          </span>
        </div>

        <div className="space-y-4">
          {topInsights.map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {/* Spacious Module Navigation Shortcuts */}
      <div className="pt-6 border-t border-[var(--border-muted)]">
        <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block mb-3">
          Explore Dedicated Screens
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTab('digital-twin')}
            className="p-4 rounded-xl glass-panel border border-[var(--border-muted)] hover:border-indigo-500/40 text-left transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--text-heading)] block group-hover:text-cyan-400 transition-colors">
                  Digital Twin Floor Map
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  {occupiedPercent}% occupancy
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className="p-4 rounded-xl glass-panel border border-[var(--border-muted)] hover:border-indigo-500/40 text-left transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--text-heading)] block group-hover:text-indigo-400 transition-colors">
                  Analytics & Charts
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  Financial & revenue insights
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className="p-4 rounded-xl glass-panel border border-[var(--border-muted)] hover:border-indigo-500/40 text-left transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--text-heading)] block group-hover:text-emerald-400 transition-colors">
                  Simulation Lab
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  What-if scenario engine
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};

