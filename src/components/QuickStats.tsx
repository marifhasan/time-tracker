import { useState, useEffect } from 'react';
import { getTodayTotal, getWeekTotal } from '../utils/database';
import { formatShortDuration } from '../utils/formatTime';

export function QuickStats() {
  const [todayTotal, setTodayTotal] = useState(0);
  const [weekTotal, setWeekTotal] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      const today = await getTodayTotal();
      const week = await getWeekTotal();
      setTodayTotal(today);
      setWeekTotal(week);
    };

    loadStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2.5">
      <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">Today</div>
        <div className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
          {formatShortDuration(todayTotal)}
        </div>
      </div>

      <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">This Week</div>
        <div className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
          {formatShortDuration(weekTotal)}
        </div>
      </div>
    </div>
  );
}
