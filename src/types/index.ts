export type UserRole = 'owner' | 'manager' | 'kitchen_staff' | 'waitstaff' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  branchId: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  tablesCount: number;
  activeOrders: number;
  healthScore: number;
  dailyRevenue: number;
  status: 'optimal' | 'busy' | 'rush' | 'crisis';
}

export type TableStatus = 'empty' | 'seated' | 'ordered' | 'food_served' | 'needs_bill' | 'needs_cleaning';

export interface TableNode {
  id: string;
  number: number;
  zone: 'Main Dining' | 'Patio' | 'VIP Lounge' | 'Chef Bar';
  capacity: number;
  status: TableStatus;
  currentGuests: number;
  assignedStaffId?: string;
  assignedStaffName?: string;
  orderId?: string;
  timeInStatusMinutes: number;
  position: { x: number; y: number }; // Percentage coordinates for Digital Twin grid
  shape: 'round' | 'rect' | 'large_rect';
  waiterNotes?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: 'Produce' | 'Dairy' | 'Meat & Seafood' | 'Spices & Pantry' | 'Beverages';
  stockLevel: number;
  unit: 'kg' | 'g' | 'L' | 'units';
  reorderThreshold: number;
  supplierName: string;
  supplierContact: string;
  depletionRatePerHour: number;
  estimatedDepletionTimeMinutes: number; // e.g., 38 mins remaining
  costPerUnit: number;
  status: 'optimal' | 'low_stock' | 'critical' | 'out_of_stock';
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Starters' | 'Mains' | 'Desserts' | 'Beverages' | 'Cocktails' | 'Chef Specials';
  price: number;
  description: string;
  prepTimeMinutes: number;
  calories?: number;
  allergens: string[];
  dietaryTags: ('Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Keto' | 'Contains Nuts' | 'Spicy')[];
  linkedIngredientIds: string[];
  isAvailable: boolean; // Auto-managed by Inventory AI when linked ingredient reaches 0
  popularityRank: number;
  imageUrl: string;
  upsellSuggestedPairings?: string[];
}

export type OrderStatus = 'new' | 'confirmed' | 'in_kitchen' | 'ready' | 'served' | 'billed';

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  modifiers?: string[];
  specialInstructions?: string;
  allergenWarning?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: number;
  guestName?: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string; // ISO string
  totalAmount: number;
  type: 'dine_in' | 'takeaway' | 'qr_table';
  assignedStaffId?: string;
  kdsStation: 'Grill' | 'Fry' | 'Cold' | 'Pastry';
  kitchenTicketAgeMinutes: number;
  isDelayedByAI?: boolean;
  delayReason?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Floor Manager' | 'Head Chef' | 'Sous Chef' | 'Senior Waiter' | 'Junior Waiter' | 'Bartender';
  avatar: string;
  shift: 'Morning' | 'Evening' | 'Night' | 'Full Day';
  assignedTables: number[];
  clockInTime: string;
  performanceMetrics: {
    avgTableTurnoverMinutes: number;
    upsellRatePercent: number;
    guestRating: number;
    ticketsCompletedToday: number;
  };
  aiMicroTip: string;
  status: 'active' | 'on_break' | 'off_shift';
}

export interface GuestMemoryProfile {
  id: string;
  name: string;
  phoneOrEmail: string;
  totalVisits: number;
  lifetimeSpend: number;
  dietaryPreferences: string[];
  allergies: string[];
  favoriteDishes: string[];
  preferredTableZone: string;
  lastVisitDate: string;
  sentimentScore: number; // 0 - 100
  notes: string;
  hasConsentedDataSharing: boolean;
}

export type InsightCategory = 'inventory' | 'staffing' | 'kitchen' | 'revenue' | 'sustainability' | 'crisis' | 'pricing';

export interface AIInsight {
  id: string;
  title: string;
  category: InsightCategory;
  confidenceScore: number; // 0 - 100
  plainLanguageReasoning: string;
  dataSignalsUsed: string[];
  historicalPrecedent?: string;
  suggestedAction: {
    label: string;
    actionType: 'auto_hide_menu' | 'reorder_stock' | 'reallocate_waiter' | 'adjust_prep' | 'discount_item' | 'adjust_price';
    payload: Record<string, any>;
  };
  status: 'pending' | 'approved' | 'dismissed' | 'auto_applied';
  createdAt: string;

  // Multi-Agent & Decision Confidence Extensions
  sourceAgent?: 'OperationsAgent' | 'KitchenAgent' | 'InventoryAgent' | 'CustomerExperienceAgent' | 'BusinessAdvisorAgent';
  collaboratingAgents?: string[];
  expectedBusinessImpact?: string;
  estimatedCostSavings?: number | null;
  revenueOpportunity?: number | null;
  supportingEvidence?: string[];
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface AutonomousActionLog {
  id: string;
  timestamp: string;
  title: string;
  category: 'inventory_safety' | 'menu_availability' | 'kitchen_batching' | 'waiter_dispatch' | 'smart_pricing';
  reasoning: string;
  affectedItemOrTable: string;
  canBeUndone: boolean;
  status: 'executed' | 'undone';
  agentTrace?: string;
}

export interface AIFeedbackLog {
  id: string;
  insightId: string;
  category: InsightCategory | 'demand' | 'wait-time' | 'pricing';
  actionTaken: 'accepted' | 'dismissed' | 'auto_applied';
  predictedValue?: string;
  actualOutcome?: string;
  accuracyScorePercent: number; // e.g. 94
  timestamp: string;
}

export interface LearningSignals {
  category: InsightCategory | 'demand' | 'wait-time' | 'pricing';
  averageAccuracyPercent: number;
  tendencyError: 'tended_overestimate' | 'tended_underestimate' | 'highly_accurate';
  sampleCount: number;
  historicalNote: string;
}

export interface PricingSuggestion {
  id: string;
  menuItemId: string;
  menuItemName: string;
  currentPrice: number;
  suggestedPrice: number;
  pricingReasoning: string;
  demandLevel: 'high' | 'medium' | 'low';
  quadrant: 'Stars' | 'Puzzles' | 'Plowhorses' | 'Dogs';
  profitMarginPercent: number;
  popularityScore: number;
  estimatedRevenueImpact: number;
  status: 'suggested' | 'applied' | 'dismissed';
}

export interface SimulationParams {
  footfallMultiplier: number; // 0.5x to 2.5x
  staffAbsentCount: number; // 0 to 4
  priceAdjustmentPercent: number; // -20% to +30%
  weatherCondition: 'Sunny' | 'Heavy Rain' | 'Weekend Event' | 'Heatwave';
  simulatedTimeFrame: 'Lunch Peak' | 'Dinner Rush' | 'All Day';
}

export interface SimulationResult {
  scenarioName: string;
  projectedRevenue: number;
  revenueChangePercent: number;
  projectedAvgWaitMinutes: number;
  tableTurnoverRate: number;
  highStockoutRiskIngredients: string[];
  staffAdequacyScore: number; // 0 - 100
  aiNarrativeOutcome: string;
  confidenceRange: string; // e.g. "91% - 96%"
  recommendedAction: string;
}

export interface HealthScoreSnapshot {
  overallScore: number; // 0 - 100
  narrativeSummary: string;
  subScores: {
    operationalEfficiency: number;
    financialPerformance: number;
    guestSatisfaction: number;
    staffPerformance: number;
    sustainability: number;
  };
  trendVsYesterday: number; // e.g. +3.2
}

export interface SustainabilityMetrics {
  totalFoodWasteKgToday: number;
  costImpactWasteToday: number;
  carbonFootprintKg: number;
  waterSavedLiters: number;
  wasteByCategory: { category: string; wasteKg: number }[];
  aiWasteReductionPlaybook: string[];
}
