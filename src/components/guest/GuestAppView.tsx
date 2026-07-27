import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils,
  ShoppingBag,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Plus,
  Minus,
  X,
  Send,
  User,
  Bot,
  CreditCard,
  QrCode,
  Smartphone,
  HeartHandshake,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { useRestaurantStore } from '../../stores/useRestaurantStore';
import { useCartStore } from '../../stores/useCartStore';
import { useUIStore } from '../../stores/useUIStore';
import { MenuItem } from '../../types';
import { formatCurrency } from '../../lib/utils';

export const GuestAppView: React.FC = () => {
  const { menuItems, ingredients, placeOrderFromCart, guests } = useRestaurantStore();
  const { items: cartItems, addItem, removeItem, updateQuantity, tableNumber, setTableNumber, clearCart } =
    useCartStore();
  const { isStaffPreview, previewTableNumber, exitStaffPreview } = useUIStore();

  useEffect(() => {
    if (isStaffPreview && previewTableNumber) {
      setTableNumber(previewTableNumber);
    }
  }, [isStaffPreview, previewTableNumber, setTableNumber]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<string>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiWaiterOpen, setIsAiWaiterOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<
    { id: string; sender: 'ai' | 'user'; text: string; recommendedDishes?: string[] }[]
  >([
    {
      id: 'g-1',
      sender: 'ai',
      text: `Welcome to Table #4! I am your AI Dining Assistant. Ask me about ingredients, wine pairings, or dietary recommendations.`,
    },
  ]);

  const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Cocktails'];
  const dietaryOptions = ['All', 'Gluten-Free', 'Vegan', 'Dairy-Free'];

  // Check ingredient availability dynamically
  const isDishAvailable = (dish: MenuItem) => {
    if (!dish.isAvailable) return false;
    // Check linked ingredients in store
    const linkedIngs = ingredients.filter((i) => dish.linkedIngredientIds.includes(i.id));
    return !linkedIngs.some((i) => i.stockLevel === 0);
  };

  const filteredDishes = menuItems.filter((dish) => {
    const matchesCat = selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesDiet =
      dietaryFilter === 'All' || dish.dietaryTags.some((t) => t.toLowerCase().includes(dietaryFilter.toLowerCase()));
    return matchesCat && matchesDiet;
  });

  const cartTotal = cartItems.reduce((acc, ci) => acc + ci.price * ci.quantity, 0);

  const handleSendAi = async (customPrompt?: string) => {
    const text = customPrompt || aiPrompt;
    if (!text.trim()) return;

    setAiChatMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: 'user', text }]);
    setAiPrompt('');
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/waiter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          menuItems: menuItems.map((m) => ({ name: m.name, price: m.price, dietary: m.dietaryTags })),
        }),
      });

      const data = await res.json();
      setAiChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply || 'Let me help you with your order!',
          recommendedDishes: data.recommendedDishes || [],
        },
      ]);
    } catch (e) {
      setAiChatMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `I recommend our Wagyu Truffle Burger paired with Pinot Noir, or Paneer Tikka if you prefer vegetarian!`,
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    placeOrderFromCart(
      cartItems.map((i) => ({ menuItemId: i.menuItemId, menuItemName: i.menuItemName, quantity: i.quantity, price: i.price })),
      tableNumber,
      'Sana (Guest)'
    );
    clearCart();
    setIsCartOpen(false);
    alert(`Order placed successfully for Table #${tableNumber}! Sent directly to Kitchen KDS.`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-zinc-800 flex flex-col justify-between">
      {/* Persistent Staff Preview Mode Banner - Rendered strictly when originating from Command Center staff preview */}
      {isStaffPreview && (
        <div className="sticky top-0 z-40 px-3.5 py-2.5 bg-indigo-950/95 border-b border-indigo-500/30 text-indigo-200 flex items-center justify-between text-xs font-mono backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-2 min-w-0">
            <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="truncate">
              <span className="font-bold text-indigo-100">Previewing Guest Experience</span>
              <span className="text-cyan-300 font-bold ml-1.5">• Table #{previewTableNumber || tableNumber}</span>
            </div>
          </div>
          <button
            onClick={exitStaffPreview}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 font-bold text-[11px] transition-all shrink-0 ml-2 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Command Center</span>
          </button>
        </div>
      )}

      {/* Top Sticky Guest Bar */}
      <div className="sticky top-0 z-30 p-4 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/30">
            TS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">TableSense Dining</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300">
                Table #{tableNumber}
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 block">Downtown Flagship</span>
          </div>
        </div>

        {/* AI Waiter & Cart Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAiWaiterOpen(true)}
            className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 relative"
            title="Ask AI Waiter"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 relative flex items-center gap-1.5 font-mono text-xs font-bold"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{cartItems.reduce((a, b) => a + b.quantity, 0)}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-5 flex-1 overflow-y-auto pb-24">
        {/* Memory Personalized Welcome Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-900/60 to-cyan-900/60 border border-indigo-500/30 text-xs space-y-1">
          <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono">
            <HeartHandshake className="w-4 h-4" />
            <span>Welcome Back, Sana!</span>
          </div>
          <p className="text-zinc-300 text-[11px]">
            We remembered you prefer Gluten-Free options and enjoyed Paneer Tikka last time.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Filter:</span>
          {dietaryOptions.map((diet) => (
            <button
              key={diet}
              onClick={() => setDietaryFilter(diet)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors ${
                dietaryFilter === diet
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                  : 'bg-zinc-900/50 text-zinc-500'
              }`}
            >
              {diet}
            </button>
          ))}
        </div>

        {/* Menu Dish List */}
        <div className="space-y-4">
          {filteredDishes.map((dish) => {
            const available = isDishAvailable(dish);
            const inCart = cartItems.find((ci) => ci.menuItemId === dish.id);

            return (
              <div
                key={dish.id}
                className={`p-4 rounded-2xl border bg-zinc-900/80 flex gap-3 transition-all ${
                  available ? 'border-zinc-800' : 'border-rose-900/50 opacity-60'
                }`}
              >
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-20 h-20 rounded-xl object-cover border border-zinc-800 shrink-0"
                />

                <div className="flex-1 space-y-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-white leading-tight">{dish.name}</h4>
                      <span className="text-xs font-mono font-bold text-cyan-400">{formatCurrency(dish.price)}</span>
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{dish.description}</p>
                  </div>

                  {/* Badges & Cart Action */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-1">
                      {dish.dietaryTags.map((dt, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] font-mono text-indigo-300"
                        >
                          {dt}
                        </span>
                      ))}
                    </div>

                    {available ? (
                      <button
                        onClick={() => addItem(dish)}
                        className="px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold font-mono shadow"
                      >
                        {inCart ? `+ Add (${inCart.quantity})` : '+ Add'}
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-rose-400 font-bold uppercase px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 max-w-md mx-auto">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-2xl flex items-center justify-between font-mono font-bold text-sm"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>{cartItems.reduce((a, b) => a + b.quantity, 0)} Items in Tray</span>
            </div>
            <span>View Tray ({formatCurrency(cartTotal)})</span>
          </button>
        </div>
      )}

      {/* AI Waiter Drawer Modal */}
      <AnimatePresence>
        {isAiWaiterOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-5 space-y-4 max-h-[85vh] flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                  <h3 className="text-sm font-bold text-white">AI Table Assistant</h3>
                </div>
                <button onClick={() => setIsAiWaiterOpen(false)} className="p-1 rounded-lg text-zinc-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 my-2 pr-1">
                {aiChatMessages.map((m) => (
                  <div key={m.id} className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                        m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-200'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                <input
                  type="text"
                  placeholder="Ask about wine pairing, allergies..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAi()}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
                <button
                  onClick={() => handleSendAi()}
                  className="p-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Tray Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-5 space-y-4 max-h-[85vh] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white font-mono">Your Order Tray — Table #{tableNumber}</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-1 text-zinc-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 my-2 pr-1">
                {cartItems.map((ci) => (
                  <div key={ci.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-white">{ci.menuItemName}</h4>
                      <span className="text-cyan-400 font-mono">{formatCurrency(ci.price)}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <button
                        onClick={() => updateQuantity(ci.id, -1)}
                        className="p-1 rounded bg-zinc-800 text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold">{ci.quantity}</span>
                      <button
                        onClick={() => updateQuantity(ci.id, 1)}
                        className="p-1 rounded bg-zinc-800 text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-mono font-bold text-sm shadow-xl"
              >
                Send Order to Kitchen ({formatCurrency(cartTotal)})
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
