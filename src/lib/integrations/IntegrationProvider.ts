export interface IntegrationSyncStatus {
  providerId: string;
  connected: boolean;
  lastSyncedAt?: string;
  healthStatus: 'healthy' | 'degraded' | 'disconnected';
}

export interface IntegrationProvider {
  id: string;
  name: string;
  category: 'POS' | 'Payment' | 'Delivery' | 'ERP' | 'CRM' | 'IoT Kitchen' | 'Smart Fridge' | 'AI Cameras';
  connect(): Promise<boolean>;
  disconnect(): Promise<boolean>;
  syncStatus(): Promise<IntegrationSyncStatus>;
  onOrderReceived?(order: any): void;
  onPaymentConfirmed?(payment: any): void;
  onInventoryUpdate?(inventory: any): void;
  onSensorReading?(sensor: any): void;
}
