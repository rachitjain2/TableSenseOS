import React from 'react';
import { getStatusColor } from '../../lib/utils';

interface LiveStatusPillProps {
  status: string;
  label?: string;
  pulse?: boolean;
}

export const LiveStatusPill: React.FC<LiveStatusPillProps> = ({ status, label, pulse = true }) => {
  const styles = getStatusColor(status);
  const displayLabel = label || status.replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border uppercase tracking-wider ${styles.bg} ${styles.text} ${styles.border}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${styles.text.replace('text-', 'bg-')} ${
          pulse ? 'animate-pulse' : ''
        }`}
      />
      <span>{displayLabel}</span>
    </span>
  );
};
