'use client';

import React, { useState } from 'react';
import {
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  Sparkles,
  Cpu,
  Layers,
  Terminal,
  Play,
  Square,
  ChevronRight,
  GitCommit,
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, TeamMember } from '@/types/devpulse';
import { AutomationRule, applyAutomationRules } from '@/lib/devpulse-logic';

interface KanbanBoardProps {
  tasks: Task[];
  members: TeamMember[];
  selectedProjectId: string;
  automationRules: AutomationRule[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenTaskDetail: (task: Task) => void;
  onOpenCreateTask: (defaultStatus?: TaskStatus) => void;
  onAutoAssign: (taskId: string) => void;
  activeTimerTaskId?: string;
  onToggleTimer: (task: Task) => void;
}

export function KanbanBoard({
  tasks,
  members,
  selectedProjectId,
  automationRules,
  onUpdateTaskStatus,
  onOpenTaskDetail,
  onOpenCreateTask,
  onAutoAssign,
  activeTimerTaskId,
  onToggleTimer,
}: KanbanBoardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const columns: { id: TaskStatus; label: string }[] = [
    { id: 'backlog', label: 'Backlog' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'review', label: 'Review / QA' },
    { id: 'done', label: 'Done' },
  ];

  // Filter tasks for active project
  const projectTasks = tasks.filter((t) => t.projectId === selectedProjectId);

  // Collect all unique tags
  const allTags = Array.from(new Set(projectTasks.flatMap((t) => t.tags)));

  const filteredTasks = projectTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || task.tags.includes(selectedTag);
    const matchesPriority =
      selectedPriority === 'all' || task.priority === selectedPriority;
    return matchesSearch && matchesTag && matchesPriority;
  });

  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'high':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'medium':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getAssignee = (assigneeId?: string) => {
    return members.find((m) => m.id === assigneeId);
  };

  const moveColumn = (current: TaskStatus, direction: 'prev' | 'next'): TaskStatus => {
    const order: TaskStatus[] = ['backlog', 'in_progress', 'review', 'done'];
    const idx = order.indexOf(current);
    if (direction === 'prev' && idx > 0) return order[idx - 1];
    if (direction === 'next' && idx < order.length - 1) return order[idx + 1];
    return current;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, CUDA, Kubernetes, PRs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-md px-2.5 py-1.5 focus:outline-none"
            aria-label="Filter by tag"
          >
            <option value="all">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-md px-2.5 py-1.5 focus:outline-none"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Quick action button */}
        <button
          onClick={() => onOpenCreateTask('backlog')}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const totalPoints = colTasks.reduce((acc, t) => acc + t.storyPoints, 0);

          return (
            <div
              key={col.id}
              className="bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col max-h-[calc(100vh-210px)]"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-slate-200 bg-white/60 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    {col.label}
                  </h3>
                  <span className="text-xs font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {colTasks.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono" title="Total Story Points">
                    {totalPoints} pts
                  </span>
                  <button
                    onClick={() => onOpenCreateTask(col.id)}
                    className="p-1 hover:bg-slate-200 text-slate-500 rounded transition-colors"
                    aria-label={`Add task to ${col.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Column Task Cards */}
              <div className="p-2 space-y-2.5 overflow-y-auto flex-1 min-h-[300px]">
                {colTasks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                    No tasks in {col.label.toLowerCase()}
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const assignee = getAssignee(task.assigneeId);
                    const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
                    const isTracking = activeTimerTaskId === task.id;

                    return (
                      <div
                        key={task.id}
                        className={`bg-white rounded-lg p-3.5 border transition-all shadow-xs hover:border-slate-400 cursor-pointer ${
                          isTracking
                            ? 'ring-2 ring-emerald-500 border-emerald-400'
                            : 'border-slate-200'
                        }`}
                        onClick={() => onOpenTaskDetail(task)}
                      >
                        {/* Priority & Story Points Header */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-medium border ${getPriorityStyle(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="font-mono text-slate-700 font-semibold">
                              {task.storyPoints} pts
                            </span>
                            {task.dependencies && task.dependencies.length > 0 && (
                              <span
                                className="text-amber-600 font-mono text-xs"
                                title={`Blocked by ${task.dependencies.length} prerequisite tasks`}
                              >
                                [Blocked: {task.dependencies.length}]
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Task Title */}
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug mb-1.5 hover:text-indigo-600 transition-colors">
                          {task.title}
                        </h4>

                        {/* Subtasks Progress if any */}
                        {task.subtasks.length > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                            <CheckCircle2 className="w-3 h-3 text-slate-400" />
                            <span>
                              {completedSubtasks}/{task.subtasks.length} subtasks
                            </span>
                          </div>
                        )}

                        {/* IDE Sync indicator if active */}
                        {task.ideSync && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100 mb-2">
                            <Terminal className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{task.ideSync.file}</span>
                          </div>
                        )}

                        {/* Custom Fields (GPU / IaC / Cloud) */}
                        {task.customFields.gpuRequirement && (
                          <div className="flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded mb-2">
                            <Cpu className="w-3 h-3" />
                            <span className="truncate">{task.customFields.gpuRequirement}</span>
                          </div>
                        )}

                        {/* Footer: Tags, Assignee & Column Mover */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                          {/* Assignee or Auto-assign button */}
                          <div className="flex items-center gap-1.5 min-w-0">
                            {assignee ? (
                              <div
                                className="w-6 h-6 rounded-full bg-slate-800 text-white font-medium text-xs flex items-center justify-center shrink-0"
                                title={`${assignee.name} (${assignee.role})`}
                              >
                                {assignee.avatar}
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAutoAssign(task.id);
                                }}
                                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded"
                                title="Auto-assign with rule matching"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Auto-Assign</span>
                              </button>
                            )}

                            {/* Timer button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleTimer(task);
                              }}
                              className={`p-1 rounded text-xs transition-colors ${
                                isTracking
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                              }`}
                              title={isTracking ? 'Stop tracking time' : 'Start IDE time tracker'}
                              aria-label={isTracking ? 'Stop tracking time' : 'Start IDE time tracker'}
                            >
                              <Clock className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Quick Move Arrows */}
                          <div
                            className="flex items-center gap-0.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {col.id !== 'backlog' && (
                              <button
                                onClick={() =>
                                  onUpdateTaskStatus(task.id, moveColumn(task.status, 'prev'))
                                }
                                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded"
                                title="Move to previous column"
                                aria-label="Move to previous column"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button
                                onClick={() =>
                                  onUpdateTaskStatus(task.id, moveColumn(task.status, 'next'))
                                }
                                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded"
                                title="Move to next column"
                                aria-label="Move to next column"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
