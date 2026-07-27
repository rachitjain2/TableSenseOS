import { AIInsight } from '../../../types';

export class InventoryAgent {
  static agentName = 'InventoryAgent';

  static analyze(context: any): AIInsight[] {
    const insights: AIInsight[] = [];
    const lowStock = context.ingredients?.filter((i: any) => i.stockLevel < i.reorderThreshold) || [];

    if (lowStock.length > 0) {
      const topLow = lowStock[0];
      insights.push({
        id: `inv-${Date.now()}-1`,
        title: `Reorder Warning: ${topLow.name} Low (${topLow.stockLevel} ${topLow.unit})`,
        category: 'inventory',
        confidenceScore: 95,
        plainLanguageReasoning: `${topLow.name} stock level is below threshold (${topLow.reorderThreshold} ${topLow.unit}). Depletion projected during peak.`,
        dataSignalsUsed: ['Inventory Sensors', 'POS Depletion Telemetry'],
        suggestedAction: {
          label: `Dispatch Reorder to ${topLow.supplierName}`,
          actionType: 'reorder_stock',
          payload: { ingredientId: topLow.id, qty: 10 },
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
        sourceAgent: 'InventoryAgent',
        collaboratingAgents: ['BusinessAdvisorAgent'],
        expectedBusinessImpact: `Prevents stockout of key dishes linked to ${topLow.name}.`,
        estimatedCostSavings: 150,
        revenueOpportunity: 420,
        supportingEvidence: [
          `Stock at ${topLow.stockLevel} ${topLow.unit} (Threshold: ${topLow.reorderThreshold} ${topLow.unit})`,
          `Supplier: ${topLow.supplierName}`,
        ],
        riskLevel: 'high',
      });
    }

    return insights;
  }
}
