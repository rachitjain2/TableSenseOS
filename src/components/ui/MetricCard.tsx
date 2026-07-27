import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  comparisonText: string;
  changePercent?: number;
  sparklineData?: { val: number }[];
  isGoodWhenUp?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  comparisonText,
  changePercent,
  sparklineData,
  isGoodWhenUp = true,
}) => {
  const isPositive = changePercent !== undefined && changePercent > 0;
  const isNegative = changePercent !== undefined && changePercent < 0;

  const isGood = isPositive ? isGoodWhenUp : !isGoodWhenUp;

  const defaultData = sparklineData || [
    { val: 12 },
    { val: 18 },
    { val: 15 },
    { val: 24 },
    { val: 22 },
    { val: 32 },
    { val: 28 },
  ];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="glass-panel p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-medium block mb-1">
          {title}
        </span>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text-heading)] tracking-tight">
            {value}
          </span>

          {changePercent !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded-md ${
                isGood
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : isNegative ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
              <span>{changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Subtext */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
        <span>{comparisonText}</span>
      </div>

      {/* Sparkline Visual */}
      <div className="h-8 w-full mt-2 -mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={defaultData}>
            <defs>
              <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="val"
              stroke="#6366F1"
              strokeWidth={1.5}
              fill={`url(#grad-${title.replace(/\s+/g, '')})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
