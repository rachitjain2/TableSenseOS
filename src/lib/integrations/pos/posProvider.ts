import { IntegrationProvider, IntegrationSyncStatus } from '../IntegrationProvider';

export class POSIntegrationProvider implements IntegrationProvider {
  id = 'pos-toast';
  name = 'Toast POS System';
  category = 'POS' as const;

  async connect(): Promise<boolean> {
    console.log('[POS Integration Stub] Initiating Toast POS OAuth Handshake...');
    return true;
  }

  async disconnect(): Promise<boolean> {
    return true;
  }

  async syncStatus(): Promise<IntegrationSyncStatus> {
    return {
      providerId: this.id,
      connected: false,
      healthStatus: 'disconnected',
    };
  }
}
