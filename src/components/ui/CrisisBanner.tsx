import React from 'react';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { useUIStore } from '../../stores/useUIStore';

export const CrisisBanner: React.FC = () => {
  const { ingredients } = useRestaurantStore();
  const { setActiveTab } = useUIStore();

  const outOfStockItems = ingredients.filter((i) => i.status === 'out_of_stock' || i.status === 'critical');

  if (outOfStockItems.length === 0) return null;

  const topCritical = outOfStockItems[0];

  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-rose-500/5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
          <ShieldAlert className="w-5 h-5 animate-bounce" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold block">
            Critical Operational Alert
          </span>
          <p className="text-xs sm:text-sm font-semibold text-rose-200">
            {topCritical.name} is {topCritical.status === 'out_of_stock' ? 'OUT OF STOCK' : 'CRITICALLY LOW'} ({topCritical.stockLevel} {topCritical.unit}).
          </p>
        </div>
      </div>

      <button
        onClick={() => setActiveTab('inventory')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors shrink-0 shadow-md"
      >
        <span>Resolve in Inventory Engine</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
