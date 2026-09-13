import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const LARR_STAGES = [
  'Stage 0: Pre-Notification',
  'Stage 1: Proposal Submission',
  'Stage 2: SIA & Public Hearing',
  'Stage 3: Section 4 Preliminary Notification',
  'Stage 4: Rehabilitation Survey',
  'Stage 5: Section 11 Notification',
  'Stage 6: R&R Scheme Approval',
  'Stage 7: Section 19 Declaration',
  'Stage 8: Award Determination',
  'Stage 9: Possession & Compensation'
];

export const StageStepper = ({ currentStage }) => {
  const currentIndex = LARR_STAGES.findIndex(s => s.toLowerCase() === (currentStage || '').toLowerCase());
  const activeIdx = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full py-4 overflow-x-auto">
      <div className="flex items-center min-w-[750px]">
        {LARR_STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <React.Fragment key={stage}>
              <div className="flex flex-col items-center group relative text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  isCompleted ? 'bg-emerald-600 text-white' :
                  isCurrent ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400' :
                  'bg-slate-100 text-slate-400 border border-slate-300'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx}
                </div>
                <span className={`text-[10px] font-semibold mt-2 max-w-[70px] leading-tight ${
                  isCurrent ? 'text-amber-900 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {stage.split(':')[0]}
                </span>
              </div>
              {idx < LARR_STAGES.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 transition ${
                  idx < activeIdx ? 'bg-emerald-600' : 'bg-slate-200'
                }`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
