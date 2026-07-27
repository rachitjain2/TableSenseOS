import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, X, Info, ArrowUpRight } from 'lucide-react';
import { AIInsight } from '../../types';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { useUIStore } from '../../stores/useUIStore';

interface AIInsightCardProps {
  insight: AIInsight;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight }) => {
  const { approveInsight, dismissInsight } = useRestaurantStore();
  const { openExplainabilityDrawer, setActiveTab } = useUIStore();

  const isApproved = insight.status === 'approved';
  const isAuto = insight.status === 'auto_applied';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`glass-ai-card relative p-4 sm:p-5 rounded-2xl transition-all ${
        insight.category === 'crisis' ? 'border-rose-500/40 bg-rose-500/5' : ''
      }`}
    >
      {/* Card Top Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                {insight.sourceAgent || 'Brain Insight'} • {insight.category}
              </span>
              {insight.riskLevel && (
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                    insight.riskLevel === 'high'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : insight.riskLevel === 'medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {insight.riskLevel} Risk
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-[var(--text-heading)] leading-snug">
              {insight.title}
            </h4>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-medium shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          {insight.confidenceScore}% confidence
        </div>
      </div>

      {/* Business Impact Preview if available */}
      {insight.expectedBusinessImpact && (
        <div className="mb-2.5 pl-1 text-xs font-mono text-emerald-400 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span>Impact: {insight.expectedBusinessImpact}</span>
        </div>
      )}

      {/* Reasoning Snippet */}

      {/* Reasoning Snippet */}
      <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 mb-3 pl-1">
        {insight.plainLanguageReasoning}
      </p>

      {/* Data Signals Pill Strip */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4 pl-1">
        {insight.dataSignalsUsed.map((signal, idx) => (
          <span
            key={idx}
            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border-muted)]"
          >
            {signal}
          </span>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border-muted)]">
        {/* Universal Explainability Trigger */}
        <button
          onClick={() => openExplainabilityDrawer(insight.id)}
          className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors py-1 px-2 rounded-lg hover:bg-indigo-500/10"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Why this recommendation?</span>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isAuto ? (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Auto-Executed
            </span>
          ) : isApproved ? (
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Approved
            </span>
          ) : (
            <>
              <button
                onClick={() => dismissInsight(insight.id)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (insight.category === 'staffing') setActiveTab('simulation');
                  approveInsight(insight.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{insight.suggestedAction.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
