import React from 'react';
import { motion } from 'motion/react';
import { Users, Sparkles, Award, TrendingUp, Clock, CheckCircle2, Lightbulb } from 'lucide-react';
import { useRestaurantStore } from '../../stores/useRestaurantStore';

export const StaffView: React.FC = () => {
  const { staff } = useRestaurantStore();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
              Team Intelligence & Training
            </span>
            <h1 className="text-xl font-bold text-[var(--text-heading)]">Staff Roster & AI Training Assistant</h1>
          </div>
        </div>
      </div>

      {/* AI Staff Training & Micro-Learning Banner */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-white block">AI Staff Training Assistant Active</span>
          <p className="text-[var(--text-secondary)]">
            Brain automatically analyzes table turnover times and dessert upsell conversions to generate personalized, non-intrusive micro-learning tips for staff before peak shifts.
          </p>
        </div>
      </div>

      {/* Staff Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {staff.map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ y: -3 }}
            className="glass-panel p-5 rounded-2xl space-y-4 flex flex-col justify-between"
          >
            {/* Header: Avatar, Name, Role */}
            <div className="flex items-center gap-3">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-xl object-cover border border-indigo-500/30 shrink-0"
              />
              <div>
                <h3 className="text-sm font-bold text-[var(--text-heading)]">{member.name}</h3>
                <span className="text-xs font-mono text-indigo-400 block">{member.role}</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">Shift: {member.shift}</span>
              </div>
            </div>

            {/* Performance Signals */}
            <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Upsell Conversion:</span>
                <span className="text-emerald-400 font-bold">{member.performanceMetrics.upsellRatePercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Avg Table Turnover:</span>
                <span className="text-amber-400 font-bold">{member.performanceMetrics.avgTableTurnoverMinutes}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Guest Rating:</span>
                <span className="text-cyan-400 font-bold">★ {member.performanceMetrics.guestRating}</span>
              </div>
            </div>

            {/* AI Micro-Tip Box */}
            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-indigo-400 font-bold">
                <Lightbulb className="w-3.5 h-3.5" /> AI Micro-Learning Tip
              </div>
              <p className="text-[11px] text-[var(--text-primary)] leading-relaxed">{member.aiMicroTip}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
