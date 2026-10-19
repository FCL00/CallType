import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Zap,
  Target,
  AlertCircle,
  Clock,
  RotateCcw,
  ArrowRight,
  LayoutDashboard,
  CheckCircle2,
  FileSpreadsheet,
  HelpCircle,
  Lightbulb,
  XCircle
} from 'lucide-react';
import { usePracticeStore } from '../store/practice-store';
import { getScenarioById } from '../data/scenarios';
import { getVoiceById } from '../data/voice-options';
import { getAccountById } from '../data/accounts';
import { FormFieldComparisonView } from '../components/results/FormFieldComparisonView';
import { TranscriptComparisonView } from '../components/results/TranscriptComparisonView';
import { formatDuration, formatDate } from '../lib/utils';

export const ResultsPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const getSessionById = usePracticeStore((s) => s.getSessionById);

  const session = getSessionById(sessionId || '');

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Session Results Not Found</h2>
        <p className="text-sm text-stone-500">
          This session may have expired or was cleared. Return to the dashboard to launch a new call.
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-sm hover:bg-emerald-700 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </Link>
      </div>
    );
  }

  const scenario = getScenarioById(session.scenarioId);
  const account = getAccountById(session.category);
  const voice = scenario ? getVoiceById(scenario.voiceOptionId) : undefined;

  const isFormMode = !!session.formEvaluation;
  const formEval = session.formEvaluation;
  const verbatimScore = session.score;

  // Form evaluation coaching advice
  let adviceTitle = 'General Listening Recommendation';
  let adviceTips: string[] = [];

  if (formEval) {
    if (formEval.overallAccuracy >= 90) {
      adviceTitle = 'Outstanding Case Documentation';
      adviceTips = [
        'You captured critical identifiers, customer intent, and resolution criteria with high precision.',
        'Your notes are clear, actionable, and ready for immediate tier-2 escalation or fulfillment.'
      ];
    } else if (formEval.overallAccuracy >= 75) {
      adviceTitle = 'Solid Support Entry with Minor Gaps';
      adviceTips = [
        'Pay special attention to alphanumeric codes (policy numbers, order IDs, and claim references).',
        'Ensure customer resolution requirements are noted in full before ending the call interaction.'
      ];
    } else {
      adviceTitle = 'Areas for Active Listening Improvement';
      adviceTips = [
        'Replay audio sections when the customer recites reference numbers or incident dates.',
        'Focus on separating the "Reason for Calling" (high level) from the "Specific Concern" (the exact problem).'
      ];
    }

    // Add specific tips based on what was missed
    const hasMissingId = formEval.fields.some(
      (f) => (f.fieldKey.toLowerCase().includes('number') || f.fieldKey.toLowerCase().includes('reference')) && f.status !== 'correct'
    );
    if (hasMissingId) {
      adviceTips.push('Key identifier tip: Customer support quality audits heavily weight exact reference numbers and spelling.');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <Link to="/app" className="hover:text-stone-900 font-medium transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="capitalize">{session.category}</span>
          <span>/</span>
          <span className="font-semibold text-stone-800">
            {isFormMode ? 'Case Evaluation Report' : 'Transcription Evaluation'}
          </span>
        </div>
        <div className="font-mono text-stone-400">
          {formatDate(session.timestamp)}
        </div>
      </div>

      {/* Main Performance Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div className="space-y-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 uppercase tracking-wider">
              {isFormMode ? 'CRM Documentation QA Audit' : 'Verbatim Transcription'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Call Performance Report
            </h1>
            <p className="text-xs text-stone-500">
              {session.scenarioTitle} · Customer: {session.voiceName} ({session.category} Support)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate(`/app/practice/${session.scenarioId}`)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Call</span>
            </button>

            <Link
              to={`/app/accounts/${session.category}`}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Another Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/app"
              className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        {isFormMode && formEval ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70">
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Form Accuracy</span>
                <Target className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono tabular-nums text-emerald-700">
                {formEval.overallAccuracy}%
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">Weighted QA score</div>
            </div>

            <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70">
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Correct Fields</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono tabular-nums text-stone-900">
                {formEval.correctCount} <span className="text-sm font-normal text-stone-500">/ {formEval.totalFields}</span>
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                {formEval.partialCount > 0 ? `+ ${formEval.partialCount} partial` : 'Fully verified'}
              </div>
            </div>

            <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70">
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Errors & Missing</span>
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="text-3xl font-extrabold font-mono tabular-nums text-rose-700">
                {formEval.incorrectCount + formEval.missingCount}
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                {formEval.missingCount} missing · {formEval.incorrectCount} incorrect
              </div>
            </div>

            <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70">
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Duration</span>
                <Clock className="w-3.5 h-3.5 text-stone-500" />
              </div>
              <div className="text-3xl font-extrabold font-mono tabular-nums text-stone-900">
                {formatDuration(formEval.completionTimeSec)}
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                {formEval.charactersTyped} characters
              </div>
            </div>

            <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70 col-span-2 lg:col-span-1">
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Typing Speed</span>
                <Zap className="w-3.5 h-3.5 text-stone-500" />
              </div>
              <div className="text-3xl font-extrabold font-mono tabular-nums text-stone-900">
                {formEval.typingWpm} <span className="text-sm font-normal text-stone-500">WPM</span>
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">Entry cadence</div>
            </div>
          </div>
        ) : (
          /* Verbatim scores */
          verbatimScore && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70">
                <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Net Speed
                </div>
                <div className="text-3xl font-extrabold font-mono tabular-nums text-emerald-700">
                  {verbatimScore.netWpm} WPM
                </div>
              </div>
              <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70">
                <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Accuracy
                </div>
                <div className="text-3xl font-extrabold font-mono tabular-nums text-stone-900">
                  {verbatimScore.accuracy}%
                </div>
              </div>
              <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70">
                <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Errors
                </div>
                <div className="text-3xl font-extrabold font-mono tabular-nums text-rose-700">
                  {verbatimScore.totalErrors}
                </div>
              </div>
              <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70">
                <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Duration
                </div>
                <div className="text-3xl font-extrabold font-mono tabular-nums text-stone-900">
                  {formatDuration(verbatimScore.sessionDurationSec)}
                </div>
              </div>
            </div>
          )
        )}

        {/* Listening Quality Suggestions */}
        {isFormMode && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900 text-sm">
              <Lightbulb className="w-4 h-4 text-emerald-700" />
              <span>{adviceTitle}</span>
            </div>
            <ul className="space-y-1 list-disc list-inside text-emerald-900/90 leading-relaxed">
              {adviceTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Field-by-Field CRM Verification Table */}
      {isFormMode && formEval && (
        <section className="space-y-4">
          <FormFieldComparisonView fields={formEval.fields} />
        </section>
      )}

      {/* Verbatim Alignment View (if submitted in verbatim mode) */}
      {!isFormMode && verbatimScore && scenario && (
        <section className="space-y-4">
          <TranscriptComparisonView
            referenceTranscript={scenario.transcript}
            typedText={session.typedText || ''}
            alignments={verbatimScore.wordAlignments}
          />
        </section>
      )}

      {/* Bottom Navigation Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
        <Link
          to="/app"
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to={`/app/accounts/${session.category}`}
            className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50"
          >
            Explore Another Call
          </Link>
          <button
            type="button"
            onClick={() => navigate(`/app/practice/${session.scenarioId}`)}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            Practice Call Again
          </button>
        </div>
      </div>
    </div>
  );
};
