import React from 'react';

export const RiskBadge = ({ category, score }) => {
  const cat = (category || 'Low').toLowerCase();
  
  let colorStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  if (cat === 'medium') colorStyle = 'bg-amber-50 text-amber-900 border-amber-300';
  if (cat === 'high') colorStyle = 'bg-orange-50 text-orange-900 border-orange-300';
  if (cat === 'critical') colorStyle = 'bg-rose-50 text-rose-900 border-rose-300';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${colorStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 fill-current bg-current"></span>
      {category || 'Low'} {score !== undefined ? `(${score}%)` : ''}
    </span>
  );
};
