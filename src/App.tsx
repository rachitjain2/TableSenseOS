import React, { useEffect } from 'react';
import { useUIStore } from './stores/useUIStore';
import { TopBar } from './components/ui/TopBar';
import { SidebarNav } from './components/ui/SidebarNav';
import { CommandPalette } from './components/ui/CommandPalette';
import { AICopilotModal } from './components/ui/AICopilotModal';

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

export function App() {
  const { viewMode, activeTab, theme } = useUIStore();

  useEffect(() => {
    // Synchronize global theme attribute on root HTML node
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

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
