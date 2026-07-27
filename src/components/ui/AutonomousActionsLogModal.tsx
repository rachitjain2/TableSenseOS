import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Undo2, X, Clock, CheckCircle2, History } from 'lucide-react';
import { useRestaurantStore } from '../../stores/useRestaurantStore';

export const AutonomousActionsLogModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { autonomousLogs, undoAutonomousAction } = useRestaurantStore();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 text-xs font-mono font-medium transition-all"
      >
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>Autonomous Audit Trail ({autonomousLogs.length})</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-2xl glass-panel bg-[var(--surface-1)] rounded-2xl border border-[var(--border-main)] p-6 shadow-2xl max-h-[85vh] flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-muted)]">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                      Safety & Reversibility Guarantee
                    </span>
                    <h3 className="text-lg font-bold text-[var(--text-heading)]">Autonomous AI Action Audit Trail</h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Logs List */}
              <div className="flex-1 overflow-y-auto space-y-3 my-4 pr-1">
                {autonomousLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{log.timestamp}</span>
                        <span>•</span>
                        <span className="uppercase text-indigo-300">{log.category.replace('_', ' ')}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--text-heading)]">{log.title}</h4>
                      <p className="text-xs text-[var(--text-secondary)]">{log.reasoning}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {log.status === 'undone' ? (
                        <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-lg">
                          Undone
                        </span>
                      ) : (
                        <>
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                          {log.canBeUndone && (
                            <button
                              onClick={() => undoAutonomousAction(log.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-mono transition-colors"
                            >
                              <Undo2 className="w-3.5 h-3.5" /> Undo
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-[var(--border-muted)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>All autonomous AI actions are restricted to safe, reversible bounds by design.</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--surface-3)] text-[var(--text-primary)] font-semibold hover:bg-[var(--surface-2)] transition-colors"
                >
                  Close Audit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
