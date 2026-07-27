import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Box, AlertTriangle, RefreshCw, Truck, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { formatMinutes } from '../../lib/utils';

export const InventoryView: React.FC = () => {
  const { ingredients, reorderIngredient, menuItems } = useRestaurantStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Produce', 'Dairy', 'Meat & Seafood', 'Spices & Pantry', 'Beverages'];

  const filteredIngredients =
    selectedCategory === 'All' ? ingredients : ingredients.filter((i) => i.category === selectedCategory);

  const lowStockCount = ingredients.filter((i) => i.status === 'low_stock' || i.status === 'critical' || i.status === 'out_of_stock').length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              Autonomous Stock Engine
            </span>
            <h1 className="text-xl font-bold text-[var(--text-heading)]">Predictive Inventory Engine</h1>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black font-bold shadow'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Autonomous AI Stock Warning Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
            <p className="text-xs sm:text-sm font-mono">
              <span className="font-bold text-white">Predictive Depletion Warning:</span> {lowStockCount} ingredient(s) are near critical thresholds. TableSense Brain is monitoring menu availability linked to stock levels.
            </p>
          </div>
        </div>
      )}

      {/* Ingredients Grid Table */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[var(--border-muted)] text-[var(--text-muted)] uppercase tracking-wider">
                <th className="py-3 px-4">Ingredient</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Est. Depletion Time</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Autonomous Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border-muted)]">
              {filteredIngredients.map((ing) => {
                const linkedDishes = menuItems.filter((m) => m.linkedIngredientIds.includes(ing.id));

                return (
                  <tr key={ing.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    {/* Name & Linked Dishes */}
                    <td className="py-4 px-4 font-semibold text-[var(--text-heading)]">
                      <div>{ing.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono font-normal">
                        Linked Menu Items: {linkedDishes.map((d) => d.name).join(', ') || 'None'}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-[var(--text-secondary)]">{ing.category}</td>

                    {/* Stock Level */}
                    <td className="py-4 px-4 font-bold">
                      <span className={ing.stockLevel === 0 ? 'text-rose-400' : ing.stockLevel < ing.reorderThreshold ? 'text-amber-400' : 'text-emerald-400'}>
                        {ing.stockLevel} {ing.unit}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] block">Threshold: {ing.reorderThreshold} {ing.unit}</span>
                    </td>

                    {/* Depletion Time */}
                    <td className="py-4 px-4 text-[var(--text-primary)]">
                      {ing.stockLevel === 0 ? (
                        <span className="text-rose-400 font-bold">DEPLETED (0 mins)</span>
                      ) : (
                        <span>~{formatMinutes(ing.estimatedDepletionTimeMinutes)} remaining</span>
                      )}
                    </td>

                    {/* Supplier */}
                    <td className="py-4 px-4 text-[var(--text-secondary)]">
                      <div>{ing.supplierName}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{ing.supplierContact}</div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ${
                          ing.status === 'out_of_stock'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : ing.status === 'critical'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {ing.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Reorder Button */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => reorderIngredient(ing.id, 10)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/20 transition-all"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Reorder +10 {ing.unit}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
