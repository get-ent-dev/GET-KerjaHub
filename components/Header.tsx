'use client';

import React from 'react';
import {
  Play,
  Square,
  Sparkles,
  Bell,
  Plus,
  Terminal,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Project, Task } from '@/types/devpulse';

interface HeaderProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  activeEnv: 'production' | 'staging' | 'dev';
  onChangeEnv: (env: 'production' | 'staging' | 'dev') => void;
  activeTimerTask: Task | null;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onOpenCreateTask: () => void;
  onOpenCreateProject: () => void;
  onOpenCopilot: (initialMode?: string) => void;
  unreadAlertCount: number;
  onOpenAlerts: () => void;
}

export function Header({
  projects,
  selectedProjectId,
  onSelectProject,
  activeEnv,
  onChangeEnv,
  activeTimerTask,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onOpenCreateTask,
  onOpenCreateProject,
  onOpenCopilot,
  unreadAlertCount,
  onOpenAlerts,
}: HeaderProps) {
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Project Switcher */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              DP
            </div>
            <div className="hidden md:block">
              <span className="font-semibold text-slate-900 text-sm tracking-tight">DevPulse</span>
              <span className="text-xs text-slate-500 block leading-none">DevOps & AI Workspace</span>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Project Switcher */}
          <div className="flex items-center gap-2 min-w-0">
            <Layers className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedProjectId}
              onChange={(e) => onSelectProject(e.target.value)}
              aria-label="Select active project"
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 max-w-[200px] sm:max-w-[260px] truncate"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.key}] {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Environment Switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium">
            {(['dev', 'staging', 'production'] as const).map((env) => (
              <button
                key={env}
                onClick={() => onChangeEnv(env)}
                className={`px-2.5 py-1 rounded transition-colors capitalize ${
                  activeEnv === env
                    ? env === 'production'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : env === 'staging'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* Center / Right: IDE sync & Time Tracking */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active IDE Sync Indicator */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs text-slate-600">
            <Terminal className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono text-slate-800 font-medium">train_lora.py:142</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">VS Code Bridge Active</span>
          </div>

          {/* IDE Task Time Tracker */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-xs">
            <button
              onClick={onToggleTimer}
              title={isTimerRunning ? 'Pause tracking' : 'Resume time tracking'}
              className={`p-1 rounded transition-colors ${
                isTimerRunning
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-slate-700 text-white hover:bg-slate-800'
              }`}
              aria-label={isTimerRunning ? 'Pause timer' : 'Start timer'}
            >
              {isTimerRunning ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            </button>
            <span className="font-mono font-semibold text-slate-800 text-xs sm:text-sm">
              {formatTimer(timerSeconds)}
            </span>
            <span className="hidden md:inline text-slate-500 truncate max-w-[120px]" title={activeTimerTask?.title || 'No active task'}>
              · {activeTimerTask ? activeTimerTask.title : 'Task Tracker'}
            </span>
          </div>

          {/* Smart AI Dev Copilot */}
          <button
            onClick={() => onOpenCopilot()}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-md text-xs sm:text-sm font-medium transition-colors shrink-0"
            title="Open DevPulse AI Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">AI Copilot</span>
          </button>

          {/* Alerts / Incident notifications */}
          <button
            onClick={onOpenAlerts}
            className="relative p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors shrink-0"
            aria-label="View alerts and notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* Create Button Menu */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onOpenCreateTask}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs sm:text-sm font-medium transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">Task</span>
            </button>
            <button
              onClick={onOpenCreateProject}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
              title="New Project from Template"
            >
              <span>+ Project</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
