import { create } from 'zustand';
import { MenuItem, OrderItem } from '../types';

interface CartState {
  tableNumber: number;
  guestName: string;
  items: OrderItem[];
  specialInstructions: string;

  setTableNumber: (tbl: number) => void;
  setGuestName: (name: string) => void;
  setSpecialInstructions: (notes: string) => void;
  addItem: (menuItem: MenuItem, quantity?: number, modifiers?: string[]) => void;
  removeItem: (orderItemId: string) => void;
  updateQuantity: (orderItemId: string, delta: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  tableNumber: 1,
  guestName: 'Sana R.',
  items: [
    {
      id: 'cart-1',
      menuItemId: 'menu-2',
      menuItemName: 'Smoked Paneer Tikka Skewers',
      quantity: 1,
      price: 18,
      modifiers: ['Extra Mint Chutney'],
    },
    {
      id: 'cart-2',
      menuItemId: 'menu-6',
      menuItemName: 'Saffron & Mint Sparkler',
      quantity: 1,
      price: 10,
    },
  ],
  specialInstructions: '',

  setTableNumber: (tableNumber) => set({ tableNumber }),
  setGuestName: (guestName) => set({ guestName }),
  setSpecialInstructions: (specialInstructions) => set({ specialInstructions }),

  addItem: (menuItem, quantity = 1, modifiers = []) => {
    set((state) => {
      const existingIndex = state.items.findIndex((i) => i.menuItemId === menuItem.id);
      if (existingIndex !== -1) {
        const updated = [...state.items];
        updated[existingIndex].quantity += quantity;
        return { items: updated };
      }
      return {
        items: [
          ...state.items,
          {
            id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            menuItemId: menuItem.id,
            menuItemName: menuItem.name,
            quantity,
            price: menuItem.price,
            modifiers,
          },
        ],
      };
    });
  },

  removeItem: (orderItemId) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== orderItemId) }));
  },

  updateQuantity: (orderItemId, delta) => {
    set((state) => ({
      items: state.items
        .map((i) => {
          if (i.id === orderItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[],
    }));
  },

  clearCart: () => set({ items: [], specialInstructions: '' }),

  getTotalAmount: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
