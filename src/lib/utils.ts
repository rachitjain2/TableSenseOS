import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = '$'): string {
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs}h`;
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'seated':
    case 'in_kitchen':
    case 'cooking':
    case 'active':
    case 'occupied':
      return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' };
    case 'food_served':
    case 'served':
    case 'completed':
    case 'ready':
    case 'ok':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' };
    case 'needs_bill':
    case 'billed':
    case 'critical':
    case 'urgent':
    case 'low_stock':
      return { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' };
    case 'needs_cleaning':
    case 'preparing':
    case 'pending':
      return { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' };
    case 'empty':
    case 'available':
    default:
      return { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/20' };
  }
}
