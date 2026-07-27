import { create } from 'zustand';
import {
  Branch,
  TableNode,
  Ingredient,
  MenuItem,
  Order,
  StaffMember,
  GuestMemoryProfile,
  AIInsight,
  AutonomousActionLog,
  HealthScoreSnapshot,
  SustainabilityMetrics,
  TableStatus,
  OrderStatus,
} from '../types';
import {
  INITIAL_BRANCHES,
  INITIAL_TABLES,
  INITIAL_INGREDIENTS,
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_STAFF,
  INITIAL_GUESTS,
  INITIAL_AI_INSIGHTS,
  INITIAL_AUTONOMOUS_LOGS,
  INITIAL_HEALTH_SCORE,
  INITIAL_SUSTAINABILITY,
} from '../data/mockData';

interface RestaurantState {
  activeBranchId: string;
  branches: Branch[];
  tables: TableNode[];
  ingredients: Ingredient[];
  menuItems: MenuItem[];
  orders: Order[];
  staff: StaffMember[];
  guests: GuestMemoryProfile[];
  insights: AIInsight[];
  autonomousLogs: AutonomousActionLog[];
  healthScore: HealthScoreSnapshot;
  sustainability: SustainabilityMetrics;

  // Actions
  setActiveBranch: (branchId: string) => void;
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => string;
  reorderIngredient: (ingredientId: string, qty: number) => void;
  approveInsight: (insightId: string) => void;
  dismissInsight: (insightId: string) => void;
  undoAutonomousAction: (logId: string) => void;
  toggleMenuItemAvailability: (menuItemId: string) => void;
  addGuestProfile: (profile: Omit<GuestMemoryProfile, 'id'>) => void;
  addAIInsight: (insight: Omit<AIInsight, 'id' | 'createdAt'>) => void;
  placeOrderFromCart: (
    items: { menuItemId: string; menuItemName: string; quantity: number; price: number }[],
    tableNumber: number,
    guestName?: string
  ) => string;
  triggerRealtimeTick: () => void;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  activeBranchId: 'branch-1',
  branches: INITIAL_BRANCHES,
  tables: INITIAL_TABLES,
  ingredients: INITIAL_INGREDIENTS,
  menuItems: INITIAL_MENU_ITEMS,
  orders: INITIAL_ORDERS,
  staff: INITIAL_STAFF,
  guests: INITIAL_GUESTS,
  insights: INITIAL_AI_INSIGHTS,
  autonomousLogs: INITIAL_AUTONOMOUS_LOGS,
  healthScore: INITIAL_HEALTH_SCORE,
  sustainability: INITIAL_SUSTAINABILITY,

  setActiveBranch: (branchId: string) => set({ activeBranchId: branchId }),

  updateTableStatus: (tableId: string, status: TableStatus) => {
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status,
              timeInStatusMinutes: 1,
              currentGuests: status === 'empty' || status === 'needs_cleaning' ? 0 : t.currentGuests || 2,
            }
          : t
      ),
    }));
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    set((state) => {
      const updatedOrders = state.orders.map((o) => (o.id === orderId ? { ...o, status } : o));

      // Also sync table status if linked
      const targetOrder = updatedOrders.find((o) => o.id === orderId);
      let updatedTables = state.tables;
      if (targetOrder) {
        let mappedTableStatus: TableStatus | undefined;
        if (status === 'in_kitchen' || status === 'confirmed') mappedTableStatus = 'ordered';
        else if (status === 'ready' || status === 'served') mappedTableStatus = 'food_served';
        else if (status === 'billed') mappedTableStatus = 'needs_bill';

        if (mappedTableStatus) {
          updatedTables = state.tables.map((t) =>
            t.number === targetOrder.tableNumber ? { ...t, status: mappedTableStatus! } : t
          );
        }
      }

      return { orders: updatedOrders, tables: updatedTables };
    });
  },

  createOrder: (newOrderData) => {
    const id = `ord-${Date.now()}`;
    const orderNumber = `#${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      ...newOrderData,
      id,
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      // Inventory depletion logic
      const updatedIngredients = [...state.ingredients];
      let updatedMenuItems = [...state.menuItems];
      const newLogs = [...state.autonomousLogs];

      newOrder.items.forEach((item) => {
        const menuItem = state.menuItems.find((m) => m.id === item.menuItemId);
        if (menuItem) {
          menuItem.linkedIngredientIds.forEach((ingId) => {
            const ingIdx = updatedIngredients.findIndex((i) => i.id === ingId);
            if (ingIdx !== -1) {
              const current = updatedIngredients[ingIdx];
              const depleted = Math.max(0, current.stockLevel - 0.2 * item.quantity);
              updatedIngredients[ingIdx] = {
                ...current,
                stockLevel: Number(depleted.toFixed(2)),
                status: depleted === 0 ? 'out_of_stock' : depleted < current.reorderThreshold ? 'critical' : current.status,
              };

              // Autonomous action check: if stock hits 0, auto-hide all linked menu items
              if (depleted === 0) {
                updatedMenuItems = updatedMenuItems.map((m) =>
                  m.linkedIngredientIds.includes(ingId) ? { ...m, isAvailable: false } : m
                );

                newLogs.unshift({
                  id: `log-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                  title: `Auto-Hidden Menu Item: ${menuItem.name}`,
                  category: 'menu_availability',
                  reasoning: `${current.name} stock reached 0. Auto-hidden from guest menu to prevent order failure.`,
                  affectedItemOrTable: menuItem.name,
                  canBeUndone: true,
                  status: 'executed',
                });
              }
            }
          });
        }
      });

      // Update table status to ordered
      const updatedTables = state.tables.map((t) =>
        t.number === newOrder.tableNumber
          ? { ...t, status: 'ordered' as TableStatus, orderId: id, currentGuests: t.currentGuests || 2 }
          : t
      );

      return {
        orders: [newOrder, ...state.orders],
        ingredients: updatedIngredients,
        menuItems: updatedMenuItems,
        tables: updatedTables,
        autonomousLogs: newLogs,
      };
    });

    return id;
  },

  reorderIngredient: (ingredientId: string, qty: number) => {
    set((state) => {
      const updatedIngredients = state.ingredients.map((ing) => {
        if (ing.id === ingredientId) {
          const newLevel = Number((ing.stockLevel + qty).toFixed(2));
          return {
            ...ing,
            stockLevel: newLevel,
            status: 'optimal' as const,
            estimatedDepletionTimeMinutes: Math.round((newLevel / (ing.depletionRatePerHour || 1)) * 60),
          };
        }
        return ing;
      });

      // Re-enable linked menu items if ingredients are back in stock!
      const updatedMenuItems = state.menuItems.map((m) => {
        const allIngredientsAvailable = m.linkedIngredientIds.every((id) => {
          const ing = updatedIngredients.find((i) => i.id === id);
          return ing ? ing.stockLevel > 0 : true;
        });
        return { ...m, isAvailable: allIngredientsAvailable };
      });

      return {
        ingredients: updatedIngredients,
        menuItems: updatedMenuItems,
      };
    });
  },

  approveInsight: (insightId: string) => {
    const insight = get().insights.find((i) => i.id === insightId);
    if (!insight) return;

    if (insight.suggestedAction.actionType === 'reorder_stock') {
      const { ingredientId, qty } = insight.suggestedAction.payload;
      get().reorderIngredient(ingredientId, qty || 10);
    }

    set((state) => ({
      insights: state.insights.map((i) => (i.id === insightId ? { ...i, status: 'approved' } : i)),
    }));
  },

  dismissInsight: (insightId: string) => {
    set((state) => ({
      insights: state.insights.map((i) => (i.id === insightId ? { ...i, status: 'dismissed' } : i)),
    }));
  },

  undoAutonomousAction: (logId: string) => {
    set((state) => {
      const log = state.autonomousLogs.find((l) => l.id === logId);
      if (!log || !log.canBeUndone) return state;

      // Reverse action if possible
      return {
        autonomousLogs: state.autonomousLogs.map((l) => (l.id === logId ? { ...l, status: 'undone' } : l)),
      };
    });
  },

  toggleMenuItemAvailability: (menuItemId: string) => {
    set((state) => ({
      menuItems: state.menuItems.map((m) => (m.id === menuItemId ? { ...m, isAvailable: !m.isAvailable } : m)),
    }));
  },

  addGuestProfile: (profileData) => {
    const newGuest: GuestMemoryProfile = {
      ...profileData,
      id: `guest-${Date.now()}`,
    };
    set((state) => ({ guests: [newGuest, ...state.guests] }));
  },

  addAIInsight: (insightData) => {
    const newInsight: AIInsight = {
      ...insightData,
      id: `insight-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ insights: [newInsight, ...state.insights] }));
  },

  placeOrderFromCart: (cartItems, tableNumber, guestName = 'Guest') => {
    const totalAmount = cartItems.reduce((acc, ci) => acc + ci.price * ci.quantity, 0);
    return get().createOrder({
      tableNumber,
      type: 'qr_table',
      status: 'new',
      items: cartItems.map((ci, idx) => ({
        ...ci,
        id: `ord-item-${Date.now()}-${idx}`,
      })),
      totalAmount,
      kdsStation: 'Grill',
      guestName,
      kitchenTicketAgeMinutes: 0,
      isDelayedByAI: false,
    });
  },

  // Simulated live system ticker
  triggerRealtimeTick: () => {
    set((state) => {
      // Increment time in status for tables
      const updatedTables = state.tables.map((t) => ({
        ...t,
        timeInStatusMinutes: t.timeInStatusMinutes + 1,
      }));

      // Increment kitchen ticket ages for active orders
      const updatedOrders = state.orders.map((o) => {
        if (o.status === 'in_kitchen' || o.status === 'confirmed') {
          return { ...o, kitchenTicketAgeMinutes: o.kitchenTicketAgeMinutes + 1 };
        }
        return o;
      });

      return {
        tables: updatedTables,
        orders: updatedOrders,
      };
    });
  },
}));
