import { IntegrationProvider, IntegrationSyncStatus } from './IntegrationProvider';

export class ERPIntegrationProvider implements IntegrationProvider {
  id = 'erp-sysco';
  name = 'Sysco EDI & ERP Stream';
  category = 'ERP' as const;
  async connect() { return true; }
  async disconnect() { return true; }
  async syncStatus(): Promise<IntegrationSyncStatus> {
    return { providerId: this.id, connected: false, healthStatus: 'disconnected' };
  }
}

export class IoTKitchenProvider implements IntegrationProvider {
  id = 'iot-[rational-oven]';
  name = 'Rational iCombi Pro IoT';
  category = 'IoT Kitchen' as const;
  async connect() { return true; }
  async disconnect() { return true; }
  async syncStatus(): Promise<IntegrationSyncStatus> {
    return { providerId: this.id, connected: false, healthStatus: 'disconnected' };
  }
}

export class SmartFridgeProvider implements IntegrationProvider {
  id = 'fridge-welbilt';
  name = 'Welbilt Smart Prep Fridge';
  category = 'Smart Fridge' as const;
  async connect() { return true; }
  async disconnect() { return true; }
  async syncStatus(): Promise<IntegrationSyncStatus> {
    return { providerId: this.id, connected: false, healthStatus: 'disconnected' };
  }
}

export class AICameraProvider implements IntegrationProvider {
  id = 'camera-verkada';
  name = 'Verkada Kitchen Vision AI';
  category = 'AI Cameras' as const;
  async connect() { return true; }
  async disconnect() { return true; }
  async syncStatus(): Promise<IntegrationSyncStatus> {
    return { providerId: this.id, connected: false, healthStatus: 'disconnected' };
  }
}
