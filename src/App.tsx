import { useState } from 'react';
import { TimerProvider, useTimer } from './contexts/TimerContext';
import { TimerDisplay } from './components/TimerDisplay';
import { ProjectSelector } from './components/ProjectSelector';
import { QuickStats } from './components/QuickStats';
import { ReportsWindow } from './components/ReportsWindow';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './App.css';

function AppContent() {
  const [showReports, setShowReports] = useState(false);
  const { isRunning, stopTimer, projects, startTimer } = useTimer();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      metaKey: true,
      shiftKey: true,
      callback: () => {
        if (isRunning) {
          stopTimer();
        } else if (projects.length > 0) {
          // Start timer with the first project
          startTimer(projects[0].id);
        }
      },
    },
    {
      key: 'r',
      metaKey: true,
      shiftKey: true,
      callback: () => {
        setShowReports((prev) => !prev);
      },
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showReports ? (
        <div>
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <button
              onClick={() => setShowReports(false)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Timer
            </button>
          </div>
          <ReportsWindow />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto p-3 space-y-2.5">
          {/* Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-base font-bold text-gray-900 dark:text-white">
                  Time Tracker
                </h1>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Track your time efficiently</p>
              </div>
              <button
                onClick={() => setShowReports(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-xs"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Reports
              </button>
            </div>

            <TimerDisplay />

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium uppercase text-[9px]">Stats</span>
              </div>
            </div>

            <QuickStats />
          </div>

          {/* Projects Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <ProjectSelector />
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-[9px] text-gray-600 dark:text-gray-400">
              <span className="font-medium">Shortcuts:</span>
              <div className="flex items-center gap-0.5">
                <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[9px]">⌘⇧S</kbd>
                <span>Start/Stop</span>
              </div>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <div className="flex items-center gap-0.5">
                <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[9px]">⌘⇧R</kbd>
                <span>Reports</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <TimerProvider>
      <AppContent />
    </TimerProvider>
  );
}

export default App;
