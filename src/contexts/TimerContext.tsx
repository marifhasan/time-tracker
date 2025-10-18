import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { TimeEntryWithProject, Project } from '../types';
import * as db from '../utils/database';

interface TimerContextType {
  isRunning: boolean;
  currentEntry: TimeEntryWithProject | null;
  elapsedSeconds: number;
  projects: Project[];
  startTimer: (projectId: number) => Promise<void>;
  stopTimer: () => Promise<void>;
  loadProjects: () => Promise<void>;
  createProject: (name: string, color?: string) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  refreshTimer: () => Promise<void>;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntryWithProject | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = useCallback(async () => {
    try {
      const loadedProjects = await db.getAllProjects();
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }, []);

  const refreshTimer = useCallback(async () => {
    try {
      const activeTimer = await db.getActiveTimer();
      if (activeTimer) {
        setCurrentEntry(activeTimer);
        setIsRunning(true);

        // Calculate elapsed time
        const startTime = new Date(activeTimer.start_time).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(elapsed);
      } else {
        setCurrentEntry(null);
        setIsRunning(false);
        setElapsedSeconds(0);
      }
    } catch (error) {
      console.error('Failed to refresh timer:', error);
    }
  }, []);

  const startTimer = useCallback(async (projectId: number) => {
    try {
      const entryId = await db.startTimer(projectId);
      await refreshTimer();
    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  }, [refreshTimer]);

  const stopTimer = useCallback(async () => {
    try {
      if (currentEntry) {
        await db.stopTimer(currentEntry.id);
        setCurrentEntry(null);
        setIsRunning(false);
        setElapsedSeconds(0);
      }
    } catch (error) {
      console.error('Failed to stop timer:', error);
    }
  }, [currentEntry]);

  const createProject = useCallback(async (name: string, color?: string) => {
    try {
      await db.createProject(name, color);
      await loadProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }, [loadProjects]);

  const deleteProject = useCallback(async (id: number) => {
    try {
      await db.deleteProject(id);
      await loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  }, [loadProjects]);

  // Update elapsed time every second when timer is running
  useEffect(() => {
    if (isRunning && currentEntry) {
      const interval = setInterval(() => {
        const startTime = new Date(currentEntry.start_time).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, currentEntry]);

  // Initialize data on mount
  useEffect(() => {
    const init = async () => {
      await db.initDatabase();
      await loadProjects();
      await refreshTimer();
    };
    init();
  }, [loadProjects, refreshTimer]);

  // Save state periodically
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(async () => {
        // Ensure timer is still active in database
        await refreshTimer();
      }, 10000); // Every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isRunning, refreshTimer]);

  return (
    <TimerContext.Provider
      value={{
        isRunning,
        currentEntry,
        elapsedSeconds,
        projects,
        startTimer,
        stopTimer,
        loadProjects,
        createProject,
        deleteProject,
        refreshTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
