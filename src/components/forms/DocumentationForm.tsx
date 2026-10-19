import React, { useId } from 'react';
import { ExpectedFieldDefinition, AccountCategory } from '../../types';
import { CheckCircle2, RotateCcw, Send, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface DocumentationFormProps {
  category: AccountCategory;
  fields: ExpectedFieldDefinition[];
  formData: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isSubmitting?: boolean;
}

export const DocumentationForm: React.FC<DocumentationFormProps> = ({
  category,
  fields,
  formData,
  onChange,
  onSubmit,
  onReset,
  isSubmitting = false
}) => {
  const formId = useId();

  // Calculate completed fields progress
  const completedCount = fields.filter((f) => (formData[f.key] || '').trim().length > 0).length;
  const totalCount = fields.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col h-full">
      {/* CRM Header Bar */}
      <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 capitalize">
              {category} Call Documentation CRM
            </h2>
            <p className="text-xs text-stone-500">
              Record caller details in real time as the customer speaks
            </p>
          </div>
        </div>

        {/* Progress tracker */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-stone-600">
              {completedCount} of {totalCount} fields
            </div>
            <div className="w-24 sm:w-28 h-1.5 bg-stone-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Interactive Form Fields */}
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        onKeyDown={handleKeyDown}
        className="p-5 sm:p-6 space-y-5 flex-1 overflow-y-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => {
            const val = formData[field.key] || '';
            const isTextarea = field.type === 'textarea';
            const isSelect = field.type === 'select';
            const isFullWidth = isTextarea || field.key === 'reasonForCalling' || field.key === 'customerConcern' || field.key === 'issueReported';

            return (
              <div
                key={field.key}
                className={isFullWidth ? 'sm:col-span-2 space-y-1.5' : 'space-y-1.5'}
              >
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`${formId}-${field.key}`}
                    className="text-xs font-semibold text-stone-700 flex items-center gap-1"
                  >
                    <span>{field.label}</span>
                    {field.required && (
                      <span className="text-rose-500" title="Required field">*</span>
                    )}
                  </label>
                  {field.hint && (
                    <span className="text-[11px] text-stone-400 italic">
                      {field.hint}
                    </span>
                  )}
                </div>

                {isSelect ? (
                  <select
                    id={`${formId}-${field.key}`}
                    value={val}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-stone-900 bg-white outline-none transition-all cursor-pointer font-medium"
                  >
                    <option value="">-- Select {field.label} --</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : isTextarea ? (
                  <textarea
                    id={`${formId}-${field.key}`}
                    value={val}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    placeholder={`Enter customer's ${field.label.toLowerCase()}...`}
                    rows={2}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-stone-900 placeholder:text-stone-400 outline-none transition-all leading-relaxed"
                  />
                ) : (
                  <input
                    id={`${formId}-${field.key}`}
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={val}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    placeholder={`e.g. ${field.label}`}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-stone-900 placeholder:text-stone-400 outline-none transition-all font-mono"
                  />
                )}
              </div>
            );
          })}
        </div>
      </form>

      {/* CRM Action Footer */}
      <div className="p-4 sm:p-5 bg-stone-50/80 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono shadow-2xs">
            Ctrl+Enter
          </kbd>
          <span>to submit case documentation</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 hover:text-stone-900 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Form</span>
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || completedCount === 0}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit Documentation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
