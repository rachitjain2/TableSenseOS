import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HeartHandshake, ShieldCheck, Search, Plus, Trash2, CheckCircle2, User } from 'lucide-react';
import { useRestaurantStore } from '../../stores/useRestaurantStore';

export const CustomersView: React.FC = () => {
  const { guests, addGuestProfile } = useRestaurantStore();
  const [search, setSearch] = useState('');

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) || g.phoneOrEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
              Guest Intelligence & Memory
            </span>
            <h1 className="text-xl font-bold text-[var(--text-heading)]">Restaurant Memory CRM</h1>
          </div>
        </div>

        {/* Privacy Framing */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>GDPR / Privacy Compliant Memory Store</span>
        </div>
      </div>

      {/* Guest Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuests.map((guest) => (
          <div key={guest.id} className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  {guest.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-heading)]">{guest.name}</h3>
                  <span className="text-xs font-mono text-[var(--text-muted)]">{guest.phoneOrEmail}</span>
                </div>
              </div>

              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                Sentiment {guest.sentimentScore}%
              </span>
            </div>

            {/* Visit Stats */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[var(--surface-2)] text-xs font-mono text-center">
              <div>
                <span className="text-[var(--text-muted)] block text-[10px]">Total Visits</span>
                <span className="font-bold text-[var(--text-heading)]">{guest.totalVisits}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block text-[10px]">Lifetime Spend</span>
                <span className="font-bold text-emerald-400">${guest.lifetimeSpend}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block text-[10px]">Pref Zone</span>
                <span className="font-bold text-indigo-400">{guest.preferredTableZone}</span>
              </div>
            </div>

            {/* Dietary Needs & Favorite Dishes */}
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[var(--text-muted)] font-mono">Dietary:</span>
                {guest.dietaryPreferences.map((d, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono text-[10px]">
                    {d}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[var(--text-muted)] font-mono">Allergies:</span>
                {guest.allergies.length > 0 ? (
                  guest.allergies.map((a, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-mono text-[10px]">
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">None logged</span>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="p-3 rounded-xl bg-[var(--surface-2)] text-xs text-[var(--text-secondary)] italic">
              "{guest.notes}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
