import React from 'react';
import { motion } from 'motion/react';
import { FlaskConical, Play, Save, Sparkles, TrendingUp, Users, Clock, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSimulationStore } from '../../stores/useSimulationStore';
import { formatCurrency, formatPercent } from '../../lib/utils';

export const SimulationLabView: React.FC = () => {
  const { params, setParams, isRunning, activeResult, runSimulation, saveCurrentResult, savedScenarios } =
    useSimulationStore();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FlaskConical className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                Predictive Twin Laboratory
              </span>
              <h1 className="text-xl font-bold text-[var(--text-heading)]">Simulation Lab</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => runSimulation()}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isRunning ? 'Running Neural Simulation...' : 'Run Simulation Scenario'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Sliders Control Panel, Right Live AI Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Interactive Parameter Sliders (1/3 width) */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="border-b border-[var(--border-muted)] pb-3">
            <h2 className="text-sm font-bold text-[var(--text-heading)]">Scenario Controls</h2>
            <p className="text-xs text-[var(--text-muted)]">Construct "What-If" operational hypotheses.</p>
          </div>

          {/* 1. Footfall Multiplier Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--text-secondary)]">Expected Footfall Multiplier</span>
              <span className="text-indigo-400 font-bold">{params.footfallMultiplier}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={params.footfallMultiplier}
              onChange={(e) => setParams({ footfallMultiplier: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
              <span>0.5x Slow</span>
              <span>1.0x Normal</span>
              <span>2.5x Huge Rush</span>
            </div>
          </div>

          {/* 2. Staff Absent Count Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--text-secondary)]">Staff Absent / Unplanned Absence</span>
              <span className="text-amber-400 font-bold">{params.staffAbsentCount} Staff Off</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={params.staffAbsentCount}
              onChange={(e) => setParams({ staffAbsentCount: parseInt(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* 3. Price Adjustment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--text-secondary)]">Menu Price Shift %</span>
              <span className="text-cyan-400 font-bold">{params.priceAdjustmentPercent}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              step="5"
              value={params.priceAdjustmentPercent}
              onChange={(e) => setParams({ priceAdjustmentPercent: parseInt(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* 4. Weather Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-[var(--text-secondary)] block">External Weather / Event</label>
            <select
              value={params.weatherCondition}
              onChange={(e) => setParams({ weatherCondition: e.target.value as any })}
              className="w-full bg-[var(--surface-2)] border border-[var(--border-main)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] outline-none"
            >
              <option value="Sunny">Sunny Clear Day</option>
              <option value="Heavy Rain">Heavy Rain & Storm</option>
              <option value="Weekend Event">Concert / Sports Event Nearby</option>
              <option value="Heatwave">Heatwave</option>
            </select>
          </div>

          {/* 5. Timeframe Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-[var(--text-secondary)] block">Timeframe Window</label>
            <select
              value={params.simulatedTimeFrame}
              onChange={(e) => setParams({ simulatedTimeFrame: e.target.value as any })}
              className="w-full bg-[var(--surface-2)] border border-[var(--border-main)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] outline-none"
            >
              <option value="Lunch Peak">Lunch Peak (12:00 - 14:30)</option>
              <option value="Dinner Rush">Dinner Rush (18:30 - 21:30)</option>
              <option value="All Day">Full 24-Hour Cycle</option>
            </select>
          </div>
        </div>

        {/* Right AI Simulation Results (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {activeResult ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-2xl space-y-6"
            >
              {/* Header Result Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-muted)]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                    Simulated Scenario Outcome
                  </span>
                  <h2 className="text-lg font-bold text-[var(--text-heading)]">{activeResult.scenarioName}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Confidence: {activeResult.confidenceRange}
                  </span>
                  <button
                    onClick={() => saveCurrentResult()}
                    className="p-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text-primary)] transition-colors"
                    title="Save Scenario"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4 Outcome Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)]">
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block mb-1">
                    Projected Revenue
                  </span>
                  <span className="text-xl font-bold font-mono text-[var(--text-heading)] block">
                    {formatCurrency(activeResult.projectedRevenue)}
                  </span>
                  <span
                    className={`text-[11px] font-mono font-semibold ${
                      activeResult.revenueChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatPercent(activeResult.revenueChangePercent)} vs baseline
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)]">
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block mb-1">
                    Avg Wait Time
                  </span>
                  <span className="text-xl font-bold font-mono text-amber-400 block">
                    {activeResult.projectedAvgWaitMinutes} mins
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">Target &lt; 15 mins</span>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)]">
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block mb-1">
                    Table Turnover
                  </span>
                  <span className="text-xl font-bold font-mono text-cyan-400 block">
                    {activeResult.tableTurnoverRate}x
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">Turns / table</span>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)]">
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block mb-1">
                    Staff Adequacy
                  </span>
                  <span className="text-xl font-bold font-mono text-indigo-400 block">
                    {activeResult.staffAdequacyScore} / 100
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">Capacity ratio</span>
                </div>
              </div>

              {/* AI Narrative Breakdown */}
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-indigo-400 font-bold">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>AI Predictive Outcome Narrative</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                  {activeResult.aiNarrativeOutcome}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold block mb-1">
                    Recommended Managerial Mitigation
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--text-primary)] font-semibold">
                    {activeResult.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Stockout Risk Warning Box */}
              <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] space-y-2">
                <span className="text-xs font-mono uppercase text-rose-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Ingredients at Stockout Risk
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeResult.highStockoutRiskIngredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-300"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-12 text-center glass-panel rounded-2xl space-y-3">
              <FlaskConical className="w-10 h-10 text-indigo-400 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-[var(--text-heading)]">Simulation Engine Idle</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                Adjust sliders on the left and click "Run Simulation Scenario" to model real-time restaurant impacts.
              </p>
            </div>
          )}

          {/* Saved Scenarios Strip */}
          {savedScenarios.length > 0 && (
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-mono uppercase text-[var(--text-muted)]">Saved Scenario Library ({savedScenarios.length})</h3>
              <div className="space-y-2">
                {savedScenarios.map((sc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[var(--surface-2)] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">{sc.scenarioName}</span>
                    <span className="font-mono text-emerald-400">{formatCurrency(sc.projectedRevenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
