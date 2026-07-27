import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, DollarSign, TrendingUp, ScatterChart as ScatterIcon, Check, ArrowUpRight, Zap, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { useUIStore } from '../../stores/useUIStore';
import { PricingSuggestion } from '../../types';
import { formatCurrency } from '../../lib/utils';

export const SmartPricingTab: React.FC = () => {
  const { menuItems, addAIInsight } = useRestaurantStore();
  const { setActiveTab } = useUIStore();

  const [suggestions, setSuggestions] = useState<PricingSuggestion[]>([
    {
      id: 'pr-1',
      menuItemId: 'menu-1',
      menuItemName: 'A5 Wagyu Smash Burger',
      currentPrice: 28,
      suggestedPrice: 31,
      pricingReasoning: 'Popularity score 94/100 during Friday peak. Inelastic demand elasticity allows +$3 margin increase.',
      demandLevel: 'high',
      quadrant: 'Stars',
      profitMarginPercent: 68,
      popularityScore: 94,
      estimatedRevenueImpact: 320,
      status: 'suggested',
    },
    {
      id: 'pr-2',
      menuItemId: 'menu-2',
      menuItemName: 'Smoked Paneer Tikka Skewers',
      currentPrice: 18,
      suggestedPrice: 16.5,
      pricingReasoning: 'Fresh Paneer stock level approaching reorder threshold in 38 mins. -8% price micro-adjustment turns inventory before expiry.',
      demandLevel: 'medium',
      quadrant: 'Plowhorses',
      profitMarginPercent: 58,
      popularityScore: 78,
      estimatedRevenueImpact: 190,
      status: 'suggested',
    },
    {
      id: 'pr-3',
      menuItemId: 'menu-3',
      menuItemName: 'Saffron & Mint Sparkler',
      currentPrice: 12,
      suggestedPrice: 14,
      pricingReasoning: 'High-margin beverage pairing with 88% attachment rate for Patio tables.',
      demandLevel: 'high',
      quadrant: 'Stars',
      profitMarginPercent: 82,
      popularityScore: 88,
      estimatedRevenueImpact: 210,
      status: 'suggested',
    },
  ]);

  const menuMatrixData = [
    { x: 94, y: 68, name: 'A5 Wagyu Burger', quadrant: 'Stars' },
    { x: 88, y: 82, name: 'Saffron Sparkler', quadrant: 'Stars' },
    { x: 78, y: 58, name: 'Paneer Tikka', quadrant: 'Plowhorses' },
    { x: 35, y: 74, name: 'Truffle Pasta', quadrant: 'Puzzles' },
    { x: 22, y: 40, name: 'Cold Lentil Salad', quadrant: 'Dogs' },
  ];

  const handleApplyPricing = (sug: PricingSuggestion) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === sug.id ? { ...s, status: 'applied' } : s))
    );

    addAIInsight({
      title: `Applied Smart Price Adjustment: ${sug.menuItemName}`,
      category: 'pricing',
      confidenceScore: 95,
      plainLanguageReasoning: `Adjusted price from ${formatCurrency(sug.currentPrice)} to ${formatCurrency(sug.suggestedPrice)}. Projected revenue impact: +$${sug.estimatedRevenueImpact}.`,
      dataSignalsUsed: ['Smart Pricing Elasticity Engine', 'Inventory Freshness Index'],
      suggestedAction: {
        label: 'Undo Price Adjustment',
        actionType: 'adjust_price',
        payload: { menuItemId: sug.menuItemId, targetPrice: sug.currentPrice },
      },
      status: 'auto_applied',
      sourceAgent: 'BusinessAdvisorAgent',
      expectedBusinessImpact: `+$${sug.estimatedRevenueImpact} margin boost.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Active Price Yield Index</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--text-heading)] font-display">+8.4%</div>
          <p className="text-xs text-emerald-400 mt-1 font-mono">Margin optimization across 14 items</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Projected Revenue Lift</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 font-display">+$720/day</div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">Dynamic peak & bundle adjustments</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Waste Mitigation Discounting</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--text-heading)] font-display">2 Active</div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">Time-boxed discount on expiring prep</p>
        </div>
      </div>

      {/* Menu Engineering 4-Quadrant Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">
              Boston Consulting Group Matrix
            </span>
            <h3 className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-2">
              <ScatterIcon className="w-4 h-4 text-indigo-400" /> Menu Engineering Classification
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Stars (High Pop, High Margin)</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Plowhorses (High Pop, Low Margin)</span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" opacity={0.3} />
              <XAxis type="number" dataKey="x" name="Popularity" unit="%" stroke="var(--text-muted)" fontSize={11} />
              <YAxis type="number" dataKey="y" name="Profit Margin" unit="%" stroke="var(--text-muted)" fontSize={11} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'var(--surface-2)',
                  borderColor: 'var(--border-main)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Scatter name="Menu Items" data={menuMatrixData} fill="#818cf8">
                {menuMatrixData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.quadrant === 'Stars'
                        ? '#34d399'
                        : entry.quadrant === 'Plowhorses'
                        ? '#38bdf8'
                        : entry.quadrant === 'Puzzles'
                        ? '#fbbf24'
                        : '#f43f5e'
                    }
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Dynamic Pricing Suggestions */}
      <div className="glass-panel p-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-1)] space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-heading)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Live AI Pricing & Margin Optimization Recommendations
        </h3>

        <div className="space-y-3">
          {suggestions.map((sug) => (
            <div
              key={sug.id}
              className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] flex flex-wrap items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text-heading)] text-sm">{sug.menuItemName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Quadrant: {sug.quadrant}
                  </span>
                </div>
                <p className="text-[var(--text-secondary)]">{sug.pricingReasoning}</p>
                <div className="flex items-center gap-3 font-mono text-[10px] text-[var(--text-muted)] pt-1">
                  <span>Current: {formatCurrency(sug.currentPrice)}</span>
                  <span className="text-cyan-400 font-bold">Suggested: {formatCurrency(sug.suggestedPrice)}</span>
                  <span className="text-emerald-400 font-bold">Lift: +${sug.estimatedRevenueImpact}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('simulation')}
                  className="px-3 py-1.5 rounded-xl bg-[var(--surface-3)] text-[var(--text-primary)] font-semibold hover:bg-[var(--surface-2)] transition-colors flex items-center gap-1"
                >
                  <span>Test in Simulation</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                {sug.status === 'applied' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Applied
                  </span>
                ) : (
                  <button
                    onClick={() => handleApplyPricing(sug)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold shadow-md transition-all hover:scale-[1.02]"
                  >
                    Apply Price
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
