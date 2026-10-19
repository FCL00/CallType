import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  FileSpreadsheet,
  Headphones,
  Timer,
  Keyboard,
  Info,
  CheckCircle2,
  HelpCircle,
  FileText
} from 'lucide-react';
import { getScenarioById } from '../data/scenarios';
import { getVoiceById } from '../data/voice-options';
import { getAccountById } from '../data/accounts';
import { AudioPlayer } from '../components/audio-player/AudioPlayer';
import { DocumentationForm } from '../components/forms/DocumentationForm';
import { evaluateDocumentationForm } from '../lib/form-evaluation';
import { evaluateTranscription } from '../lib/scoring';
import { usePracticeStore } from '../store/practice-store';
import { PracticeMode, PracticeSessionRecord } from '../types';
import { formatDuration } from '../lib/utils';

export const PracticePage: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const addSessionResult = usePracticeStore((s) => s.addSessionResult);

  const scenario = getScenarioById(scenarioId || '');
  const voice = scenario ? getVoiceById(scenario.voiceOptionId) : undefined;
  const account = scenario ? getAccountById(scenario.category) : undefined;

  const initialMode = (searchParams.get('mode') as PracticeMode) || 'form';
  const [mode, setMode] = useState<PracticeMode>(initialMode);

  // Form input state
  const [formData, setFormData] = useState<Record<string, string>>({});
  // Verbatim transcription state for fallback / alternative mode
  const [typedText, setTypedText] = useState('');

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<number | null>(null);

  // Timer lifecycle
  useEffect(() => {
    if (isTimerRunning) {
      if (!sessionStartTimeRef.current) {
        sessionStartTimeRef.current = Date.now() - elapsedSeconds * 1000;
      }
      timerIntervalRef.current = setInterval(() => {
        if (sessionStartTimeRef.current) {
          const secs = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
          setElapsedSeconds(secs);
        }
      }, 500);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, elapsedSeconds]);

  if (!scenario || !voice || !account) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Scenario Not Found</h2>
        <p className="text-sm text-stone-500">
          The requested practice scenario could not be loaded.
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  // Audio play handler: automatically start timer
  const handleAudioPlay = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (!isTimerRunning && value.trim().length > 0) {
      setIsTimerRunning(true);
    }
  };

  const handleResetForm = () => {
    setFormData({});
  };

  // Submit and evaluate
  const handleSubmitForm = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsTimerRunning(false);

    const effectiveDuration = Math.max(1, elapsedSeconds);

    // Evaluate form deterministically
    const formEvaluation = evaluateDocumentationForm(
      formData,
      scenario.fieldDefinitions,
      effectiveDuration
    );

    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const record: PracticeSessionRecord = {
      id: sessionId,
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      category: scenario.category,
      voiceName: voice.name,
      difficulty: scenario.difficulty,
      mode: 'form',
      formData,
      formEvaluation,
      timestamp: Date.now()
    };

    addSessionResult(record);
    navigate(`/app/results/${sessionId}`);
  };

  // Submit verbatim transcription mode
  const handleSubmitVerbatim = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsTimerRunning(false);

    const effectiveDuration = Math.max(1, elapsedSeconds);

    const score = evaluateTranscription({
      referenceTranscript: scenario.transcript,
      userTranscription: typedText,
      durationSeconds: effectiveDuration
    });

    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const record: PracticeSessionRecord = {
      id: sessionId,
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      category: scenario.category,
      voiceName: voice.name,
      difficulty: scenario.difficulty,
      mode: 'live',
      typedText,
      score,
      timestamp: Date.now()
    };

    addSessionResult(record);
    navigate(`/app/results/${sessionId}`);
  };

  // Check if user has entered data before exiting
  const hasUnsavedData =
    mode === 'form'
      ? Object.values(formData).some((v) => v.trim().length > 0)
      : typedText.trim().length > 0;

  const handleExitClick = () => {
    if (hasUnsavedData) {
      setShowExitModal(true);
    } else {
      navigate('/app');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <button
            type="button"
            onClick={handleExitClick}
            className="hover:text-stone-900 font-semibold flex items-center gap-1 transition-colors text-stone-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Call</span>
          </button>
          <span>/</span>
          <span className="capitalize font-medium">{account.name}</span>
          <span>/</span>
          <span className="font-semibold text-stone-900">{scenario.title}</span>
        </div>

        {/* Practice Mode Toggle */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode('form')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              mode === 'form'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive CRM Form</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('live')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              mode === 'live'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-stone-600" />
            <span>Verbatim Transcription</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Listening Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
          {/* Audio Player Card */}
          <div className="space-y-4">
            <AudioPlayer
              audioUrl={scenario.audioUrl}
              onPlay={handleAudioPlay}
              autoPlay={false}
            />
          </div>

          {/* Caller & Scenario Instructions */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs">
              <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                scenario.difficulty === 'beginner'
                  ? 'bg-emerald-100 text-emerald-800'
                  : scenario.difficulty === 'intermediate'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {scenario.difficulty} Call
              </span>

              {/* Live Session Timer */}
              <div className="flex items-center gap-1.5 font-mono text-stone-700 font-bold tabular-nums">
                <Timer className="w-3.5 h-3.5 text-stone-400" />
                <span>{formatDuration(elapsedSeconds)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-stone-900 leading-snug">
                {scenario.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {scenario.scenarioSummary}
              </p>
            </div>

            {/* Caller Profile */}
            <div className="pt-2 border-t border-stone-100 flex items-center gap-3">
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${voice.avatarBg}`}>
                {voice.avatarInitials}
              </span>
              <div className="text-xs space-y-0.5 min-w-0">
                <div className="font-bold text-stone-900 truncate">{voice.name}</div>
                <div className="text-stone-500 truncate">{voice.tone} · {voice.speakingStyle}</div>
              </div>
            </div>

            {/* Instructions Callout */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/70 text-xs text-stone-600 space-y-1.5">
              <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Representative Task:</span>
              </div>
              <p className="leading-relaxed">
                Listen to the customer call. As the caller speaks, fill in the corresponding fields in the documentation panel on the right. Accurate names, reference numbers, and customer intent are critical.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Documentation Panel (7 cols) */}
        <div className="lg:col-span-7">
          {mode === 'form' ? (
            <DocumentationForm
              category={scenario.category}
              fields={scenario.fieldDefinitions}
              formData={formData}
              onChange={handleFieldChange}
              onSubmit={handleSubmitForm}
              onReset={handleResetForm}
              isSubmitting={isSubmitting}
            />
          ) : (
            /* Fallback Verbatim Mode */
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <label htmlFor="verbatim-input" className="font-semibold text-stone-800 text-sm">
                  Verbatim Call Transcription
                </label>
                <span>Press <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded font-mono text-[10px]">Ctrl+Enter</kbd> to submit</span>
              </div>

              <textarea
                id="verbatim-input"
                value={typedText}
                onChange={(e) => {
                  setTypedText(e.target.value);
                  if (!isTimerRunning && e.target.value.length > 0) setIsTimerRunning(true);
                }}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmitVerbatim();
                  }
                }}
                placeholder="Type verbatim what the customer says here..."
                rows={10}
                className="w-full p-4 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-stone-900 font-mono text-sm leading-relaxed outline-none"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setTypedText('')}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50"
                >
                  Clear Text
                </button>
                <button
                  type="button"
                  onClick={handleSubmitVerbatim}
                  disabled={isSubmitting || typedText.trim().length === 0}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  Submit Verbatim Call
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal on Discard/Exit */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">Exit active call documentation?</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  You have entered data in this session. Exiting now will discard your case notes without scoring.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-medium text-xs hover:bg-stone-50 transition-colors"
              >
                Keep Documenting
              </button>
              <button
                type="button"
                onClick={() => navigate('/app')}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-medium text-xs hover:bg-rose-700 transition-colors"
              >
                Discard & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
