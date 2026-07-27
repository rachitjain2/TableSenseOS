import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Search, Clock, AlertCircle, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { Order, OrderStatus } from '../../types';
import { formatCurrency, getStatusColor } from '../../lib/utils';

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus } = useRestaurantStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const pipelineColumns: { status: OrderStatus; label: string }[] = [
    { status: 'new', label: 'New QR / Walk-in' },
    { status: 'confirmed', label: 'Confirmed' },
    { status: 'in_kitchen', label: 'In Kitchen (KDS)' },
    { status: 'ready', label: 'Ready to Serve' },
    { status: 'served', label: 'Served' },
    { status: 'billed', label: 'Billed / Complete' },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.guestName && o.guestName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      `table ${o.tableNumber}`.includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || o.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
              Service Operations
            </span>
            <h1 className="text-xl font-bold text-[var(--text-heading)]">Orders Kanban Pipeline</h1>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search table, guest, #order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[var(--surface-2)] border border-[var(--border-muted)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none"
          >
            <option value="all">All Order Types</option>
            <option value="dine_in">Dine-In</option>
            <option value="qr_table">QR Table</option>
            <option value="takeaway">Takeaway</option>
          </select>
        </div>
      </div>

      {/* Kanban Pipeline Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {pipelineColumns.map((col) => {
          const colOrders = filteredOrders.filter((o) => o.status === col.status);

          return (
            <div key={col.status} className="glass-panel p-3 rounded-2xl min-w-[200px] flex flex-col h-[650px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-muted)]">
                <span className="text-xs font-mono font-bold uppercase text-[var(--text-muted)]">{col.label}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-indigo-400 font-bold">
                  {colOrders.length}
                </span>
              </div>

              {/* Order Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colOrders.map((order) => {
                  const statusColors = getStatusColor(order.status);

                  return (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] hover:border-indigo-500/30 transition-all space-y-2 shadow-sm"
                    >
                      {/* Top Order Row */}
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-[var(--text-heading)]">{order.orderNumber}</span>
                        <span className="text-indigo-400 font-bold">T-{order.tableNumber}</span>
                      </div>

                      {/* Guest & Time */}
                      <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[var(--text-muted)]" />
                          {order.guestName || 'Guest'}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[var(--text-muted)]">
                          <Clock className="w-3 h-3" />
                          {order.kitchenTicketAgeMinutes}m
                        </span>
                      </div>

                      {/* Items Brief */}
                      <div className="space-y-1 py-1.5 border-y border-[var(--border-muted)] text-xs text-[var(--text-primary)]">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-[11px]">
                            <span className="truncate max-w-[130px]">
                              {item.quantity}x {item.menuItemName}
                            </span>
                            <span className="font-mono">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* AI Anomaly Flag */}
                      {order.isDelayedByAI && (
                        <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 font-mono flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span className="truncate">{order.delayReason}</span>
                        </div>
                      )}

                      {/* Next Status Progress Button */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-mono font-bold text-[var(--text-heading)]">
                          {formatCurrency(order.totalAmount)}
                        </span>

                        {col.status !== 'billed' && (
                          <button
                            onClick={() => {
                              const statusSequence: OrderStatus[] = [
                                'new',
                                'confirmed',
                                'in_kitchen',
                                'ready',
                                'served',
                                'billed',
                              ];
                              const nextIdx = statusSequence.indexOf(order.status) + 1;
                              if (nextIdx < statusSequence.length) {
                                updateOrderStatus(order.id, statusSequence[nextIdx]);
                              }
                            }}
                            className="p-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs transition-colors"
                            title="Advance Order Status"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {colOrders.length === 0 && (
                  <div className="p-6 text-center text-[11px] text-[var(--text-muted)] font-mono">
                    No orders in this stage.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
