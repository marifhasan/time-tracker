import { useState } from 'react';
import { useTimer } from '../contexts/TimerContext';
import { ConfirmDialog } from './ConfirmDialog';

export function ProjectSelector() {
  const { projects, isRunning, currentEntry, startTimer, stopTimer, createProject } = useTimer();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#3B82F6');

  // Confirmation dialogs state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleStartProject = (projectId: number, projectName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Start Timer?',
      message: `Start tracking time for "${projectName}"?`,
      type: 'info',
      onConfirm: async () => {
        await startTimer(projectId);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const handleStopTimer = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Stop Timer?',
      message: `Stop tracking time for "${currentEntry?.project_name}"?`,
      type: 'warning',
      onConfirm: async () => {
        await stopTimer();
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const handleSwitchProject = (projectId: number, projectName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Switch Project?',
      message: `Stop "${currentEntry?.project_name}" and start tracking "${projectName}"?`,
      type: 'warning',
      onConfirm: async () => {
        await stopTimer();
        setTimeout(async () => {
          await startTimer(projectId);
        }, 100);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      try {
        await createProject(newProjectName.trim(), newProjectColor);
        setNewProjectName('');
        setNewProjectColor('#3B82F6');
        setShowNewProject(false);
      } catch (error) {
        alert('Failed to create project. Name might already exist.');
      }
    }
  };

  const popularColors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
    '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Projects</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        <button
          onClick={() => setShowNewProject(!showNewProject)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showNewProject ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
          </svg>
          {showNewProject ? 'Cancel' : 'New'}
        </button>
      </div>

      {/* New Project Form */}
      {showNewProject && (
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Create New Project</h3>
          <form onSubmit={handleCreateProject} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g., Client Work"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-gray-900 dark:focus:border-white focus:outline-none text-sm"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Project Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newProjectColor}
                  onChange={(e) => setNewProjectColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    {popularColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewProjectColor(color)}
                        className={`w-8 h-8 rounded-md border-2 ${
                          newProjectColor === color ? 'border-gray-900 dark:border-white' : 'border-gray-200 dark:border-gray-700'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Create Project
            </button>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-2">
        {projects.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No projects yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Create your first project to get started</p>
          </div>
        ) : (
          projects.map((project) => {
            const isActive = currentEntry?.project_id === project.id;
            const isThisRunning = isActive && isRunning;

            return (
              <div
                key={project.id}
                className={`rounded-lg border transition-colors ${
                  isActive
                    ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    {/* Project Color */}
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-lg"
                        style={{ backgroundColor: project.color }}
                      />
                      {isThisRunning && (
                        <div className="absolute -top-0.5 -right-0.5">
                          <span className="flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-900 dark:bg-white opacity-50"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-900 dark:bg-white"></span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {project.name}
                      </h3>
                      {isActive && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {isThisRunning ? 'Running' : 'Active'}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {isThisRunning ? (
                        <button
                          onClick={handleStopTimer}
                          className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
                        >
                          Stop
                        </button>
                      ) : isRunning && !isActive ? (
                        <button
                          onClick={() => handleSwitchProject(project.id, project.name)}
                          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                        >
                          Switch
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartProject(project.id, project.name)}
                          className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
                        >
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
}
