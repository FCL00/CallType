import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-200 bg-white text-stone-600 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                CT
              </span>
              <span className="text-base font-bold text-stone-900">CallType</span>
            </div>
            <p className="text-sm text-stone-500 max-w-md">
              Realistic customer support listening, transcription, and typing simulator. Built to help customer service representatives master live call pacing and transcript accuracy.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-3">
              Training Accounts
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/app/accounts/insurance" className="hover:text-emerald-700 transition-colors">
                  Insurance Support
                </Link>
              </li>
              <li>
                <Link to="/app/accounts/ticketing" className="hover:text-emerald-700 transition-colors">
                  Ticketing & Events
                </Link>
              </li>
              <li>
                <Link to="/app/accounts/ecommerce" className="hover:text-emerald-700 transition-colors">
                  E-commerce Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-3">
              Simulator
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/app" className="hover:text-emerald-700 transition-colors">
                  All Scenarios
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-emerald-700 transition-colors">
                  Evaluation Methodology
                </Link>
              </li>
              <li>
                <Link to="/app#history" className="hover:text-emerald-700 transition-colors">
                  Session History
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} CallType Simulator. All rights reserved. Fictional scenarios not affiliated with any commercial carrier or merchant.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">Support Simulation Platform</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-400">Zero AI At Runtime</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
