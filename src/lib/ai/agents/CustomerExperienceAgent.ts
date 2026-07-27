import { AIInsight } from '../../../types';

export class CustomerExperienceAgent {
  static agentName = 'CustomerExperienceAgent';

  static analyze(context: any): AIInsight[] {
    const insights: AIInsight[] = [];
    const vipGuests = context.guests?.filter((g: any) => g.lifetimeSpend > 1000) || [];

    if (vipGuests.length > 0) {
      const vip = vipGuests[0];
      insights.push({
        id: `cx-${Date.now()}-1`,
        title: `VIP Guest Profile Recognition: ${vip.name}`,
        category: 'revenue',
        confidenceScore: 93,
        plainLanguageReasoning: `${vip.name} has visited ${vip.totalVisits} times ($${vip.lifetimeSpend} lifetime spend). Prefers ${vip.preferredTableZone}.`,
        dataSignalsUsed: ['Restaurant Memory CRM', 'Guest Sentiment Index'],
        suggestedAction: {
          label: 'Send Complimentary Welcome Sparkler',
          actionType: 'discount_item',
          payload: { guestId: vip.id, itemId: 'beverage-sparkler' },
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
        sourceAgent: 'CustomerExperienceAgent',
        collaboratingAgents: ['BusinessAdvisorAgent'],
        expectedBusinessImpact: 'Boosts guest NPS sentiment and drives +18% lifetime loyalty return frequency.',
        estimatedCostSavings: null,
        revenueOpportunity: 160,
        supportingEvidence: [
          `Lifetime Spend: $${vip.lifetimeSpend}`,
          `Dietary tags: ${vip.dietaryPreferences?.join(', ') || 'Standard'}`,
        ],
        riskLevel: 'low',
      });
    }

    return insights;
  }
}
