import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Ticket,
  ShoppingBag,
  Zap,
  Target,
  Trophy,
  History,
  Play,
  RotateCcw,
  Trash2,
  ArrowRight,
  Filter,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { ACCOUNTS } from '../data/accounts';
import { SCENARIOS } from '../data/scenarios';
import { VOICE_OPTIONS } from '../data/voice-options';
import { usePracticeStore } from '../store/practice-store';
import { formatDate, formatDuration } from '../lib/utils';
import { AccountCategory } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    history,
    getTotalSessions,
    getAvgNetWpm,
    getAvgAccuracy,
    getBestWpm,
    getCategoryMetrics,
    clearHistory
  } = usePracticeStore();

  const [categoryFilter, setCategoryFilter] = useState<AccountCategory | 'all'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const totalSessions = getTotalSessions();
  const avgWpm = getAvgNetWpm();
  const avgAccuracy = getAvgAccuracy();
  const bestWpm = getBestWpm();
  const categoryMetrics = getCategoryMetrics();

  const filteredHistory =
    categoryFilter === 'all'
      ? history
      : history.filter((s) => s.category === categoryFilter);

  const handleClear = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Practice Dashboard
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Select a customer support account, listen to realistic caller dialogue, and refine your typing speed.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Completed Calls</span>
              <History className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono tabular-nums text-stone-900">
              {totalSessions}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {totalSessions === 0 ? 'No calls recorded yet' : 'Total calls completed'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Average Speed</span>
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold font-mono tabular-nums text-emerald-700">
              {avgWpm} <span className="text-sm font-normal text-stone-500">Net WPM</span>
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Error-adjusted typing pace
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Average Accuracy</span>
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold font-mono tabular-nums text-stone-900">
              {avgAccuracy}%
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Word-level match rate
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Best Speed</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold font-mono tabular-nums text-stone-900">
              {bestWpm} <span className="text-sm font-normal text-stone-500">WPM</span>
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Personal session record
            </div>
          </div>
        </div>
      </section>

      {/* Account Categories & Voices */}
      <section id="categories" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Training Accounts</h2>
            <p className="text-xs text-stone-500">Choose an industry category to explore customer voices and scenarios</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACCOUNTS.map((account) => {
            const voices = VOICE_OPTIONS.filter((v) => v.accountCategory === account.id);
            const scenarios = SCENARIOS.filter((s) => s.category === account.id);
            const metric = categoryMetrics.find((m) => m.category === account.id);

            return (
              <div
                key={account.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-stone-300 transition-all space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800">
                      {account.iconName === 'ShieldCheck' && <ShieldCheck className="w-5 h-5 text-emerald-700" />}
                      {account.iconName === 'Ticket' && <Ticket className="w-5 h-5 text-amber-700" />}
                      {account.iconName === 'ShoppingBag' && <ShoppingBag className="w-5 h-5 text-blue-700" />}
                    </div>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {account.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-stone-900">{account.name}</h3>
                    <p className="text-xs text-stone-500 font-medium">{account.title}</p>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {account.description}
                  </p>

                  {/* Voices preview */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <div className="text-xs font-semibold text-stone-700">Available Voices:</div>
                    <div className="space-y-2">
                      {voices.map((v) => {
                        const voiceScenario = scenarios.find((s) => s.voiceOptionId === v.id);
                        return (
                          <div
                            key={v.id}
                            className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${v.avatarBg}`}>
                                {v.avatarInitials}
                              </span>
                              <div className="truncate">
                                <div className="font-semibold text-stone-800 truncate">{v.name}</div>
                                <div className="text-[11px] text-stone-500 truncate">{v.tone}</div>
                              </div>
                            </div>

                            {voiceScenario && (
                              <Link
                                to={`/app/practice/${voiceScenario.id}`}
                                className="px-2.5 py-1 rounded-md bg-stone-900 hover:bg-emerald-700 text-white font-medium text-[11px] shrink-0 transition-colors flex items-center gap-1"
                              >
                                <span>Practice</span>
                                <Play className="w-3 h-3 fill-current" />
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>
                    {metric && metric.count > 0 ? (
                      <span className="font-semibold text-emerald-700 font-mono">
                        {metric.count} completed ({metric.avgWpm} WPM)
                      </span>
                    ) : (
                      '0 calls completed'
                    )}
                  </span>
                  <Link
                    to={`/app/accounts/${account.id}`}
                    className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
                  >
                    <span>View Account</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Practice History Section */}
      <section id="history" className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Practice History</h2>
            <p className="text-xs text-stone-500">
              Review your completed support calls and performance records
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs font-medium">
              {(['all', 'insurance', 'ticketing', 'ecommerce'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                    categoryFilter === cat
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="text-xs text-stone-500 hover:text-rose-600 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                title="Clear practice history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>

        {/* Confirmation modal */}
        {showClearConfirm && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold">Clear practice history?</p>
              <p className="text-rose-700 mt-0.5">
                This will delete your {history.length} completed practice records.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        )}

        {/* History Table / Empty State */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/90 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
              <History className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">
                {history.length === 0 ? 'No Practice Calls Yet' : 'No calls matching filter'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {history.length === 0
                  ? 'Pick any scenario above to practice your listening and typing speed. Your scores will show up here.'
                  : 'Try selecting a different category filter or clear the filter.'}
              </p>
            </div>
            {history.length === 0 && (
              <div className="pt-2">
                <Link
                  to="/app/practice/insurance-calm-female-01"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Sample Call (Eleanor Vance)</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Scenario & Voice</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4 text-right">Net WPM</th>
                    <th className="py-3 px-4 text-right">Accuracy</th>
                    <th className="py-3 px-4 text-right">Errors</th>
                    <th className="py-3 px-4 text-right">Time</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{item.scenarioTitle}</div>
                        <div className="text-[11px] text-stone-500">{item.voiceName} · {formatDate(item.timestamp)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-stone-600 font-medium">
                          {item.mode === 'form'
                            ? 'CRM Form'
                            : item.mode === 'live'
                            ? 'Live Call'
                            : 'Full Review'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-emerald-700">
                        {item.formEvaluation ? item.formEvaluation.typingWpm : item.score?.netWpm ?? 0}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums">
                        {item.formEvaluation ? `${item.formEvaluation.overallAccuracy}%` : item.score ? `${item.score.accuracy}%` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-500">
                        {item.formEvaluation
                          ? item.formEvaluation.incorrectCount + item.formEvaluation.missingCount
                          : item.score?.totalErrors ?? 0}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-500">
                        {formatDuration(item.formEvaluation?.completionTimeSec ?? item.score?.sessionDurationSec ?? 0)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/app/results/${item.id}`}
                          className="font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
