import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, LayoutDashboard, Cpu, FlaskConical, ClipboardList, Utensils, Box, Users, HeartHandshake, Leaf, Building2, BarChart3, Settings } from 'lucide-react';
import { useUIStore, CommandTab } from '../../stores/useUIStore';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setActiveTab, setCopilotOpen } = useUIStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const commandItems: { label: string; icon: any; tab?: CommandTab; isAi?: boolean }[] = [
    { label: 'Ask Restaurant Brain Copilot', icon: Sparkles, isAi: true },
    { label: 'Dashboard & Brain Overview', icon: LayoutDashboard, tab: 'dashboard' },
    { label: 'Digital Twin Interactive Floorplan', icon: Cpu, tab: 'digital-twin' },
    { label: 'Simulation Lab (What-If Scenarios)', icon: FlaskConical, tab: 'simulation' },
    { label: 'Orders & Service Pipeline', icon: ClipboardList, tab: 'orders' },
    { label: 'Kitchen Display System (KDS)', icon: Utensils, tab: 'kitchen' },
    { label: 'Inventory & Stock Predictive Engine', icon: Box, tab: 'inventory' },
    { label: 'Tables & Reservation Layout', icon: Users, tab: 'tables' },
    { label: 'Staff Shift Roster & Training', icon: Users, tab: 'staff' },
    { label: 'Restaurant Memory (Guest Profiles)', icon: HeartHandshake, tab: 'customers' },
    { label: 'Sustainability & Waste Playbook', icon: Leaf, tab: 'sustainability' },
    { label: 'Multi-Branch Intelligence', icon: Building2, tab: 'multi-branch' },
    { label: 'Deep-Dive Analytics', icon: BarChart3, tab: 'analytics' },
    { label: 'System Settings & Safety Bounds', icon: Settings, tab: 'settings' },
  ];

  const filteredItems = commandItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={() => setCommandPaletteOpen(false)}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative z-10 w-full max-w-xl glass-panel bg-[var(--surface-1)] rounded-2xl border border-[var(--border-main)] shadow-2xl overflow-hidden"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 p-4 border-b border-[var(--border-muted)]">
            <Search className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
            <input
              type="text"
              placeholder="Search views, trigger AI actions, or type a command..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
            />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border-muted)]">
              ESC
            </span>
          </div>

          {/* Filtered Commands List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.isAi) {
                      setCopilotOpen(true);
                    } else if (item.tab) {
                      setActiveTab(item.tab);
                    }
                    setCommandPaletteOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium text-left transition-colors ${
                    item.isAi
                      ? 'bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20'
                      : 'text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.isAi ? 'text-indigo-400' : 'text-[var(--text-muted)]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.isAi && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Gemini 3.6 Flash
                    </span>
                  )}
                </button>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="p-8 text-center text-xs text-[var(--text-muted)] font-mono">
                No matching operational command found.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
