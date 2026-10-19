import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Ticket,
  ShoppingBag,
  Play,
  Volume2,
  FileText,
  Clock,
  Gauge,
  Sparkles,
  Info
} from 'lucide-react';
import { getAccountById } from '../data/accounts';
import { getVoicesByCategory } from '../data/voice-options';
import { getScenariosByCategory } from '../data/scenarios';
import { PracticeMode } from '../types';

export const AccountPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const account = getAccountById(category || '');
  const voices = getVoicesByCategory(category || '');
  const scenarios = getScenariosByCategory(category || '');

  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(
    voices[0]?.id || ''
  );
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('form');

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Account Not Found</h2>
        <p className="text-sm text-stone-500">
          The requested category does not exist.
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const selectedVoice = voices.find((v) => v.id === selectedVoiceId) || voices[0];
  const activeScenarios = scenarios.filter((s) => s.voiceOptionId === selectedVoice?.id);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center gap-3 text-xs text-stone-500">
        <Link
          to="/app"
          className="hover:text-stone-900 flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <span>/</span>
        <span className="capitalize font-medium text-stone-800">{account.name}</span>
      </div>

      {/* Account Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800">
              {account.iconName === 'ShieldCheck' && <ShieldCheck className="w-6 h-6 text-emerald-700" />}
              {account.iconName === 'Ticket' && <Ticket className="w-6 h-6 text-amber-700" />}
              {account.iconName === 'ShoppingBag' && <ShoppingBag className="w-6 h-6 text-blue-700" />}
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                {account.badge}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
                {account.name}
              </h1>
            </div>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            {account.description}
          </p>
        </div>

        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/70 text-xs space-y-2 min-w-[200px]">
          <div className="font-semibold text-stone-800">Category Summary</div>
          <div className="text-stone-500 flex justify-between">
            <span>Voice Options:</span>
            <span className="font-mono font-bold text-stone-800">{voices.length}</span>
          </div>
          <div className="text-stone-500 flex justify-between">
            <span>Audio Scenarios:</span>
            <span className="font-mono font-bold text-stone-800">{scenarios.length}</span>
          </div>
          <div className="text-stone-500 flex justify-between">
            <span>Audio Files:</span>
            <span className="text-emerald-700 font-medium">Static MP3</span>
          </div>
        </div>
      </div>

      {/* Voice Selection Tabs */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Select Customer Voice</h2>
          <p className="text-xs text-stone-500">
            Each voice option is a distinct recording with its own tone, cadence, and customer disposition.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {voices.map((voice) => {
            const isSelected = voice.id === selectedVoice?.id;
            return (
              <button
                key={voice.id}
                type="button"
                onClick={() => setSelectedVoiceId(voice.id)}
                className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white/80 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${voice.avatarBg}`}>
                      {voice.avatarInitials}
                    </span>
                    <div>
                      <div className="font-bold text-stone-900">{voice.name}</div>
                      <div className="text-xs text-stone-500">{voice.accent}</div>
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${
                    isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {voice.gender} Voice
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold text-stone-700 shrink-0">Customer Tone:</span>
                    <span className="text-stone-600">{voice.tone}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold text-stone-700 shrink-0">Speaking Style:</span>
                    <span className="text-stone-600">{voice.speakingStyle}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-500 mt-3 pt-2 border-t border-stone-100 line-clamp-2">
                  {voice.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenarios Available for Selected Voice */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900">
            Available Scenarios for {selectedVoice?.name}
          </h2>
          <p className="text-xs text-stone-500">
            Choose a scenario to launch your listening and transcription session.
          </p>
        </div>

        <div className="space-y-4">
          {activeScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-stone-300 transition-all"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-stone-900">
                    {scenario.title}
                  </span>
                  <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                    scenario.difficulty === 'beginner'
                      ? 'bg-emerald-100 text-emerald-800'
                      : scenario.difficulty === 'intermediate'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {scenario.difficulty}
                  </span>
                  <span className="text-xs text-stone-400">·</span>
                  <span className="text-xs text-stone-500 font-mono">
                    {scenario.durationEstimate}
                  </span>
                </div>

                <p className="text-sm text-stone-600 leading-relaxed">
                  {scenario.scenarioSummary}
                </p>

                {/* Key challenges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {scenario.keyDetails.map((detail, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-1 rounded-md bg-stone-100 text-stone-700 font-mono"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mode Selector and Launch */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs font-medium w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedMode('form')}
                    className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-colors ${
                      selectedMode === 'form'
                        ? 'bg-white text-stone-900 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    CRM Form
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMode('live')}
                    className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-colors ${
                      selectedMode === 'live'
                        ? 'bg-white text-stone-900 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Verbatim Text
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/app/practice/${scenario.id}?mode=${selectedMode}`)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Practice Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
