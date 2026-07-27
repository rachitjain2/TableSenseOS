import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, TrendingUp, History, Filter } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { LearningService } from '../../lib/services/learningService';

export const AIAccuracyTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const logs = LearningService.getFeedbackLogs();
  const signals = LearningService.getLearningSignals();
  const trends = LearningService.getAccuracyTrends();

  const filteredLogs = selectedCategory === 'all'
    ? logs
    : logs.filter((l) => l.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Overall Model Accuracy</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[var(--text-heading)] font-display">95.4%</div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Evaluated across 142 AI decisions this month</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Active Learning Feedback</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[var(--text-heading)] font-display">18 Logs</div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Continuous calibration groundings active</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Model Calibration Bias</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[var(--text-heading)] font-display">Optimal</div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Slight underestimation bias corrected (+2.1%)</p>
        </div>
      </div>

      {/* Accuracy Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)]">
        <h3 className="text-sm font-bold text-[var(--text-heading)] mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" /> Model Accuracy Trends (Past 7 Days)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" opacity={0.3} />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
              <YAxis domain={[80, 100]} stroke="var(--text-muted)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface-2)',
                  borderColor: 'var(--border-main)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="inventory" stroke="#38bdf8" name="Inventory AI" strokeWidth={2} />
              <Line type="monotone" dataKey="staffing" stroke="#818cf8" name="Staffing AI" strokeWidth={2} />
              <Line type="monotone" dataKey="kitchen" stroke="#34d399" name="Kitchen AI" strokeWidth={2} />
              <Line type="monotone" dataKey="pricing" stroke="#f43f5e" name="Pricing AI" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Learning Signals Cards Grid */}
      <div>
        <h3 className="text-sm font-bold text-[var(--text-heading)] mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Active Grounded Learning Signals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {signals.map((sig, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-indigo-400 font-bold">{sig.category}</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{sig.averageAccuracyPercent}% Acc.</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{sig.historicalNote}</p>
              <div className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Sample Size: {sig.sampleCount} evaluations
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluated Decision Logs */}
      <div className="glass-panel p-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" /> Evaluated AI Decision Logs
          </h3>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-lg px-2.5 py-1 text-xs"
            >
              <option value="all">All Categories</option>
              <option value="inventory">Inventory</option>
              <option value="staffing">Staffing</option>
              <option value="kitchen">Kitchen</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold block">
                  {log.category} • Action: {log.actionTaken}
                </span>
                <p className="text-[var(--text-primary)] font-medium mt-0.5">
                  Predicted: {log.predictedValue} → Actual: {log.actualOutcome}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] font-bold">
                  {log.accuracyScorePercent}% Acc.
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
