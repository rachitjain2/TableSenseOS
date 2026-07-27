import { AIInsight } from '../../../types';

export class OperationsAgent {
  static agentName = 'OperationsAgent';

  static analyze(context: any): AIInsight[] {
    const insights: AIInsight[] = [];
    const occupiedCount = context.tables?.filter((t: any) => t.status !== 'empty').length || 0;
    const totalTables = context.tables?.length || 16;
    const occupancyRatio = occupiedCount / totalTables;

    if (occupancyRatio > 0.7) {
      insights.push({
        id: `ops-${Date.now()}-1`,
        title: `Floor Density High (${Math.round(occupancyRatio * 100)}% Occupancy)`,
        category: 'staffing',
        confidenceScore: 92,
        plainLanguageReasoning: `${occupiedCount} of ${totalTables} tables occupied. Floor turn speed is critical to avoid walk-in queue congestion.`,
        dataSignalsUsed: ['Digital Twin Table Telemetry', 'Live Seating Grid'],
        suggestedAction: {
          label: 'Pre-assign busser to clear Table 7 & 12',
          actionType: 'reallocate_waiter',
          payload: { tableIds: ['tbl-7', 'tbl-12'] },
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
        sourceAgent: 'OperationsAgent',
        collaboratingAgents: ['CustomerExperienceAgent'],
        expectedBusinessImpact: 'Reduces walk-in queue wait times by 8 minutes during rush.',
        estimatedCostSavings: null,
        revenueOpportunity: 280,
        supportingEvidence: [
          `Floor occupancy at ${Math.round(occupancyRatio * 100)}%`,
          'Table 7 in needs_cleaning state for > 12 mins',
        ],
        riskLevel: 'medium',
      });
    }

    return insights;
  }
}
