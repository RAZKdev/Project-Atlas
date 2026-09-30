import React from 'react';
import { CountryStatus } from '../../core/contracts';

interface StatusBadgeProps {
  status: CountryStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const styles: Record<CountryStatus, { label: string; bg: string; text: string; dot: string }> = {
    documented: {
      label: 'Terdokumentasi',
      bg: 'bg-moss-500/20 border-moss-500/40',
      text: 'text-moss-400',
      dot: 'bg-moss-400'
    },
    visited: {
      label: 'Dikunjungi',
      bg: 'bg-earth-500/20 border-earth-500/40',
      text: 'text-earth-300',
      dot: 'bg-earth-400'
    },
    planned: {
      label: 'Direncanakan',
      bg: 'bg-blue-500/10 border-blue-500/30',
      text: 'text-blue-300',
      dot: 'bg-blue-400'
    },
    interested: {
      label: 'Diminati',
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-amber-300',
      dot: 'bg-amber-400'
    },
    unknown: {
      label: 'Belum Dijelajahi',
      bg: 'bg-white/5 border-white/10',
      text: 'text-stone-400',
      dot: 'bg-stone-500'
    }
  };

  const current = styles[status] || styles.unknown;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wide ${current.bg} ${current.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      <span>{current.label}</span>
    </span>
  );
};
