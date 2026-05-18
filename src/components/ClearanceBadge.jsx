import { Shield } from 'lucide-react';
import { CLEARANCE_LEVELS } from '../utils/clearance.js';

export const ClearanceBadge = ({ level, showIcon = true, size = 'sm' }) => {
  const info = CLEARANCE_LEVELS[level];
  if (!info) return null;

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${info.badge} ${sizes[size] || sizes.sm}`}>
      {showIcon && <Shield className="w-3 h-3" />}
      {info.id} · {info.label}
    </span>
  );
};

export const ClearanceDot = ({ level }) => {
  const dotColors = {
    L1: 'bg-slate-400',
    L2: 'bg-emerald-400',
    L3: 'bg-blue-400',
    L4: 'bg-amber-400',
    L5: 'bg-red-400',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${dotColors[level] || 'bg-gray-400'}`} />;
};
