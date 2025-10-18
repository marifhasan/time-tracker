import type { TimeEntryWithProject } from '../types';
import { formatDuration } from './formatTime';

export async function exportToCSV(entries: TimeEntryWithProject[]): Promise<void> {
  // Create CSV header
  const headers = ['Project', 'Start Time', 'End Time', 'Duration', 'Notes'];
  const csvRows = [headers.join(',')];

  // Add data rows
  for (const entry of entries) {
    const row = [
      `"${entry.project_name}"`,
      entry.start_time,
      entry.end_time || 'In Progress',
      entry.duration_seconds ? formatDuration(entry.duration_seconds) : '00:00:00',
      entry.notes ? `"${entry.notes.replace(/"/g, '""')}"` : '',
    ];
    csvRows.push(row.join(','));
  }

  // Join all rows
  const csvContent = csvRows.join('\n');

  // Create a download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `time-tracker-export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
