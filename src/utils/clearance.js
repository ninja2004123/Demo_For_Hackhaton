export const CLEARANCE_LEVELS = {
  L1: { id: 'L1', label: 'Public',       level: 1, color: 'slate',   badge: 'bg-slate-600 text-slate-100',   ring: 'ring-slate-500' },
  L2: { id: 'L2', label: 'Internal',     level: 2, color: 'emerald', badge: 'bg-emerald-700 text-emerald-100', ring: 'ring-emerald-600' },
  L3: { id: 'L3', label: 'Confidential', level: 3, color: 'blue',    badge: 'bg-blue-700 text-blue-100',     ring: 'ring-blue-600' },
  L4: { id: 'L4', label: 'Restricted',   level: 4, color: 'amber',   badge: 'bg-amber-700 text-amber-100',   ring: 'ring-amber-600' },
  L5: { id: 'L5', label: 'Top Secret',   level: 5, color: 'red',     badge: 'bg-red-700 text-red-100',       ring: 'ring-red-600' },
};

export const ALL_LEVELS = Object.values(CLEARANCE_LEVELS);

export const canAccess = (userClearanceId, docClearanceId) => {
  const userLvl = CLEARANCE_LEVELS[userClearanceId]?.level ?? 0;
  const docLvl  = CLEARANCE_LEVELS[docClearanceId]?.level ?? 0;
  return userLvl >= docLvl;
};

export const filterByAccess = (items, userClearanceId, field = 'clearance') =>
  items.filter(item => canAccess(userClearanceId, item[field]));

export const getAccessibleLevels = (userClearanceId) => {
  const userLvl = CLEARANCE_LEVELS[userClearanceId]?.level ?? 0;
  return ALL_LEVELS.filter(c => c.level <= userLvl);
};
