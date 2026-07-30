import React, { useEffect } from 'react';
import { useUIStore } from './stores/useUIStore';
import { useAuthStore } from './stores/useAuthStore';
import { TopBar } from './components/ui/TopBar';
import { SidebarNav } from './components/ui/SidebarNav';
import { CommandPalette } from './components/ui/CommandPalette';
import { AICopilotModal } from './components/ui/AICopilotModal';
import { AuthPage } from './components/auth/AuthPage';

// Views
import { DashboardView } from './components/command-center/DashboardView';
import { ExecutiveView } from './components/command-center/ExecutiveView';
import { DigitalTwinView } from './components/command-center/DigitalTwinView';
import { SimulationLabView } from './components/command-center/SimulationLabView';
import { OrdersView } from './components/command-center/OrdersView';
import { KitchenView } from './components/command-center/KitchenView';
import { InventoryView } from './components/command-center/InventoryView';
import { TablesView } from './components/command-center/TablesView';
import { StaffView } from './components/command-center/StaffView';
import { CustomersView } from './components/command-center/CustomersView';
import { SustainabilityView } from './components/command-center/SustainabilityView';
import { MultiBranchView } from './components/command-center/MultiBranchView';
import { AnalyticsView } from './components/command-center/AnalyticsView';
import { SettingsView } from './components/command-center/SettingsView';
import { GuestAppView } from './components/guest/GuestAppView';
import { Sparkles } from 'lucide-react';

export function App() {
  const { viewMode, activeTab, theme } = useUIStore();
  const { session, loading, initialize } = useAuthStore();

  // Initialize Supabase auth listener on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Synchronize global theme attribute on root HTML node
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Loading state — show a branded spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-main)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 animate-pulse">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-sm text-[var(--text-muted)] font-medium">Initializing TableSense OS...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — show auth page
  if (!session) {
    return <AuthPage />;
  }

  // If in Guest App preview mode
  if (viewMode === 'guest-app') {
    return (
      <div className="min-h-screen bg-black text-white font-sans antialiased">
        <GuestAppView />
        <CommandPalette />
        <AICopilotModal />
      </div>
    );
  }

  // Active View Router for Command Center
  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'executive':
        return <ExecutiveView />;
      case 'digital-twin':
        return <DigitalTwinView />;
      case 'simulation':
        return <SimulationLabView />;
      case 'orders':
        return <OrdersView />;
      case 'kitchen':
        return <KitchenView />;
      case 'inventory':
        return <InventoryView />;
      case 'tables':
        return <TablesView />;
      case 'staff':
        return <StaffView />;
      case 'customers':
        return <CustomersView />;
      case 'sustainability':
        return <SustainabilityView />;
      case 'multi-branch':
        return <MultiBranchView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface-base)] text-[var(--text-primary)] font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Persistent Header */}
      <TopBar />

      {/* Main Body Shell */}
      <div className="flex">
        {/* Left Vertical Navigation Rail */}
        <SidebarNav />

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 min-w-0 pb-12 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      {/* Global Modals */}
      <CommandPalette />
      <AICopilotModal />
    </div>
  );
}

export default App;
