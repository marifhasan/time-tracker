import { useState, useEffect } from 'react';
import { getTimeEntries, getProjectStats, deleteProject } from '../utils/database';
import { getStartOfDay, getEndOfDay, getStartOfWeek, getEndOfWeek, formatDuration } from '../utils/formatTime';
import { exportToCSV } from '../utils/exportCSV';
import type { TimeEntryWithProject, ProjectStats } from '../types';
import { format } from 'date-fns';
import { ConfirmDialog } from './ConfirmDialog';

type DateRange = 'today' | 'week' | 'last-week' | 'custom';

export function ReportsWindow() {
  const [dateRange, setDateRange] = useState<DateRange>('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [entries, setEntries] = useState<TimeEntryWithProject[]>([]);
  const [stats, setStats] = useState<ProjectStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    loadData();
  }, [dateRange, startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      let start: string, end: string;

      switch (dateRange) {
        case 'today':
          start = getStartOfDay();
          end = getEndOfDay();
          break;
        case 'week':
          start = getStartOfWeek();
          end = getEndOfWeek();
          break;
        case 'last-week': {
          const lastWeekStart = new Date();
          lastWeekStart.setDate(lastWeekStart.getDate() - 7);
          start = getStartOfWeek(lastWeekStart);
          end = getEndOfWeek(lastWeekStart);
          break;
        }
        case 'custom':
          if (!startDate || !endDate) return;
          start = new Date(startDate).toISOString();
          end = new Date(endDate + 'T23:59:59').toISOString();
          break;
      }

      const [loadedEntries, loadedStats] = await Promise.all([
        getTimeEntries(start, end),
        getProjectStats(start, end),
      ]);

      setEntries(loadedEntries);
      setStats(loadedStats);
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportToCSV(entries);
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  const handleDeleteProject = (projectId: number, projectName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Project?',
      message: `Are you sure you want to delete "${projectName}"? This will also delete all associated time entries. This action cannot be undone.`,
      onConfirm: async () => {
        await deleteProject(projectId);
        await loadData();
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const totalSeconds = stats.reduce((sum, stat) => sum + stat.total_seconds, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Reports</h1>

      {/* Date Range Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setDateRange('today')}
            className={`px-4 py-2 rounded-md transition-colors ${
              dateRange === 'today'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange('week')}
            className={`px-4 py-2 rounded-md transition-colors ${
              dateRange === 'week'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setDateRange('last-week')}
            className={`px-4 py-2 rounded-md transition-colors ${
              dateRange === 'last-week'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Last Week
          </button>
          <button
            onClick={() => setDateRange('custom')}
            className={`px-4 py-2 rounded-md transition-colors ${
              dateRange === 'custom'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Custom
          </button>
        </div>

        {dateRange === 'custom' && (
          <div className="flex gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
          </div>
        )}
      </div>

      {/* Project Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Project Breakdown</h2>
          <button
            onClick={handleExport}
            disabled={entries.length === 0}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : stats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No time entries for this period</div>
        ) : (
          <div className="space-y-3">
            {stats.map((stat) => {
              const percentage = totalSeconds > 0 ? (stat.total_seconds / totalSeconds) * 100 : 0;
              return (
                <div key={stat.project_id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stat.project_color }}
                      />
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {stat.project_name}
                      </span>
                      <button
                        onClick={() => handleDeleteProject(stat.project_id, stat.project_name)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete project"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800 dark:text-gray-100">
                        {formatDuration(stat.total_seconds)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentage.toFixed(1)}% · {stat.entry_count} {stat.entry_count === 1 ? 'entry' : 'entries'}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: stat.project_color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800 dark:text-gray-100">Total</span>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {formatDuration(totalSeconds)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Time Entries List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Time Entries</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No time entries for this period</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.project_color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {entry.project_name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(entry.start_time), 'MMM d, h:mm a')}
                      {entry.end_time && ` - ${format(new Date(entry.end_time), 'h:mm a')}`}
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">
                  {entry.duration_seconds ? formatDuration(entry.duration_seconds) : 'In Progress'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
}
