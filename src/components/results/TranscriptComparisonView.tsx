import React, { useState } from 'react';
import { WordAlignment } from '../../types';
import { Check, X, Eye, Columns } from 'lucide-react';

interface TranscriptComparisonViewProps {
  referenceTranscript: string;
  typedText: string;
  alignments: WordAlignment[];
}

export const TranscriptComparisonView: React.FC<TranscriptComparisonViewProps> = ({
  referenceTranscript,
  typedText,
  alignments
}) => {
  const [viewMode, setViewMode] = useState<'annotated' | 'sideBySide'>('annotated');

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Header & View Mode Switcher */}
      <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/70 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-stone-900">Word-by-Word Transcript Alignment</h3>
          <p className="text-xs text-stone-500">
            Automated sequence alignment highlighting exact matches, substituted words, omissions, and insertions.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('annotated')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'annotated'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Annotated Alignment
          </button>
          <button
            type="button"
            onClick={() => setViewMode('sideBySide')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'sideBySide'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-stone-100/50 border-b border-stone-200/70 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          </span>
          <span className="text-stone-700 font-medium">Correct</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
          </span>
          <span className="text-stone-700 font-medium">Incorrect / Substituted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          </span>
          <span className="text-stone-700 font-medium">Missing (Omitted)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
          </span>
          <span className="text-stone-700 font-medium">Extra (Unprompted)</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {viewMode === 'annotated' ? (
          <div className="leading-relaxed font-mono text-sm sm:text-base flex flex-wrap gap-x-2 gap-y-2.5 p-4 rounded-xl bg-stone-50 border border-stone-200/60 min-h-[140px]">
            {alignments.length === 0 ? (
              <span className="text-stone-400 italic font-sans text-sm">
                No text transcribed in this session.
              </span>
            ) : (
              alignments.map((item) => {
                if (item.type === 'correct') {
                  return (
                    <span
                      key={item.id}
                      title="Correct transcription"
                      className="px-1.5 py-0.5 rounded bg-emerald-100/70 text-emerald-900 border border-emerald-300 font-medium"
                    >
                      {item.typedWord || item.originalWord}
                    </span>
                  );
                }

                if (item.type === 'incorrect') {
                  return (
                    <span
                      key={item.id}
                      title={`Expected: "${item.originalWord}"`}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 font-medium"
                    >
                      <span className="line-through opacity-75">{item.typedWord}</span>
                      <span className="text-[11px] text-stone-500">→</span>
                      <span className="font-bold text-rose-700 underline decoration-rose-400">
                        {item.originalWord}
                      </span>
                    </span>
                  );
                }

                if (item.type === 'missing') {
                  return (
                    <span
                      key={item.id}
                      title="Missing word from reference transcript"
                      className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-dashed border-amber-400 font-medium opacity-90"
                    >
                      [{item.originalWord}]
                    </span>
                  );
                }

                if (item.type === 'extra') {
                  return (
                    <span
                      key={item.id}
                      title="Extra word not in reference audio"
                      className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-300 line-through decoration-purple-400 font-medium"
                    >
                      +{item.typedWord}
                    </span>
                  );
                }

                return null;
              })
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reference Transcript */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Original Customer Call Transcript
              </div>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-sm font-mono leading-relaxed text-stone-800 h-64 overflow-y-auto">
                {referenceTranscript}
              </div>
            </div>

            {/* User Transcription */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <X className="w-3.5 h-3.5 text-stone-500" />
                Your Submitted Transcription
              </div>
              <div className="p-4 rounded-xl bg-white border border-stone-200 text-sm font-mono leading-relaxed text-stone-800 h-64 overflow-y-auto whitespace-pre-wrap">
                {typedText.trim() ? (
                  typedText
                ) : (
                  <span className="text-stone-400 italic font-sans">
                    (No text was submitted)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
