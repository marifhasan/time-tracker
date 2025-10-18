export interface Project {
  id: number;
  name: string;
  color: string;
  archived: boolean;
  created_at: string;
}

export interface TimeEntry {
  id: number;
  project_id: number;
  start_time: string;
  end_time: string | null;
  duration_seconds: number | null;
  notes: string | null;
  created_at: string;
}

export interface TimeEntryWithProject extends TimeEntry {
  project_name: string;
  project_color: string;
}

export interface ProjectStats {
  project_id: number;
  project_name: string;
  project_color: string;
  total_seconds: number;
  entry_count: number;
}

export interface DailyStats {
  date: string;
  total_seconds: number;
}

export interface TimerState {
  isRunning: boolean;
  currentEntry: TimeEntryWithProject | null;
  elapsedSeconds: number;
}
