import { useState } from 'react';
import { useTimer } from '../contexts/TimerContext';
import { ConfirmDialog } from './ConfirmDialog';

export function ProjectSelector() {
  const { projects, isRunning, currentEntry, startTimer, stopTimer, createProject, deleteProject } = useTimer();
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

  const handleDeleteProject = (projectId: number, projectName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Project?',
      message: `Are you sure you want to delete "${projectName}"? This will also delete all associated time entries. This action cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        await deleteProject(projectId);
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
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Projects</h2>
          <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        <button
          onClick={() => setShowNewProject(!showNewProject)}
          className="flex items-center gap-1 px-2.5 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-[10px]"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showNewProject ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
          </svg>
          {showNewProject ? 'Cancel' : 'New'}
        </button>
      </div>

      {/* New Project Form */}
      {showNewProject && (
        <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h3 className="text-[10px] font-semibold text-gray-900 dark:text-white mb-1.5">Create New Project</h3>
          <form onSubmit={handleCreateProject} className="space-y-1.5">
            <div>
              <label className="block text-[9px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                Project Name
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g., Client Work"
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-gray-900 dark:focus:border-white focus:outline-none text-[10px]"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                Project Color
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={newProjectColor}
                  onChange={(e) => setNewProjectColor(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap gap-0.5">
                    {popularColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewProjectColor(color)}
                        className={`w-5 h-5 rounded-md border ${
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
              className="w-full px-2.5 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-[10px] font-medium"
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
                <div className="p-2">
                  <div className="flex items-center gap-2">
                    {/* Project Color */}
                    <div className="relative">
                      <div
                        className="w-7 h-7 rounded-lg"
                        style={{ backgroundColor: project.color }}
                      />
                      {isThisRunning && (
                        <div className="absolute -top-0.5 -right-0.5">
                          <span className="flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-900 dark:bg-white opacity-50"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gray-900 dark:bg-white"></span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[10px] text-gray-900 dark:text-white truncate">
                        {project.name}
                      </h3>
                      {isActive && (
                        <span className="text-[9px] text-gray-600 dark:text-gray-400">
                          {isThisRunning ? 'Running' : 'Active'}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      {isThisRunning ? (
                        <button
                          onClick={handleStopTimer}
                          className="px-2 py-0.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-[10px]"
                        >
                          Stop
                        </button>
                      ) : isRunning && !isActive ? (
                        <button
                          onClick={() => handleSwitchProject(project.id, project.name)}
                          className="px-2 py-0.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-[10px]"
                        >
                          Switch
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartProject(project.id, project.name)}
                          className="px-2 py-0.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-[10px]"
                        >
                          Start
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteProject(project.id, project.name)}
                        className="p-0.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete project"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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
