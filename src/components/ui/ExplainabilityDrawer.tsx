import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Database, History, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useRestaurantStore } from '../../stores/useRestaurantStore';

export const ExplainabilityDrawer: React.FC = () => {
  const { activeExplainabilityInsightId, openExplainabilityDrawer } = useUIStore();
  const { insights } = useRestaurantStore();

  const activeInsight = insights.find((i) => i.id === activeExplainabilityInsightId);

  if (!activeInsight) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={() => openExplainabilityDrawer(null)}
        />

        {/* Drawer Content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative z-10 w-full max-w-lg h-full glass-panel bg-[var(--surface-1)] border-l border-[var(--border-main)] p-6 overflow-y-auto flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border-muted)]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                    Explainable AI Model Engine
                  </span>
                  <h3 className="text-lg font-bold text-[var(--text-heading)]">AI Decision Transparency</h3>
                </div>
              </div>

              <button
                onClick={() => openExplainabilityDrawer(null)}
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Confidence Gauge */}
            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 mb-6">
              <span className="text-xs font-mono uppercase text-indigo-400 font-semibold block mb-1">
                Recommendation Title
              </span>
              <h4 className="text-base font-bold text-[var(--text-heading)] mb-3">{activeInsight.title}</h4>

              <div className="flex items-center justify-between pt-3 border-t border-indigo-500/10">
                <span className="text-xs text-[var(--text-secondary)] font-medium">Model Confidence Level</span>
                <div className="flex items-center gap-2">
                  <div className="w-28 h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${activeInsight.confidenceScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400">{activeInsight.confidenceScore}%</span>
                </div>
              </div>
            </div>

            {/* Section 1: What Happened */}
            <div className="mb-5">
              <h5 className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold mb-2 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-400" /> 1. What Happened (Observed Telemetry Signal)
              </h5>
              <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border-muted)] text-xs text-[var(--text-primary)] leading-relaxed font-mono">
                {activeInsight.plainLanguageReasoning}
              </div>
            </div>

            {/* Section 2: Why This Recommendation */}
            <div className="mb-5">
              <h5 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> 2. Why This Recommendation (Reasoning Chain & Evidence)
              </h5>
              <div className="space-y-2">
                {(activeInsight.supportingEvidence || activeInsight.dataSignalsUsed).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] text-xs text-[var(--text-primary)] font-mono"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: If Ignored */}
            <div className="mb-5">
              <h5 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold mb-2 flex items-center gap-1.5">
                <History className="w-4 h-4 text-rose-400" /> 3. Projected Consequence If Ignored
              </h5>
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 leading-relaxed font-mono">
                {activeInsight.historicalPrecedent ||
                  'If no action is taken, queue bottlenecks will escalate wait times by an estimated +12 minutes and risk unfulfilled guest orders.'}
              </div>
            </div>

            {/* Section 4: If Accepted */}
            <div className="mb-6">
              <h5 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" /> 4. Projected Outcome If Accepted
              </h5>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed font-mono space-y-1">
                <p className="font-bold text-sm">
                  {activeInsight.expectedBusinessImpact || 'Optimizes floor turnover and maintains guest NPS rating.'}
                </p>
                {activeInsight.revenueOpportunity && (
                  <p className="text-emerald-300">
                    Expected Revenue Protected: +${activeInsight.revenueOpportunity}
                  </p>
                )}
                {activeInsight.estimatedCostSavings && (
                  <p className="text-cyan-300">
                    Estimated Waste/Cost Savings: +${activeInsight.estimatedCostSavings}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-[var(--border-muted)]">
            <button
              onClick={() => openExplainabilityDrawer(null)}
              className="w-full py-2.5 rounded-xl bg-[var(--surface-3)] text-[var(--text-primary)] font-semibold text-xs hover:bg-[var(--surface-2)] transition-colors"
            >
              Close Explainability Inspector
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
