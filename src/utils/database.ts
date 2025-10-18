import Database from '@tauri-apps/plugin-sql';
import type { Project, TimeEntry, TimeEntryWithProject, ProjectStats } from '../types';

let db: Database | null = null;

export async function initDatabase(): Promise<Database> {
  if (!db) {
    db = await Database.load('sqlite:time_tracker.db');
  }
  return db;
}

export async function getDatabase(): Promise<Database> {
  if (!db) {
    return initDatabase();
  }
  return db;
}

// Project functions
export async function getAllProjects(): Promise<Project[]> {
  const database = await getDatabase();
  const result = await database.select<Project[]>(
    'SELECT * FROM projects WHERE archived = 0 ORDER BY created_at DESC'
  );
  return result;
}

export async function createProject(name: string, color: string = '#3B82F6'): Promise<number> {
  const database = await getDatabase();
  const result = await database.execute(
    'INSERT INTO projects (name, color) VALUES ($1, $2)',
    [name, color]
  );
  return result.lastInsertId as number;
}

export async function updateProject(id: number, name?: string, color?: string): Promise<void> {
  const database = await getDatabase();
  if (name && color) {
    await database.execute(
      'UPDATE projects SET name = $1, color = $2 WHERE id = $3',
      [name, color, id]
    );
  } else if (name) {
    await database.execute('UPDATE projects SET name = $1 WHERE id = $2', [name, id]);
  } else if (color) {
    await database.execute('UPDATE projects SET color = $1 WHERE id = $2', [color, id]);
  }
}

export async function archiveProject(id: number): Promise<void> {
  const database = await getDatabase();
  await database.execute('UPDATE projects SET archived = 1 WHERE id = $1', [id]);
}

export async function deleteProject(id: number): Promise<void> {
  const database = await getDatabase();
  await database.execute('DELETE FROM projects WHERE id = $1', [id]);
}

// Time entry functions
export async function startTimer(projectId: number): Promise<number> {
  const database = await getDatabase();

  // Stop any existing running timer
  await stopActiveTimer();

  const startTime = new Date().toISOString();
  const result = await database.execute(
    'INSERT INTO time_entries (project_id, start_time) VALUES ($1, $2)',
    [projectId, startTime]
  );
  return result.lastInsertId as number;
}

export async function stopTimer(entryId: number): Promise<void> {
  const database = await getDatabase();
  const endTime = new Date().toISOString();

  // Get the entry to calculate duration
  const entries = await database.select<TimeEntry[]>(
    'SELECT * FROM time_entries WHERE id = $1',
    [entryId]
  );

  if (entries.length > 0) {
    const entry = entries[0];
    const startSeconds = new Date(entry.start_time).getTime() / 1000;
    const endSeconds = new Date(endTime).getTime() / 1000;
    const duration = Math.floor(endSeconds - startSeconds);

    await database.execute(
      'UPDATE time_entries SET end_time = $1, duration_seconds = $2 WHERE id = $3',
      [endTime, duration, entryId]
    );
  }
}

export async function stopActiveTimer(): Promise<void> {
  const database = await getDatabase();
  const activeEntries = await database.select<TimeEntry[]>(
    'SELECT * FROM time_entries WHERE end_time IS NULL'
  );

  for (const entry of activeEntries) {
    await stopTimer(entry.id);
  }
}

export async function getActiveTimer(): Promise<TimeEntryWithProject | null> {
  const database = await getDatabase();
  const result = await database.select<TimeEntryWithProject[]>(
    `SELECT
      te.id,
      te.project_id,
      te.start_time,
      te.end_time,
      te.duration_seconds,
      te.notes,
      p.name as project_name,
      p.color as project_color
    FROM time_entries te
    JOIN projects p ON te.project_id = p.id
    WHERE te.end_time IS NULL
    LIMIT 1`
  );

  return result.length > 0 ? result[0] : null;
}

export async function getTimeEntries(
  startDate?: string,
  endDate?: string,
  projectId?: number
): Promise<TimeEntryWithProject[]> {
  const database = await getDatabase();

  let query = `
    SELECT
      te.id,
      te.project_id,
      te.start_time,
      te.end_time,
      te.duration_seconds,
      te.notes,
      te.created_at,
      p.name as project_name,
      p.color as project_color
    FROM time_entries te
    JOIN projects p ON te.project_id = p.id
    WHERE 1=1
  `;

  const params: any[] = [];

  if (startDate) {
    query += ' AND te.start_time >= $' + (params.length + 1);
    params.push(startDate);
  }

  if (endDate) {
    query += ' AND te.start_time <= $' + (params.length + 1);
    params.push(endDate);
  }

  if (projectId) {
    query += ' AND te.project_id = $' + (params.length + 1);
    params.push(projectId);
  }

  query += ' ORDER BY te.start_time DESC';

  return database.select<TimeEntryWithProject[]>(query, params);
}

export async function updateTimeEntry(
  id: number,
  data: { start_time?: string; end_time?: string; notes?: string }
): Promise<void> {
  const database = await getDatabase();
  const updates: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (data.start_time) {
    updates.push(`start_time = $${paramIndex++}`);
    params.push(data.start_time);
  }

  if (data.end_time) {
    updates.push(`end_time = $${paramIndex++}`);
    params.push(data.end_time);
  }

  if (data.notes !== undefined) {
    updates.push(`notes = $${paramIndex++}`);
    params.push(data.notes);
  }

  if (updates.length > 0) {
    params.push(id);
    await database.execute(
      `UPDATE time_entries SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      params
    );
  }
}

export async function deleteTimeEntry(id: number): Promise<void> {
  const database = await getDatabase();
  await database.execute('DELETE FROM time_entries WHERE id = $1', [id]);
}

// Stats functions
export async function getTodayTotal(): Promise<number> {
  const database = await getDatabase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfDay = today.toISOString();

  const result = await database.select<{ total: number }[]>(
    `SELECT COALESCE(SUM(duration_seconds), 0) as total
     FROM time_entries
     WHERE start_time >= $1 AND end_time IS NOT NULL`,
    [startOfDay]
  );

  return result[0]?.total || 0;
}

export async function getWeekTotal(): Promise<number> {
  const database = await getDatabase();
  const today = new Date();
  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const result = await database.select<{ total: number }[]>(
    `SELECT COALESCE(SUM(duration_seconds), 0) as total
     FROM time_entries
     WHERE start_time >= $1 AND end_time IS NOT NULL`,
    [startOfWeek.toISOString()]
  );

  return result[0]?.total || 0;
}

export async function getProjectStats(startDate: string, endDate: string): Promise<ProjectStats[]> {
  const database = await getDatabase();

  const result = await database.select<ProjectStats[]>(
    `SELECT
      p.id as project_id,
      p.name as project_name,
      p.color as project_color,
      COALESCE(SUM(te.duration_seconds), 0) as total_seconds,
      COUNT(te.id) as entry_count
    FROM projects p
    LEFT JOIN time_entries te ON p.id = te.project_id
      AND te.start_time >= $1
      AND te.start_time <= $2
      AND te.end_time IS NOT NULL
    WHERE p.archived = 0
    GROUP BY p.id, p.name, p.color
    HAVING total_seconds > 0
    ORDER BY total_seconds DESC`,
    [startDate, endDate]
  );

  return result;
}
