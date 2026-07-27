import React, { useState } from 'react';
import { Settings, ShieldCheck, Cpu, Database, Link2, CheckCircle2, ArrowRight, Milestone, Sparkles } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [integrations, setIntegrations] = useState([
    { id: 'pos-toast', name: 'Toast POS System', category: 'POS', connected: true, status: 'Active (Realtime Stream)' },
    { id: 'delivery-doordash', name: 'DoorDash Drive API', category: 'Delivery', connected: true, status: 'Active (Dispatch Synced)' },
    { id: 'erp-sysco', name: 'Sysco EDI & ERP', category: 'ERP', connected: false, status: 'Ready to Pair' },
    { id: 'iot-oven', name: 'Rational iCombi Pro IoT', category: 'IoT Kitchen', connected: true, status: 'Active (Temp Telemetry)' },
    { id: 'smart-fridge', name: 'Welbilt Smart Prep Fridge', category: 'Smart Fridge', connected: false, status: 'Ready to Pair' },
    { id: 'camera-verkada', name: 'Verkada Vision AI', category: 'AI Cameras', connected: true, status: 'Active (Pass-through stream)' },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              connected: !i.connected,
              status: !i.connected ? 'Active (Connected)' : 'Disconnected',
            }
          : i
      )
    );
  };

  const roadmapMilestones = [
    {
      quarter: 'Q1 2026',
      title: 'AI Multi-Agent Restaurant Brain',
      status: 'Released (v2.4 Live)',
      description: 'Orchestrated specialist agents for Operations, Kitchen, Inventory, Guest Experience, and Business Advisory.',
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    },
    {
      quarter: 'Q2 2026',
      title: 'Kitchen Computer Vision & Waste Tracking',
      status: 'Beta Testing',
      description: 'Real-time video analytics for table clearing speed, prep portion accuracy, and automated trash audit.',
      color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
    },
    {
      quarter: 'Q3 2026',
      title: 'Dynamic Voice Kiosk & Drive-Thru Copilot',
      status: 'In Development',
      description: 'Sub-second latency voice order intake with real-time upsell dynamic pricing & allergen filtering.',
      color: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
    },
    {
      quarter: 'Q4 2026',
      title: 'Autonomous Supply Chain Purchasing',
      status: 'Planned',
      description: 'Self-executing supplier purchase orders based on weather forecasts, local events, and prep velocity.',
      color: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
              System Configuration & Integrations
            </span>
            <h1 className="text-xl font-bold text-[var(--text-heading)]">OS Settings, Hardware & Roadmap</h1>
          </div>
        </div>
      </div>

      {/* AI Safety Toggles */}
      <div className="glass-panel p-6 rounded-2xl space-y-6 bg-[var(--surface-1)]">
        <div className="border-b border-[var(--border-muted)] pb-3">
          <h2 className="text-base font-bold text-[var(--text-heading)]">Autonomous AI Safety Boundaries</h2>
          <p className="text-xs text-[var(--text-muted)]">Control what the TableSense Brain is allowed to do autonomously.</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[var(--surface-2)] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[var(--text-heading)]">Auto-Hide Depleted Menu Items</h4>
              <p className="text-[11px] text-[var(--text-muted)]">Automatically mark dishes "Sold Out" in Guest App when stock reaches 0.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">ENABLED</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-2)] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[var(--text-heading)]">KDS Prep Sequence Optimization</h4>
              <p className="text-[11px] text-[var(--text-muted)]">Batch similar ticket items automatically on kitchen displays.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">ENABLED</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-2)] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[var(--text-heading)]">Auto Supplier PO Generation Threshold</h4>
              <p className="text-[11px] text-[var(--text-muted)]">Require manager approval before firing PO orders exceeding $500.</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">APPROVAL REQ</span>
          </div>
        </div>
      </div>

      {/* Integration Management Grid */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 bg-[var(--surface-1)]">
        <div className="border-b border-[var(--border-muted)] pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--text-heading)] flex items-center gap-2">
              <Link2 className="w-4 h-4 text-cyan-400" /> Integration Framework & Hardware Connectors
            </h2>
            <p className="text-xs text-[var(--text-muted)]">Connect POS, ERP, Delivery, and Kitchen IoT devices to TableSense OS.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">{item.category}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.connected
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {item.connected ? 'Connected' : 'Offline'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[var(--text-heading)] mt-1">{item.name}</h4>
                <p className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">{item.status}</p>
              </div>

              <button
                onClick={() => toggleIntegration(item.id)}
                className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  item.connected
                    ? 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30'
                    : 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow'
                }`}
              >
                {item.connected ? 'Disconnect Provider' : 'Connect Provider'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Product Roadmap Section */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 bg-[var(--surface-1)]">
        <div className="border-b border-[var(--border-muted)] pb-3">
          <h2 className="text-base font-bold text-[var(--text-heading)] flex items-center gap-2">
            <Milestone className="w-4 h-4 text-indigo-400" /> TableSense OS Product Engineering Roadmap
          </h2>
          <p className="text-xs text-[var(--text-muted)]">Upcoming releases and capabilities planned for the restaurant brain engine.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmapMilestones.map((ms, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400">{ms.quarter}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${ms.color}`}>{ms.status}</span>
              </div>
              <h4 className="text-sm font-bold text-[var(--text-heading)]">{ms.title}</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{ms.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
