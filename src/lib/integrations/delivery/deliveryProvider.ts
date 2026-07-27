import { IntegrationProvider, IntegrationSyncStatus } from '../IntegrationProvider';

export class DeliveryIntegrationProvider implements IntegrationProvider {
  id = 'delivery-doordash';
  name = 'DoorDash Drive API';
  category = 'Delivery' as const;

  async connect(): Promise<boolean> {
    return true;
  }
  async disconnect(): Promise<boolean> {
    return true;
  }
  async syncStatus(): Promise<IntegrationSyncStatus> {
    return { providerId: this.id, connected: false, healthStatus: 'disconnected' };
  }
}
