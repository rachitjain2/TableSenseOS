import React, { useState } from 'react';
import { Settings, ShieldCheck, Cpu, Database, Link2, CheckCircle2, ArrowRight, Milestone, Sparkles, Users, Award, Palette, Briefcase, TrendingUp, Quote } from 'lucide-react';

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

      {/* Team & Vision Section */}
      <div className="glass-panel p-6 rounded-2xl space-y-6 bg-[var(--surface-1)] border border-[var(--border-muted)]">
        {/* Header & Vision Statement */}
        <div className="space-y-4">
          <div className="border-b border-[var(--border-muted)] pb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-[var(--text-heading)] flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> Multidisciplinary Team & Vision
              </h2>
              <p className="text-xs text-[var(--text-muted)]">The passionate innovators revolutionizing restaurant operations with Artificial Intelligence.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-semibold text-indigo-400">
              TableSense OS Team
            </span>
          </div>

          {/* Vision Banner Quote */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-cyan-900/40 border border-indigo-500/30 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Quote className="w-5 h-5 text-indigo-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  "One Team. One Vision. Smarter Restaurants Powered by AI."
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  We believe restaurants deserve more than disconnected software. Our vision is to build an <span className="text-white font-semibold">AI-powered Restaurant Operating System</span> that seamlessly connects customers, staff, kitchen operations, inventory, and business intelligence into one unified platform. Together, we aim to empower restaurants with intelligent automation, data-driven insights, and exceptional customer experiences.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rachit Jain */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] hover:border-indigo-500/40 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    RJ
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-heading)]">Rachit Jain</h4>
                    <span className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Team Leader
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                  Leadership & Architecture
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Led the project vision, system architecture, AI integration strategy, development coordination, and overall execution of TableSense OS.
              </p>
            </div>
          </div>

          {/* Kritika Goyal */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] hover:border-pink-500/40 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold text-sm">
                    KG
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-heading)]">Kritika Goyal</h4>
                    <span className="text-[11px] text-pink-400 font-semibold flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5" /> Design Head
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-pink-500/30 bg-pink-500/10 text-pink-300">
                  UI/UX & Branding
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Designed the user experience, UI/UX, branding, visual identity, presentation assets, and ensured a modern, intuitive interface across the platform.
              </p>
            </div>
          </div>

          {/* Ruchika Parashar */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] hover:border-cyan-500/40 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                    RP
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-heading)]">Ruchika Parashar</h4>
                    <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> Product Manager
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                  Product & Workflows
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Defined product requirements, user journeys, feature prioritization, workflow planning, and coordinated development with the project vision.
              </p>
            </div>
          </div>

          {/* Yash Singhal */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] hover:border-emerald-500/40 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    YS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-heading)]">Yash Singhal</h4>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> Business Strategist
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                  Business & Strategy
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Developed the business model, market analysis, value proposition, scalability strategy, and go-to-market approach for TableSense OS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
