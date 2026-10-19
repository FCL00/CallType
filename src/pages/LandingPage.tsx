import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Ticket,
  ShoppingBag,
  Headphones,
  Keyboard,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Volume2,
  FileCheck
} from 'lucide-react';
import { ACCOUNTS } from '../data/accounts';
import { SCENARIOS } from '../data/scenarios';
import { VOICE_OPTIONS } from '../data/voice-options';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 px-6 max-w-5xl mx-auto text-center space-y-8">
        {/* Product Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interactive Customer Support Simulator</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 text-balance leading-[1.12]">
          Listen Closely. Type Accurately. <br className="hidden sm:inline" />
          <span className="text-emerald-700">Get Call-Ready.</span>
        </h1>

        {/* Supporting description */}
        <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed text-balance">
          Practice real-world customer support conversations, improve your typing accuracy, and build confidence handling customer calls in an interactive training simulator.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/app"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-sm transition-all flex items-center justify-center gap-2 group"
          >
            <span>Start Practicing</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#categories"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-medium text-base border border-stone-300 transition-colors shadow-xs"
          >
            Explore Accounts
          </a>
        </div>

        {/* Interactive preview showcase card */}
        <div className="mt-12 p-3 sm:p-5 rounded-2xl bg-stone-900 text-stone-100 shadow-xl border border-stone-800 text-left max-w-3xl mx-auto">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-mono">Call Simulator · Audio Playback Active</span>
            </div>
            <span className="font-mono text-emerald-400">Live Pacing: Natural 140 WPM</span>
          </div>
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800/80 space-y-3 font-mono text-sm">
            <div className="text-stone-400 text-xs flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-stone-500" />
              Customer (Eleanor Vance - Claim CL-88429):
            </div>
            <p className="text-stone-300 italic text-xs sm:text-sm leading-relaxed">
              &quot;Hello, my name is Eleanor Vance, and I am calling to check on the status of my auto insurance claim. The claim reference number is CL-88429, filed under policy number PA-40912...&quot;
            </p>
            <div className="pt-2 border-t border-stone-900 flex items-center justify-between text-xs text-stone-400">
              <span className="text-emerald-400 font-semibold">Live Accuracy: 98.4%</span>
              <span>Net Speed: 62 WPM</span>
              <span className="text-stone-500">Errors: 0</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 scroll-mt-24">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Guided Workflow
          </h2>
          <h3 className="text-3xl font-extrabold text-stone-900">
            How CallType Works
          </h3>
          <p className="text-stone-600 max-w-lg mx-auto text-sm">
            Train the exact muscle memory required in modern customer support centers in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-7 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base">
              1
            </div>
            <h4 className="text-lg font-bold text-stone-900">Choose an Account</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Select between Insurance Support, Ticketing & Events, or E-commerce. Pick customer voices ranging from calm policyholders to urgent callers.
            </p>
            <div className="pt-2 text-xs text-stone-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>3 industries & 9 prerecorded voices (including de-escalation & difficult calls)</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-7 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base">
              2
            </div>
            <h4 className="text-lg font-bold text-stone-900">Listen and Document</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Play genuine human recordings. Fill out realistic, category-specific CRM documentation forms with customer names, order or policy codes, concerns, and resolutions.
            </p>
            <div className="pt-2 text-xs text-stone-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Real-time CRM documentation forms</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-7 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base">
              3
            </div>
            <h4 className="text-lg font-bold text-stone-900">Review Performance</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Receive deterministic Net WPM, Gross WPM, and word-level accuracy. See exact highlighting for substituted words, omissions, and typos.
            </p>
            <div className="pt-2 text-xs text-stone-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Word-level alignment & error feedback</span>
            </div>
          </div>
        </div>
      </section>

      {/* Account Categories Section */}
      <section id="categories" className="max-w-5xl mx-auto px-6 scroll-mt-24">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Training Scenarios
          </h2>
          <h3 className="text-3xl font-extrabold text-stone-900">
            Three Realistic Account Categories
          </h3>
          <p className="text-stone-600 max-w-xl mx-auto text-sm">
            Each category includes distinct voices, authentic customer accents, realistic background challenges, and exact reference transcripts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACCOUNTS.map((account) => {
            const voices = VOICE_OPTIONS.filter((v) => v.accountCategory === account.id);
            const scenarios = SCENARIOS.filter((s) => s.category === account.id);

            return (
              <div
                key={account.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-stone-300 transition-all space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800">
                      {account.iconName === 'ShieldCheck' && <ShieldCheck className="w-5 h-5" />}
                      {account.iconName === 'Ticket' && <Ticket className="w-5 h-5" />}
                      {account.iconName === 'ShoppingBag' && <ShoppingBag className="w-5 h-5" />}
                    </div>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {account.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-stone-900">{account.name}</h4>
                    <p className="text-xs text-stone-500 font-medium">{account.title}</p>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {account.description}
                  </p>

                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <div className="text-xs font-semibold text-stone-700">Prerecorded Voices:</div>
                    <div className="space-y-1.5">
                      {voices.map((v) => (
                        <div key={v.id} className="text-xs flex items-center gap-2 text-stone-600">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${v.avatarBg}`}>
                            {v.avatarInitials}
                          </span>
                          <span className="font-medium text-stone-800">{v.name}</span>
                          <span className="text-stone-400">·</span>
                          <span className="text-stone-500 truncate">{v.tone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    {scenarios.length} Scenarios Available
                  </span>
                  <Link
                    to={`/app/accounts/${account.id}`}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
                  >
                    <span>Practice Account</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-stone-100/70 rounded-3xl p-8 sm:p-12 border border-stone-200">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Training Engine
            </h2>
            <h3 className="text-3xl font-extrabold text-stone-900">
              Built for High-Stakes Support Accuracy
            </h3>
            <p className="text-stone-600 max-w-xl mx-auto text-sm">
              Standard typing tests use random literary passages. CallType tests the exact details support agents struggle with most: claim numbers, addresses, and emotional customer pacing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-2">
              <Headphones className="w-5 h-5 text-emerald-700 mb-2" />
              <h4 className="font-bold text-sm text-stone-900">Listening Practice</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tune your ear to diverse conversational cadences, regional US accents, and varying urgency levels.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-2">
              <Keyboard className="w-5 h-5 text-emerald-700 mb-2" />
              <h4 className="font-bold text-sm text-stone-900">Reference Identifiers</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Practice rapid alphanumeric data entry: policy numbers, ticket barcodes, currencies, and order references.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-2">
              <Zap className="w-5 h-5 text-emerald-700 mb-2" />
              <h4 className="font-bold text-sm text-stone-900">Gross & Net WPM</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Standard 5-character word metrics with uncorrected error deductions, avoiding inflated speeds.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-2">
              <FileCheck className="w-5 h-5 text-emerald-700 mb-2" />
              <h4 className="font-bold text-sm text-stone-900">Word Alignment Diff</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Dynamic sequence alignment highlights substitutions, omissions, and unprompted extra words cleanly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-emerald-800 text-white shadow-lg space-y-6">
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to test your support listening and typing speed?
          </h3>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Jump straight into a live customer call scenario. No account creation or sign-in needed.
          </p>
          <div className="pt-2">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-emerald-900 font-bold text-base hover:bg-emerald-50 transition-colors shadow-md"
            >
              <span>Launch Practice Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
