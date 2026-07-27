import { create } from 'zustand';
import { SimulationParams, SimulationResult } from '../types';

interface SimulationState {
  params: SimulationParams;
  isRunning: boolean;
  activeResult: SimulationResult | null;
  savedScenarios: SimulationResult[];

  setParams: (params: Partial<SimulationParams>) => void;
  runSimulation: () => void;
  saveCurrentResult: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  params: {
    footfallMultiplier: 1.3,
    staffAbsentCount: 1,
    priceAdjustmentPercent: 0,
    weatherCondition: 'Heavy Rain',
    simulatedTimeFrame: 'Dinner Rush',
  },
  isRunning: false,
  activeResult: {
    scenarioName: 'Saturday Dinner Rush + 1 Staff Absent + Heavy Rain',
    projectedRevenue: 10840,
    revenueChangePercent: +14.2,
    projectedAvgWaitMinutes: 24,
    tableTurnoverRate: 1.8,
    highStockoutRiskIngredients: ['Fresh Paneer / Cottage Cheese', 'Organic Hass Avocados'],
    staffAdequacyScore: 72,
    aiNarrativeOutcome:
      'Heavy rain increases delivery & dine-in rush by +30%. With 1 floor waiter absent, average wait time surges from 14m to 24m after 19:30. Paneer stockouts by 20:10 without pre-shift restock.',
    confidenceRange: '92% - 97%',
    recommendedAction: 'Call in 1 relief waiter for 18:30–21:30 shift and restock Paneer (+6kg) pre-service.',
  },
  savedScenarios: [],

  setParams: (newParams) => {
    set((state) => ({ params: { ...state.params, ...newParams } }));
  },

  runSimulation: () => {
    set({ isRunning: true });

    setTimeout(() => {
      const { params } = get();
      const footfall = params.footfallMultiplier;
      const staffAbsent = params.staffAbsentCount;
      const priceAdj = params.priceAdjustmentPercent;

      const baseRev = 8400;
      const revMultiplier = footfall * (1 + priceAdj / 100);
      const projectedRevenue = Math.round(baseRev * revMultiplier);
      const revChange = Number((((projectedRevenue - baseRev) / baseRev) * 100).toFixed(1));

      const baseWait = 12;
      const projectedAvgWait = Math.round(baseWait * footfall + staffAbsent * 6);
      const turnover = Number((2.1 / (footfall * 0.8 + staffAbsent * 0.2)).toFixed(1));
      const staffScore = Math.max(40, Math.round(100 - staffAbsent * 18 - (footfall - 1) * 25));

      const risks: string[] = [];
      if (footfall > 1.2) risks.push('Fresh Paneer / Cottage Cheese');
      if (footfall > 1.4) risks.push('Organic Hass Avocados');
      if (footfall > 1.8) risks.push('Prime Wagyu Beef Patty');

      const weatherNote =
        params.weatherCondition === 'Heavy Rain'
          ? 'Heavy rain increases delivery demand by +25%.'
          : params.weatherCondition === 'Weekend Event'
          ? 'Concert nearby will cause sharp 20:00 walk-in surge.'
          : 'Normal weather pattern.';

      const result: SimulationResult = {
        scenarioName: `${params.simulatedTimeFrame}: ${params.weatherCondition} (${footfall}x Footfall, ${staffAbsent} Staff Off)`,
        projectedRevenue,
        revenueChangePercent: revChange,
        projectedAvgWaitMinutes: projectedAvgWait,
        tableTurnoverRate: turnover,
        highStockoutRiskIngredients: risks.length > 0 ? risks : ['None — Stock levels healthy'],
        staffAdequacyScore: staffScore,
        aiNarrativeOutcome: `${weatherNote} At ${footfall}x footfall with ${staffAbsent} absent staff, wait times reach ${projectedAvgWait}m. Staff adequacy index drops to ${staffScore}/100.`,
        confidenceRange: '89% - 95%',
        recommendedAction:
          staffScore < 75
            ? `Schedule 1 on-call server and pre-batch top 3 appetizers.`
            : `Operationally manageable. Monitor KDS station 1 load.`,
      };

      set({ isRunning: false, activeResult: result });
    }, 800);
  },

  saveCurrentResult: () => {
    const { activeResult, savedScenarios } = get();
    if (activeResult) {
      set({ savedScenarios: [activeResult, ...savedScenarios] });
    }
  },
}));
