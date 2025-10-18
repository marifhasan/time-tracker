import { useTimer } from '../contexts/TimerContext';
import { formatDuration } from '../utils/formatTime';

export function TimerDisplay() {
  const { isRunning, currentEntry, elapsedSeconds } = useTimer();

  return (
    <div className="text-center py-3">
      {/* Timer Display */}
      <div className="relative inline-block">
        <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white mb-1.5 tabular-nums">
          {formatDuration(elapsedSeconds)}
        </div>
        {isRunning && (
          <div className="absolute -top-0.5 -right-0.5">
            <span className="flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-900 dark:bg-white opacity-50"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gray-900 dark:bg-white"></span>
            </span>
          </div>
        )}
      </div>

      {/* Project Badge */}
      {currentEntry ? (
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentEntry.project_color }}
          />
          <span className="text-[10px] font-medium text-gray-900 dark:text-white">
            {currentEntry.project_name}
          </span>
          {isRunning && (
            <span className="text-[9px] text-gray-600 dark:text-gray-400">• Running</span>
          )}
        </div>
      ) : (
        <div className="text-gray-500 dark:text-gray-400 text-[10px]">
          No active project
        </div>
      )}
    </div>
  );
}
