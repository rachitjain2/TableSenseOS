import React from 'react';
import { Search, Sparkles, Sun, Moon, Building2, UserCheck, ShieldCheck, Smartphone, Monitor } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { AutonomousActionsLogModal } from './AutonomousActionsLogModal';
import { UserRole } from '../../types';

export const TopBar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    activeTab,
    userRole,
    setUserRole,
    theme,
    toggleTheme,
    setCommandPaletteOpen,
    setCopilotOpen,
    enterStaffPreview,
    exitStaffPreview,
  } = useUIStore();

  const { activeBranchId, setActiveBranch, branches, healthScore } = useRestaurantStore();

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const roles: { role: UserRole; label: string }[] = [
    { role: 'owner', label: 'Ritika (Owner)' },
    { role: 'manager', label: 'Arjun (Manager)' },
    { role: 'kitchen_staff', label: 'Meena (Chef)' },
    { role: 'waitstaff', label: 'Kabir (Waiter)' },
    { role: 'guest', label: 'Sana (Guest App)' },
  ];

  return (
    <header className="h-16 px-4 sm:px-6 border-b border-[var(--border-muted)] glass-panel sticky top-0 z-30 flex items-center justify-between gap-4">
      {/* Left: Branch Switcher & View Mode Toggle */}
      <div className="flex items-center gap-3">
        {/* Branch Switcher Dropdown */}
        <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] text-xs font-semibold text-[var(--text-heading)]">
          <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <select
            value={activeBranchId}
            onChange={(e) => setActiveBranch(e.target.value)}
            className="bg-transparent outline-none cursor-pointer text-xs font-medium pr-2 text-[var(--text-primary)]"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id} className="bg-[var(--surface-1)] text-[var(--text-primary)]">
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Switcher: Command Center vs Guest App */}
        <div className="hidden md:flex items-center p-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] text-xs font-medium">
          <button
            onClick={() => exitStaffPreview()}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'command-center'
                ? 'bg-indigo-600 text-white font-semibold shadow'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Command Center</span>
          </button>

          <button
            onClick={() => enterStaffPreview(4, activeTab)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'guest-app'
                ? 'bg-cyan-600 text-white font-semibold shadow'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Guest QR App</span>
          </button>
        </div>
      </div>

      {/* Middle: Global Cmd+K Search Bar */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-main)] transition-all w-72"
      >
        <Search className="w-4 h-4 text-[var(--text-muted)]" />
        <span className="flex-1 text-left">Search or ask Brain...</span>
        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-3)] text-[var(--text-secondary)]">
          ⌘K
        </kbd>
      </button>

      {/* Right: Health Score, Audit Trail, Copilot, Role Switcher, Theme */}
      <div className="flex items-center gap-2.5">
        {/* Health Score Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Health {healthScore?.overallScore ?? 87}</span>
        </div>

        {/* Autonomous Audit Trail Modal Trigger */}
        <div className="hidden xl:block">
          <AutonomousActionsLogModal />
        </div>

        {/* AI Copilot Persistent Trigger */}
        <button
          onClick={() => setCopilotOpen(true)}
          className="relative group p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
          title="Open AI Brain Copilot"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        </button>

        {/* Role Persona Switcher */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] text-xs">
          <UserCheck className="w-3.5 h-3.5 text-indigo-400 hidden sm:block shrink-0" />
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="bg-transparent outline-none cursor-pointer text-xs font-medium text-[var(--text-primary)]"
          >
            {roles.map((r) => (
              <option key={r.role} value={r.role} className="bg-[var(--surface-1)] text-[var(--text-primary)]">
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>
    </header>
  );
};
