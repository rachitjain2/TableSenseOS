import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, ArrowUpRight, DollarSign, Users, Check, X } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { useUIStore } from '../../stores/useUIStore';
import { HealthScoreGauge } from '../ui/HealthScoreGauge';
import { AIInsightCard } from '../ui/AIInsightCard';
import { formatCurrency } from '../../lib/utils';

export const ExecutiveView: React.FC = () => {
  const { healthScore, insights, approveInsight, dismissInsight } = useRestaurantStore();
  const { setActiveTab } = useUIStore();

  const profitForecastData = [
    { hour: '12:00', revenue: 1200, profitLower: 320, profitUpper: 420 },
    { hour: '14:00', revenue: 2400, profitLower: 680, profitUpper: 810 },
    { hour: '16:00', revenue: 3800, profitLower: 1100, profitUpper: 1350 },
    { hour: '18:00', revenue: 5900, profitLower: 1750, profitUpper: 2100 },
    { hour: '20:00', revenue: 8420, profitLower: 2600, profitUpper: 3100 },
    { hour: '22:00', revenue: 10200, profitLower: 3200, profitUpper: 3800 },
  ];

  const aiOpportunities = insights.filter(
    (i) => i.revenueOpportunity || i.sourceAgent === 'BusinessAdvisorAgent'
  );

  const operationalRisks = insights.filter(
    (i) => i.riskLevel === 'high' || i.riskLevel === 'medium'
  );

  const rankedPendingRecommendations = insights.filter((i) => i.status === 'pending').slice(0, 5);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Executive Intelligence Console
              </span>
              <h1 className="text-xl font-bold text-[var(--text-heading)]">Owner & Leadership Operations Command</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
            Live Business Pacing: +14.2% vs Target
          </span>
        </div>
      </div>

      {/* Top Metric Cards + Compact Health Ring */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Today's Gross Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-[var(--text-heading)] font-display">$8,420</div>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" /> +12.4% vs last Friday
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Predicted End-of-Day</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400 font-display">$11,850</div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">96% confidence model band</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Staff Efficiency</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-[var(--text-heading)] font-display">92%</div>
          <p className="text-xs text-indigo-400 mt-1 font-mono">3.8 turns/tbl avg</p>
        </div>

        {/* Compact Health Score Card */}
        <div className="glass-panel p-4 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)] flex items-center gap-4">
          <div className="w-16 h-16 shrink-0">
            <HealthScoreGauge healthScore={healthScore} compact />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">Health Index</span>
            <div className="text-lg font-bold text-[var(--text-heading)]">{healthScore?.overallScore ?? 87} / 100</div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-[11px] text-cyan-400 hover:underline font-mono inline-flex items-center gap-1 mt-0.5"
            >
              View Full Breakdown <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Profit Forecast Area Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Projected Profit Margin & Confidence Shading
          </h3>
          <span className="text-xs font-mono text-[var(--text-muted)]">Net Margin: ~32.4%</span>
        </div>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profitForecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" opacity={0.3} />
              <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface-2)',
                  borderColor: 'var(--border-main)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="profitUpper" stroke="#34d399" fill="#34d399" fillOpacity={0.15} name="Upper Profit Band" />
              <Area type="monotone" dataKey="profitLower" stroke="#059669" fill="#059669" fillOpacity={0.3} name="Lower Profit Band" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column Intelligence Grid: AI Revenue Opportunities vs Operational Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: AI Opportunities */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> High-Value Revenue & Yield Opportunities
          </h3>
          <div className="space-y-3">
            {aiOpportunities.map((insight) => (
              <AIInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>

        {/* Column 2: Operational Risks */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Critical Operational Risks & Bottlenecks
          </h3>
          <div className="space-y-3">
            {operationalRisks.map((insight) => (
              <AIInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      </div>

      {/* Ranked Executive Action Recommendations Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)] space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" /> Ranked Executive AI Action Recommendations
        </h3>

        <div className="space-y-2">
          {rankedPendingRecommendations.map((rec, index) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">
                  #{index + 1}
                </span>
                <div>
                  <span className="font-bold text-[var(--text-heading)] block">{rec.title}</span>
                  <span className="text-[11px] text-[var(--text-secondary)]">{rec.expectedBusinessImpact || rec.plainLanguageReasoning}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => dismissInsight(rec.id)}
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={() => approveInsight(rec.id)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-xs transition-all flex items-center gap-1"
                >
                  <span>Approve</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
