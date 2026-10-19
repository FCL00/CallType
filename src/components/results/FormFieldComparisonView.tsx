import React, { useState } from 'react';
import { FieldEvaluation, FieldEvaluationStatus } from '../../types';
import { CheckCircle2, AlertCircle, HelpCircle, XCircle, Filter } from 'lucide-react';

interface FormFieldComparisonViewProps {
  fields: FieldEvaluation[];
}

export const FormFieldComparisonView: React.FC<FormFieldComparisonViewProps> = ({
  fields
}) => {
  const [filter, setFilter] = useState<'all' | 'needs-review' | 'correct'>('all');

  const filteredFields = fields.filter((f) => {
    if (filter === 'correct') return f.status === 'correct';
    if (filter === 'needs-review') return f.status !== 'correct';
    return true;
  });

  const getStatusBadge = (status: FieldEvaluationStatus) => {
    switch (status) {
      case 'correct':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Correct</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Partially Correct</span>
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-dashed border-stone-300">
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            <span>Missing Entry</span>
          </span>
        );
      case 'incorrect':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Incorrect</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-4">
      {/* Header and Filter */}
      <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-stone-900">
            Field-by-Field Case Verification
          </h3>
          <p className="text-xs text-stone-500">
            Comparison between customer statements and your CRM documentation
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors font-medium ${
              filter === 'all'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Fields ({fields.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('needs-review')}
            className={`px-3 py-1 rounded-md transition-colors font-medium ${
              filter === 'needs-review'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Needs Review ({fields.filter((f) => f.status !== 'correct').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('correct')}
            className={`px-3 py-1 rounded-md transition-colors font-medium ${
              filter === 'correct'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Correct ({fields.filter((f) => f.status === 'correct').length})
          </button>
        </div>
      </div>

      {/* Field List */}
      <div className="p-5 sm:p-6 space-y-4">
        {filteredFields.map((field) => {
          const isError = field.status === 'incorrect' || field.status === 'missing';
          const isPartial = field.status === 'partial';

          return (
            <div
              key={field.fieldKey}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isError
                  ? 'bg-rose-50/30 border-rose-200/80'
                  : isPartial
                  ? 'bg-amber-50/30 border-amber-200/80'
                  : 'bg-stone-50/40 border-stone-200/80'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  {field.fieldLabel}
                </span>
                {getStatusBadge(field.status)}
              </div>

              {/* Side by side user entry vs expected */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* User entry */}
                <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
                  <div className="text-[11px] font-sans font-semibold text-stone-500 uppercase tracking-wider">
                    Your Recorded Entry:
                  </div>
                  <div className="text-stone-900 leading-relaxed font-medium">
                    {field.userValue}
                  </div>
                </div>

                {/* Expected reference value */}
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-1">
                  <div className="text-[11px] font-sans font-semibold text-emerald-800 uppercase tracking-wider">
                    Customer Statement / Expected:
                  </div>
                  <div className="text-emerald-950 leading-relaxed font-semibold">
                    {field.expectedValue}
                  </div>
                </div>
              </div>

              {/* QA Feedback explanation */}
              <div className="mt-3 pt-2.5 border-t border-stone-200/60 text-xs text-stone-600 flex items-start gap-1.5 font-sans">
                <span className="font-semibold text-stone-800 shrink-0">QA Feedback:</span>
                <span>{field.explanation}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
