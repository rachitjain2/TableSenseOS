import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Clock, Calendar, Plus, Sparkles, UserCheck, CheckCircle2, QrCode, Eye } from 'lucide-react';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { useUIStore } from '../../stores/useUIStore';

export const TablesView: React.FC = () => {
  const { tables, updateTableStatus } = useRestaurantStore();
  const { enterStaffPreview } = useUIStore();

  const [walkinQueue, setWalkinQueue] = useState([
    { id: 'q-1', name: 'Sophia Martinez', partySize: 2, estimatedWaitMins: 10, arrivedAt: '18:45' },
    { id: 'q-2', name: 'Liam O\'Connor', partySize: 4, estimatedWaitMins: 18, arrivedAt: '18:50' },
  ]);

  const [newGuestName, setNewGuestName] = useState('');
  const [newPartySize, setNewPartySize] = useState('2');

  const addWalkin = () => {
    if (!newGuestName.trim()) return;
    const estWait = Math.round(Number(newPartySize) * 4 + walkinQueue.length * 6);
    setWalkinQueue([
      ...walkinQueue,
      {
        id: `q-${Date.now()}`,
        name: newGuestName,
        partySize: parseInt(newPartySize),
        estimatedWaitMins: estWait,
        arrivedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      },
    ]);
    setNewGuestName('');
  };

  const removeWalkin = (id: string) => {
    setWalkinQueue(walkinQueue.filter((q) => q.id !== id));
  };

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
              Floor & Reservation Engine
            </span>
            <h1 className="text-xl font-bold text-[var(--text-heading)]">Tables & Walk-in Queue</h1>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Table Layout Status, Right Walk-In Queue Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Tables Grid (2/3 width) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-[var(--text-heading)] mb-2">Live Table Grid Management</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tables.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-[var(--text-heading)] text-sm">Table #{t.number}</span>
                  <span className="text-[var(--text-muted)]">{t.capacity} seats</span>
                </div>

                <div className="text-[11px] font-mono text-[var(--text-secondary)]">
                  Zone: <span className="text-indigo-400">{t.zone}</span>
                </div>

                <div className="pt-2 border-t border-[var(--border-muted)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                      {t.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => updateTableStatus(t.id, t.status === 'empty' ? 'seated' : 'empty')}
                      className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-mono hover:bg-indigo-500/20"
                    >
                      Toggle State
                    </button>
                  </div>

                  <button
                    onClick={() => enterStaffPreview(t.number, 'tables')}
                    className="w-full py-1.5 px-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>Preview Guest Experience</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Walk-in Queue & AI Wait Estimator (1/3 width) */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="border-b border-[var(--border-muted)] pb-3">
            <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">
              Predictive Wait Time Engine
            </span>
            <h2 className="text-base font-bold text-[var(--text-heading)]">Walk-in Queue ({walkinQueue.length})</h2>
          </div>

          {/* Add Walk-in Form */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] space-y-3">
            <span className="text-xs font-mono font-bold text-[var(--text-heading)] block">Add Walk-in Party</span>
            <input
              type="text"
              placeholder="Guest Name..."
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              className="w-full bg-[var(--surface-1)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] outline-none"
            />
            <div className="flex items-center gap-2">
              <select
                value={newPartySize}
                onChange={(e) => setNewPartySize(e.target.value)}
                className="bg-[var(--surface-1)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] outline-none flex-1"
              >
                <option value="2">2 Guests</option>
                <option value="4">4 Guests</option>
                <option value="6">6 Guests</option>
                <option value="8">8 Guests</option>
              </select>
              <button
                onClick={addWalkin}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono transition-colors"
              >
                Add Queue
              </button>
            </div>
          </div>

          {/* Queue List */}
          <div className="space-y-3">
            {walkinQueue.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-[var(--text-heading)]">{q.name}</h4>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    Party of {q.partySize} • Arrived {q.arrivedAt}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-400 block">
                    ~{q.estimatedWaitMins}m wait
                  </span>
                  <button
                    onClick={() => removeWalkin(q.id)}
                    className="text-[10px] text-emerald-400 hover:underline font-mono"
                  >
                    Seat Guest
                  </button>
                </div>
              </div>
            ))}

            {walkinQueue.length === 0 && (
              <div className="p-6 text-center text-xs font-mono text-[var(--text-muted)]">
                Walk-in queue is currently empty.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
