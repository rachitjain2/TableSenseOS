import React, { useState } from 'react';
import { BarChart3, Sparkles, DollarSign, Target } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { SmartPricingTab } from './SmartPricingTab';
import { AIAccuracyTab } from './AIAccuracyTab';

export const AnalyticsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'trends' | 'pricing' | 'accuracy'>('trends');

  const revenueTrendData = [
    { day: 'Mon', revenue: 6200, covers: 98 },
    { day: 'Tue', revenue: 7100, covers: 112 },
    { day: 'Wed', revenue: 6800, covers: 105 },
    { day: 'Thu', revenue: 7900, covers: 128 },
    { day: 'Fri', revenue: 9800, covers: 164 },
    { day: 'Sat', revenue: 11400, covers: 188 },
    { day: 'Sun', revenue: 8420, covers: 142 },
  ];

  const categorySalesData = [
    { category: 'Main Course', sales: 18400 },
    { category: 'Starters', sales: 9200 },
    { category: 'Beverages', sales: 7100 },
    { category: 'Desserts', sales: 4800 },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
              Deep Analytics & Intelligence
            </span>
            <h1 className="text-xl font-bold text-[var(--text-heading)]">Executive Analytics Dashboard</h1>
          </div>
        </div>

        {/* Analytics Sub-Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)]">
          <button
            onClick={() => setActiveSubTab('trends')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'trends'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Revenue Trends</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pricing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'pricing'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Smart Pricing</span>
          </button>

          <button
            onClick={() => setActiveSubTab('accuracy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'accuracy'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>AI Accuracy</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'pricing' && <SmartPricingTab />}
      {activeSubTab === 'accuracy' && <AIAccuracyTab />}

      {activeSubTab === 'trends' && (
        <>
          {/* Top AI Summary Panel */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-white block">AI Strategic Revenue Analysis</span>
              <p className="text-[var(--text-secondary)]">
                Weekly revenue reached $57,620 (+14.8% vs last week). Peak velocity occurred Saturday evening between 19:30 and 21:00 with Wagyu Burgers and Truffle Fries contributing 34% of total profit margin.
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Area Chart */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-heading)] font-mono">Daily Revenue Trend ($)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrendData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#6366F1" fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Sales Bar Chart */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-heading)] font-mono">Sales by Menu Category ($)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categorySalesData}>
                    <XAxis dataKey="category" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#06B6D4" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
