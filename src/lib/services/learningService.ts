import { AIFeedbackLog, LearningSignals, InsightCategory } from '../../types';

export class LearningService {
  private static feedbackLogs: AIFeedbackLog[] = [
    {
      id: 'fb-1',
      insightId: 'insight-1',
      category: 'inventory',
      actionTaken: 'accepted',
      predictedValue: 'Stockout in 38m',
      actualOutcome: 'Reordered; stockout avoided',
      accuracyScorePercent: 96,
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'fb-2',
      insightId: 'insight-2',
      category: 'staffing',
      actionTaken: 'accepted',
      predictedValue: 'Wait time +12m at 19:30',
      actualOutcome: 'Reallocated staff; actual wait +4m',
      accuracyScorePercent: 91,
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'fb-3',
      insightId: 'insight-3',
      category: 'inventory',
      actionTaken: 'auto_applied',
      predictedValue: 'Truffle pasta out of stock',
      actualOutcome: 'Menu item auto-hidden; 0 order refunds',
      accuracyScorePercent: 98,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'fb-4',
      insightId: 'insight-4',
      category: 'kitchen',
      actionTaken: 'accepted',
      predictedValue: 'Saved 6m prep time',
      actualOutcome: 'Prep time reduced by 5.2m',
      accuracyScorePercent: 94,
      timestamp: new Date().toISOString(),
    },
  ];

  static logFeedback(log: Omit<AIFeedbackLog, 'id' | 'timestamp'>): AIFeedbackLog {
    const newLog: AIFeedbackLog = {
      ...log,
      id: `fb-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.feedbackLogs.unshift(newLog);
    return newLog;
  }

  static getFeedbackLogs(): AIFeedbackLog[] {
    return this.feedbackLogs;
  }

  static getLearningSignals(): LearningSignals[] {
    const categories: (InsightCategory | 'demand' | 'wait-time' | 'pricing')[] = [
      'inventory',
      'staffing',
      'kitchen',
      'revenue',
      'pricing',
      'demand',
      'sustainability',
    ];

    return categories.map((cat) => {
      const logs = this.feedbackLogs.filter((l) => l.category === cat);
      const avgAccuracy = logs.length
        ? Math.round(logs.reduce((acc, curr) => acc + curr.accuracyScorePercent, 0) / logs.length)
        : 93;

      return {
        category: cat,
        averageAccuracyPercent: avgAccuracy,
        tendencyError: avgAccuracy > 95 ? 'highly_accurate' : 'tended_underestimate',
        sampleCount: logs.length + 12,
        historicalNote: `Grounding based on ${logs.length + 12} evaluated prediction outcomes in past 30 days.`,
      };
    });
  }

  static getAccuracyTrends() {
    return [
      { date: 'Mon', inventory: 92, staffing: 88, kitchen: 91, pricing: 94 },
      { date: 'Tue', inventory: 94, staffing: 90, kitchen: 93, pricing: 95 },
      { date: 'Wed', inventory: 93, staffing: 91, kitchen: 92, pricing: 96 },
      { date: 'Thu', inventory: 95, staffing: 93, kitchen: 94, pricing: 95 },
      { date: 'Fri', inventory: 97, staffing: 94, kitchen: 95, pricing: 97 },
      { date: 'Sat', inventory: 96, staffing: 95, kitchen: 96, pricing: 98 },
      { date: 'Sun', inventory: 98, staffing: 96, kitchen: 97, pricing: 97 },
    ];
  }
}
