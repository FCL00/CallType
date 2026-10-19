import { create } from 'zustand';
import { PracticeSessionRecord, AccountCategory } from '../types';
import {
  loadSessionsFromStorage,
  saveSessionsToStorage,
  clearCallTypeSessionData
} from '../lib/session-storage';

interface CategoryMetric {
  category: AccountCategory;
  count: number;
  avgWpm: number;
  avgAccuracy: number;
}

interface PracticeStore {
  history: PracticeSessionRecord[];
  addSessionResult: (record: PracticeSessionRecord) => void;
  getSessionById: (id: string) => PracticeSessionRecord | undefined;
  clearHistory: () => void;

  // Computed helpers
  getTotalSessions: () => number;
  getAvgNetWpm: () => number;
  getAvgAccuracy: () => number;
  getBestWpm: () => number;
  getCategoryMetrics: () => CategoryMetric[];
}

function getSessionWpm(s: PracticeSessionRecord): number {
  if (s.formEvaluation) return s.formEvaluation.typingWpm;
  if (s.score) return s.score.netWpm;
  return 0;
}

function getSessionAccuracy(s: PracticeSessionRecord): number {
  if (s.formEvaluation) return s.formEvaluation.overallAccuracy;
  if (s.score) return s.score.accuracy;
  return 0;
}

export const usePracticeStore = create<PracticeStore>((set, get) => ({
  history: loadSessionsFromStorage(),

  addSessionResult: (record: PracticeSessionRecord) => {
    set((state) => {
      const updated = [record, ...state.history];
      saveSessionsToStorage(updated);
      return { history: updated };
    });
  },

  getSessionById: (id: string) => {
    return get().history.find((session) => session.id === id);
  },

  clearHistory: () => {
    clearCallTypeSessionData();
    set({ history: [] });
  },

  getTotalSessions: () => {
    return get().history.length;
  },

  getAvgNetWpm: () => {
    const list = get().history;
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + getSessionWpm(curr), 0);
    return Math.round((sum / list.length) * 10) / 10;
  },

  getAvgAccuracy: () => {
    const list = get().history;
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + getSessionAccuracy(curr), 0);
    return Math.round((sum / list.length) * 10) / 10;
  },

  getBestWpm: () => {
    const list = get().history;
    if (list.length === 0) return 0;
    const max = Math.max(...list.map((s) => getSessionWpm(s)));
    return Math.round(max * 10) / 10;
  },

  getCategoryMetrics: () => {
    const list = get().history;
    const categories: AccountCategory[] = ['insurance', 'ticketing', 'ecommerce'];

    return categories.map((cat) => {
      const catSessions = list.filter((s) => s.category === cat);
      if (catSessions.length === 0) {
        return {
          category: cat,
          count: 0,
          avgWpm: 0,
          avgAccuracy: 0
        };
      }
      const sumWpm = catSessions.reduce((acc, s) => acc + getSessionWpm(s), 0);
      const sumAcc = catSessions.reduce((acc, s) => acc + getSessionAccuracy(s), 0);
      return {
        category: cat,
        count: catSessions.length,
        avgWpm: Math.round((sumWpm / catSessions.length) * 10) / 10,
        avgAccuracy: Math.round((sumAcc / catSessions.length) * 10) / 10
      };
    });
  }
}));
