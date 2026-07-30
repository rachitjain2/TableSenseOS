import React, { useState } from 'react';
import {
  LayoutDashboard,
  Cpu,
  FlaskConical,
  ClipboardList,
  Utensils,
  Box,
  Users,
  HeartHandshake,
  Leaf,
  Building2,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useUIStore, CommandTab } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const SidebarNav: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { activeTab, setActiveTab, setCopilotOpen } = useUIStore();
  const { user, signOut } = useAuthStore();

  const navGroups: {
    groupTitle: string;
    items: { tab: CommandTab; label: string; icon: any; isAi?: boolean }[];
  }[] = [
    {
      groupTitle: 'Overview',
      items: [
        { tab: 'dashboard', label: 'Brain Dashboard', icon: LayoutDashboard },
        { tab: 'executive', label: 'Executive Intelligence', icon: ShieldCheck, isAi: true },
        { tab: 'digital-twin', label: 'Digital Twin Floor', icon: Cpu },
      ],
    },
    {
      groupTitle: 'Operations',
      items: [
        { tab: 'orders', label: 'Orders Pipeline', icon: ClipboardList },
        { tab: 'kitchen', label: 'Kitchen KDS', icon: Utensils },
        { tab: 'inventory', label: 'Predictive Stock', icon: Box },
        { tab: 'tables', label: 'Tables & Queue', icon: Users },
        { tab: 'staff', label: 'Staff & Training', icon: Users },
      ],
    },
    {
      groupTitle: 'Intelligence',
      items: [
        { tab: 'simulation', label: 'Simulation Lab', icon: FlaskConical, isAi: true },
        { tab: 'sustainability', label: 'Sustainability Engine', icon: Leaf },
        { tab: 'analytics', label: 'Analytics & Trends', icon: BarChart3 },
      ],
    },
    {
      groupTitle: 'Growth & System',
      items: [
        { tab: 'customers', label: 'Restaurant Memory', icon: HeartHandshake },
        { tab: 'multi-branch', label: 'Multi-Branch OS', icon: Building2 },
        { tab: 'settings', label: 'System Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`h-[calc(100vh-4rem)] border-r border-[var(--border-muted)] glass-panel sticky top-16 z-20 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-[var(--border-muted)]">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h1 className="font-display font-extrabold text-sm tracking-tight text-[var(--text-heading)]">
                  TableSense <span className="text-cyan-400 font-mono text-xs">OS</span>
                </h1>
                <span className="text-[10px] font-mono text-indigo-400 block -mt-0.5">AI Restaurant Brain</span>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="mx-auto w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors hidden sm:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] px-3 font-semibold block mb-1">
                  {group.groupTitle}
                </span>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;

                return (
                  <button
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[var(--text-muted)]'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.isAi && (
                      <span className="ml-auto text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                        AI
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Footer Widget */}
      {!collapsed && (
        <div className="p-3 m-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Brain Operating</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Autonomous safety guardrails active across 3 branches.
          </p>
          <button
            onClick={() => setCopilotOpen(true)}
            className="w-full py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold hover:bg-indigo-500 transition-colors"
          >
            Ask Brain Copilot
          </button>
        </div>
      )}

      {/* Log Out Button */}
      {user && (
        <div className={`px-2 pb-2 ${collapsed ? '' : ''}`}>
          <button
            onClick={() => signOut()}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && (
              <div className="flex flex-col items-start min-w-0">
                <span>Log Out</span>
                <span className="text-[10px] text-[var(--text-muted)] font-normal truncate max-w-[140px]">
                  {user.email}
                </span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Team & Mission Footer */}
      {!collapsed && (
        <div className="px-3 pb-3 pt-1 text-center">
          <button
            onClick={() => setActiveTab('settings')}
            className="w-full text-center group transition-opacity hover:opacity-80 focus:outline-none"
            title="Click to view Team Vision & Members in Settings"
          >
            <p className="text-[10px] text-[var(--text-muted)] group-hover:text-indigo-400 leading-tight transition-colors">
              Proudly built by a passionate multidisciplinary team dedicated to revolutionizing restaurant operations with AI.
            </p>
            <span className="text-[9px] font-mono text-indigo-400 mt-1 inline-block opacity-80 group-hover:underline">
              Meet the Team & Vision →
            </span>
          </button>
        </div>
      )}
    </aside>
  );
};
