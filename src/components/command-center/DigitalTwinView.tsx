import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Utensils, AlertCircle, Flame, AlertTriangle, Sparkles, Eye } from 'lucide-react';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { useUIStore } from '../../stores/useUIStore';
import { TableStatus } from '../../types';
import { formatCurrency, getStatusColor } from '../../lib/utils';
import { TimelinePlaybackControl } from '../ui/TimelinePlaybackControl';

export const DigitalTwinView: React.FC = () => {
  const { tables, orders, ingredients, updateTableStatus } = useRestaurantStore();
  const { enterStaffPreview } = useUIStore();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [isBottleneckMode, setIsBottleneckMode] = useState<boolean>(false);
  const [playbackTimeMinute, setPlaybackTimeMinute] = useState<number>(1170);

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0];
  const linkedOrder = orders.find((o) => o.id === selectedTable?.orderId || o.tableNumber === selectedTable?.number);

  const zones = ['All', 'Main Dining', 'Patio', 'VIP Lounge', 'Chef Bar'];
  const filteredTables = selectedZone === 'All' ? tables : tables.filter((t) => t.zone === selectedZone);

  // Kitchen Load Calculation
  const activeKitchenTickets = orders.filter((o) => o.status === 'in_kitchen' || o.status === 'confirmed').length;
  const kitchenCapacityMax = 12;
  const kitchenLoadPercent = Math.min(100, Math.round((activeKitchenTickets / kitchenCapacityMax) * 100));

  const criticalIngredient = ingredients.find((i) => i.status === 'critical' || i.status === 'out_of_stock');

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Real-Time Floor Intelligence
              </span>
              <h1 className="text-xl font-bold text-[var(--text-heading)]">Digital Twin Floor Plan</h1>
            </div>
          </div>
        </div>

        {/* Zone Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] overflow-x-auto max-w-full">
          {zones.map((z) => (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedZone === z
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* Bottleneck Warning Overlay Banner if Bottleneck Mode Active */}
      {isBottleneckMode && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex flex-wrap items-center justify-between gap-3 text-amber-300 font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce" />
            <span>
              <strong>BOTTLENECK ANALYSIS ACTIVE:</strong> Kitchen load reached 88% capacity at 19:30 (Friday Dinner Peak).
            </span>
          </div>
          <span className="text-[10px] bg-amber-500/20 px-2 py-1 rounded border border-amber-500/30">
            Critical Window: 19:15 - 20:00
          </span>
        </div>
      )}

      {/* Main Floor Visual Layout + Table Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Floor Canvas (or Split View if Compare Days is active) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* Primary Floor Canvas */}
            <div className="glass-panel p-6 rounded-2xl relative min-h-[460px] flex flex-col justify-between">
              {/* Top Floorplan Status Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--border-muted)]">
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-[11px] font-bold text-indigo-400">
                    {isCompareMode ? 'Primary Date: July 25 (Today)' : 'Live Floor State'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-amber-300">Seated/Ordered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-emerald-300">Food Served</span>
                  </div>
                </div>

                {/* Kitchen Load Meter Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono">
                  <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span className="text-amber-300 font-semibold">Kitchen Load: {kitchenLoadPercent}%</span>
                </div>
              </div>

              {/* Interactive Spatial Floor Plan Grid */}
              <div className="relative flex-1 bg-[var(--surface-2)]/50 rounded-2xl border border-[var(--border-muted)] p-6 min-h-[320px] grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-items-center">
                {filteredTables.map((tbl) => {
                  const styles = getStatusColor(tbl.status);
                  const isSelected = selectedTable?.id === tbl.id;
                  const isBottleneckedTable = isBottleneckMode && tbl.number === 7;

                  return (
                    <motion.div
                      key={tbl.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTableId(tbl.id)}
                      className={`w-full max-w-[140px] p-4 rounded-2xl cursor-pointer transition-all border relative flex flex-col items-center justify-between gap-2 shadow-lg ${
                        styles.bg
                      } ${styles.border} ${isSelected ? 'ring-2 ring-cyan-400 scale-105 shadow-cyan-500/20' : ''} ${
                        isBottleneckedTable ? 'ring-2 ring-amber-400 bg-amber-500/20 animate-pulse' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between w-full text-[10px] font-mono">
                        <span className="font-bold text-[var(--text-heading)]">T-{tbl.number}</span>
                        <span className="text-[var(--text-muted)]">{tbl.capacity} seats</span>
                      </div>

                      <div className="text-center my-1">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${styles.text}`}>
                          {tbl.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                          {tbl.timeInStatusMinutes}m ago
                        </span>
                      </div>

                      <div className="w-full pt-2 border-t border-[var(--border-muted)] flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-mono">
                        <span>Staff:</span>
                        <span className="text-indigo-400 font-semibold truncate max-w-[70px]">
                          {tbl.assignedStaffName?.split(' ')[0] || 'Unassigned'}
                        </span>
                      </div>

                      {isBottleneckedTable && (
                        <div className="absolute -top-2 -right-2 p-1 rounded-full bg-amber-500 text-black text-[9px] font-bold">
                          18m Wait
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Compare Days Second Canvas (Side-by-side when Compare Mode is ON) */}
            {isCompareMode && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-mono font-bold text-indigo-300">
                      Comparison Date: July 18 (Last Friday)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">
                    Synched Playback
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--surface-2)] text-xs text-[var(--text-primary)] space-y-2">
                  <span className="font-mono text-indigo-400 font-bold block">AI Comparative Summary:</span>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Last Friday at 19:30 had +2 additional staff members, resulting in 4.5 minutes faster average dish turnaround.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Timeline Playback Control Dock */}
          <TimelinePlaybackControl
            onTimeChange={(minute) => setPlaybackTimeMinute(minute)}
            onCompareToggle={(enabled) => setIsCompareMode(enabled)}
            onBottleneckToggle={(enabled) => setIsBottleneckMode(enabled)}
            isCompareMode={isCompareMode}
            isBottleneckMode={isBottleneckMode}
          />
        </div>

        {/* Right Table Inspector Panel (1/3 width) */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">
                Digital Inspector
              </span>
              <h2 className="text-lg font-bold text-[var(--text-heading)]">Table #{selectedTable.number} Node</h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {selectedTable.zone}
            </span>
          </div>

          {/* Status Quick Updater Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[var(--text-muted)] block">Update Table State</span>
              <button
                onClick={() => enterStaffPreview(selectedTable.number, 'digital-twin')}
                className="py-1 px-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
              >
                <Eye className="w-3 h-3 text-cyan-400" />
                <span>Preview Guest App</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['empty', 'seated', 'ordered', 'food_served', 'needs_bill', 'needs_cleaning'] as TableStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => updateTableStatus(selectedTable.id, st)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono capitalize transition-all border ${
                      selectedTable.status === st
                        ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold border-transparent'
                        : 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Table Metrics */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Current Seated Guests:</span>
              <span className="font-mono font-bold text-[var(--text-heading)]">{selectedTable.currentGuests} / {selectedTable.capacity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Assigned Waiter:</span>
              <span className="font-mono font-bold text-indigo-400">{selectedTable.assignedStaffName || 'Unassigned'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Time in State:</span>
              <span className="font-mono text-amber-400">{selectedTable.timeInStatusMinutes} minutes</span>
            </div>
          </div>

          {/* Active Order Details if exists */}
          {linkedOrder ? (
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400">Order {linkedOrder.orderNumber}</span>
                <span className="text-xs font-mono font-bold text-[var(--text-heading)]">
                  {formatCurrency(linkedOrder.totalAmount)}
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-indigo-500/10 text-xs">
                {linkedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-[var(--text-primary)]">
                    <span>{item.quantity}x {item.menuItemName}</span>
                    <span className="font-mono">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[var(--text-muted)] font-mono bg-[var(--surface-2)] rounded-xl">
              No active order ticket linked to Table #{selectedTable.number}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
