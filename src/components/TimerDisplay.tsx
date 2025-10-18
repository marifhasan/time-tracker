import { useTimer } from '../contexts/TimerContext';
import { formatDuration } from '../utils/formatTime';

export function TimerDisplay() {
  const { isRunning, currentEntry, elapsedSeconds } = useTimer();

  return (
    <div className="text-center py-8">
      {/* Timer Display */}
      <div className="relative inline-block">
        <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white mb-4 tabular-nums">
          {formatDuration(elapsedSeconds)}
        </div>
        {isRunning && (
          <div className="absolute -top-1 -right-1">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-900 dark:bg-white opacity-50"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-900 dark:bg-white"></span>
            </span>
          </div>
        )}
      </div>

      {/* Project Badge */}
      {currentEntry ? (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: currentEntry.project_color }}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {currentEntry.project_name}
          </span>
          {isRunning && (
            <span className="text-xs text-gray-600 dark:text-gray-400">• Running</span>
          )}
        </div>
      ) : (
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          No active project
        </div>
      )}
    </div>
  );
}
