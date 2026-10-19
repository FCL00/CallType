import React from 'react';
import { Timer, Zap, Target, FileText } from 'lucide-react';
import { formatDuration } from '../../lib/utils';
import { PracticeMode } from '../../types';

interface LiveMetricsBarProps {
  elapsedSeconds: number;
  liveWpm: number;
  liveAccuracy: number;
  charactersTyped: number;
  wordsTyped: number;
  mode: PracticeMode;
}

export const LiveMetricsBar: React.FC<LiveMetricsBarProps> = ({
  elapsedSeconds,
  liveWpm,
  liveAccuracy,
  charactersTyped,
  wordsTyped,
  mode
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Elapsed Timer */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
          <Timer className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
            Duration
          </div>
          <div className="text-base font-bold font-mono tabular-nums text-stone-900">
            {formatDuration(elapsedSeconds)}
          </div>
        </div>
      </div>

      {/* Live Speed */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
            Live Speed
          </div>
          <div className="text-base font-bold font-mono tabular-nums text-stone-900">
            {liveWpm} <span className="text-xs font-normal text-stone-500">WPM</span>
          </div>
        </div>
      </div>

      {/* Live Accuracy */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
            Live Accuracy
          </div>
          <div className="text-base font-bold font-mono tabular-nums text-stone-900">
            {liveAccuracy}%
          </div>
        </div>
      </div>

      {/* Character / Word count */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
            Keyed Input
          </div>
          <div className="text-base font-bold font-mono tabular-nums text-stone-900">
            {wordsTyped} <span className="text-xs font-normal text-stone-500">w · {charactersTyped}c</span>
          </div>
        </div>
      </div>
    </div>
  );
};
