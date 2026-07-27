import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, TrendingUp, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { HealthScoreSnapshot } from '../../types';

interface HealthScoreGaugeProps {
  healthScore?: HealthScoreSnapshot;
  score?: number;
  size?: number;
  compact?: boolean;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({
  healthScore,
  score: directScore,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const score = directScore ?? healthScore?.overallScore ?? 87;
  const strokeDashoffset = 283 - (283 * score) / 100; // 283 is circumference for r=45

  if (compact) {
    return (
      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" className="stroke-[var(--border-main)] fill-none" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#compactHealthGradient)"
            strokeWidth="10"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="fill-none transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="compactHealthGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono font-extrabold text-sm text-[var(--text-heading)]">
          {score}
        </div>
      </div>
    );
  }

  const subScoreItems = [
    { label: 'Operational Efficiency', val: healthScore?.subScores?.operationalEfficiency ?? 84 },
    { label: 'Financial Performance', val: healthScore?.subScores?.financialPerformance ?? 92 },
    { label: 'Guest Satisfaction', val: healthScore?.subScores?.guestSatisfaction ?? 94 },
    { label: 'Staff Performance', val: healthScore?.subScores?.staffPerformance ?? 86 },
    { label: 'Sustainability Index', val: healthScore?.subScores?.sustainability ?? 80 },
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Ring Gauge */}
        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle cx="50" cy="50" r="45" className="stroke-[var(--border-main)] fill-none" strokeWidth="8" />
            {/* Animated Score Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#healthGradient)"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="fill-none transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="healthGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Score Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold font-mono text-[var(--text-heading)]">{score}</span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">/ 100</span>
          </div>
        </div>

        {/* Narrative & High Level Summary */}
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Restaurant Brain Core</span>
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{healthScore?.trendVsYesterday ?? 2.4} vs yesterday</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-[var(--text-heading)]">
            Overall Restaurant Health: Optimal
          </h3>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {healthScore?.narrativeSummary ?? 'Restaurant Brain Health is optimal.'}
          </p>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold pt-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isExpanded ? 'Hide Sub-Score Metrics' : 'Drill Into 5 Sub-Scores'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Sub-Score Grid */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-5 border-t border-[var(--border-muted)] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
        >
          {subScoreItems.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)]">
              <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block mb-1">
                {item.label}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-[var(--text-heading)]">{item.val}</span>
                <span className="text-[10px] font-mono text-indigo-400">/ 100</span>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
