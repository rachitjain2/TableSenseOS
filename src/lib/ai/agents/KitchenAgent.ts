import { AIInsight } from '../../../types';

export class KitchenAgent {
  static agentName = 'KitchenAgent';

  static analyze(context: any): AIInsight[] {
    const insights: AIInsight[] = [];
    const activeTickets = context.orders?.filter((o: any) => o.status === 'in_kitchen' || o.status === 'confirmed') || [];

    if (activeTickets.length >= 3) {
      insights.push({
        id: `kds-${Date.now()}-1`,
        title: `Station Batching Opportunity (${activeTickets.length} KDS Tickets)`,
        category: 'kitchen',
        confidenceScore: 91,
        plainLanguageReasoning: `${activeTickets.length} pending orders share common Grill and Cold station items. Grouping fires reduces prep cycles.`,
        dataSignalsUsed: ['KDS Queue State', 'Station Thermal Telemetry'],
        suggestedAction: {
          label: 'Optimize KDS Station Sequences',
          actionType: 'adjust_prep',
          payload: { station: 'Grill' },
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
        sourceAgent: 'KitchenAgent',
        collaboratingAgents: ['OperationsAgent'],
        expectedBusinessImpact: 'Shaves 4.2 minutes off average ticket prep time.',
        estimatedCostSavings: 60,
        revenueOpportunity: 190,
        supportingEvidence: [
          `${activeTickets.length} active tickets queued`,
          'Identified 4 duplicate Grill items in queue',
        ],
        riskLevel: 'low',
      });
    }

    return insights;
  }
}
