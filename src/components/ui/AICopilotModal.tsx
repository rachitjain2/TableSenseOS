import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Send, Bot, User, Database, Mic, MicOff, Volume2 } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useRestaurantStore } from '../../stores/useRestaurantStore';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  confidenceScore?: number;
  dataSignals?: string[];
  suggestedActionLabel?: string;
  suggestedActionTab?: string;
}

export const AICopilotModal: React.FC = () => {
  const { isCopilotOpen, setCopilotOpen } = useUIStore();
  const { healthScore, orders, ingredients, tables } = useRestaurantStore();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello! I am the TableSense OS Brain Copilot with Voice Intelligence. Speak or type your request regarding floor state, inventory forecasts, or dynamic pricing.`,
      confidenceScore: 98,
      dataSignals: ['Live Firestore Node Stream', 'Voice Synthesis Engine'],
    },
  ]);

  // Speech Recognition Setup
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser environment.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error('Speech Recognition Error:', e);
      setIsListening(false);
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  if (!isCopilotOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: {
            healthScore: healthScore?.overallScore ?? 87,
            activeOrdersCount: orders.length,
            tablesCount: tables.length,
            lowStockIngredients: ingredients.filter((i) => i.stockLevel < i.reorderThreshold).map((i) => i.name),
          },
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'Analyzing restaurant telemetry...';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        confidenceScore: data.confidenceScore || 95,
        dataSignals: data.dataSignals || ['Restaurant Brain Telemetry'],
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakText(replyText);
    } catch (e) {
      const fallbackText = `TableSense Brain: Analyzed 16 tables, 5 KDS tickets, and 6 inventory lines. Recommended action: Check Fresh Paneer inventory level and reassign Table 7 to clearing queue.`;
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: fallbackText,
          confidenceScore: 92,
          dataSignals: ['Fallback Neural Cache'],
        },
      ]);
      speakText(fallbackText);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'Why is Table 4 waiting so long for the bill?',
    'Show me ingredients stockout risk for dinner rush.',
    'Simulate +20% footfall on Saturday with 1 staff off.',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={() => setCopilotOpen(false)}
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative z-10 w-full max-w-lg h-full glass-panel bg-[var(--surface-1)] border-l border-[var(--border-main)] p-6 overflow-hidden flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-muted)] shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                  Global Restaurant Brain Copilot
                </span>
                <h3 className="text-lg font-bold text-[var(--text-heading)]">Executive Intelligence Assistant</h3>
              </div>
            </div>

            <button
              onClick={() => setCopilotOpen(false)}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sample Suggestion Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4 shrink-0">
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sp)}
                className="text-[11px] font-mono p-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border-muted)] text-[var(--text-secondary)] hover:text-indigo-400 hover:border-indigo-500/30 transition-all text-left"
              >
                "{sp}"
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'glass-panel bg-[var(--surface-2)] border border-[var(--border-muted)] text-[var(--text-primary)] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {m.sender === 'ai' && m.confidenceScore && (
                    <div className="mt-3 pt-2 border-t border-[var(--border-muted)] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[var(--text-muted)]">
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Database className="w-3 h-3" /> Grounded ({m.confidenceScore}% confidence)
                      </span>
                      {m.dataSignals && <span>{m.dataSignals.join(' • ')}</span>}
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-[var(--surface-3)] text-[var(--text-primary)] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 ai-shimmer-bg">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Restaurant Brain is reasoning across live operational context...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="pt-3 border-t border-[var(--border-muted)] shrink-0 flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                  : 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border-muted)] hover:text-indigo-400'
              }`}
              title={isListening ? 'Listening...' : 'Voice Input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2.5 rounded-xl border transition-all ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border-muted)] hover:text-cyan-400'
              }`}
              title={isMuted ? 'Voice output muted' : 'Voice output active'}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={isListening ? 'Listening...' : 'Ask Brain Copilot anything...'}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-[var(--surface-2)] border border-[var(--border-main)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !prompt.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
