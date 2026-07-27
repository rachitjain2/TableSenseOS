import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Utensils, Clock, CheckCircle2, AlertTriangle, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { Order } from '../../types';

export const KitchenView: React.FC = () => {
  const { orders, updateOrderStatus } = useRestaurantStore();
  const [activeStation, setActiveStation] = useState<string>('All');

  const kitchenOrders = orders.filter((o) => o.status === 'in_kitchen' || o.status === 'confirmed');

  const stations = ['All', 'Grill', 'Fry', 'Cold', 'Pastry'];

  const filteredOrders =
    activeStation === 'All' ? kitchenOrders : kitchenOrders.filter((o) => o.kdsStation === activeStation);

  // KDS Load calculation
  const loadCount = kitchenOrders.length;
  const loadPercentage = Math.min(100, Math.round((loadCount / 10) * 100));

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-black min-h-screen text-white">
      {/* KDS Station Header & Capacity Meter */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-amber-500/20 bg-zinc-950">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold">KDS Executive Display</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Tablet Mode
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Kitchen Display System</h1>
          </div>
        </div>

        {/* Station Filters */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          {stations.map((st) => (
            <button
              key={st}
              onClick={() => setActiveStation(st)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                activeStation === st
                  ? 'bg-amber-500 text-black border-amber-400 font-extrabold'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Capacity Utilization Bar */}
        <div className="w-full md:w-64 p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-400">Kitchen Load Index</span>
            <span className="text-amber-400 font-bold">{loadPercentage}% Capacity</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                loadPercentage > 80 ? 'bg-rose-500' : loadPercentage > 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${loadPercentage}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 block text-right">Next lull projected at 20:15</span>
        </div>
      </div>

      {/* AI Batching Suggestion Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse shrink-0" />
          <p className="text-xs sm:text-sm font-mono">
            <span className="font-bold text-white">AI KDS Batching Prompt:</span> Orders #101 and #102 contain 3 Wagyu patties and Paneer Tikka. Firing Station 1 together saves 4.2 minutes of prep recovery.
          </p>
        </div>
        <button className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold shrink-0">
          Apply Batch
        </button>
      </div>

      {/* Large Touch-Friendly Kitchen Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((ticket) => {
          const isUrgent = ticket.kitchenTicketAgeMinutes > 15;

          return (
            <motion.div
              key={ticket.id}
              layout
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className={`p-5 rounded-2xl border-2 bg-zinc-950 flex flex-col justify-between space-y-4 shadow-xl ${
                isUrgent ? 'border-rose-500/80 bg-rose-950/20' : 'border-zinc-800'
              }`}
            >
              {/* Ticket Top */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black font-mono text-amber-400">{ticket.orderNumber}</span>
                  <span className="text-lg font-bold font-mono text-white">T-{ticket.tableNumber}</span>
                </div>

                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-extrabold ${
                    isUrgent ? 'bg-rose-500 text-white animate-pulse' : 'bg-zinc-800 text-amber-400'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{ticket.kitchenTicketAgeMinutes} MINS</span>
                </div>
              </div>

              {/* Station Tag */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400 font-bold">
                  Station: {ticket.kdsStation}
                </span>
                <span className="text-zinc-400">{ticket.items.length} Items Total</span>
              </div>

              {/* Ticket Items List */}
              <div className="space-y-2 py-2 border-y border-zinc-800 flex-1">
                {ticket.items.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-amber-500 text-black font-extrabold font-mono text-base flex items-center justify-center shrink-0">
                        {item.quantity}
                      </span>
                      <span className="text-sm font-bold text-white">{item.menuItemName}</span>
                    </div>

                    {item.modifiers && item.modifiers.length > 0 && (
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                        {item.modifiers.join(', ')}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Big Tap Progress Button */}
              <button
                onClick={() => updateOrderStatus(ticket.id, 'ready')}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-sm font-mono flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>MARK TICKET READY</span>
              </button>
            </motion.div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="col-span-full p-16 text-center text-zinc-500 font-mono text-sm border-2 border-dashed border-zinc-800 rounded-2xl">
            Kitchen KDS is clear for this station! All tickets ready or served.
          </div>
        )}
      </div>
    </div>
  );
};
