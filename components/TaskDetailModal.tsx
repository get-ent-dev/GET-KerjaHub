'use client';

import React, { useState } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Cpu,
  Plus,
  Terminal,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, TeamMember } from '@/types/devpulse';
import { calculateSkillMatchScore } from '@/lib/devpulse-logic';

interface TaskDetailModalProps {
  task: Task | null;
  allTasks: Task[];
  members: TeamMember[];
  onClose: () => void;
  onUpdateTask: (updated: Task) => void;
  onDeleteTask: (taskId: string) => void;
  activeTimerTaskId?: string;
  onToggleTimer: (task: Task) => void;
}

export function TaskDetailModal({
  task,
  allTasks,
  members,
  onClose,
  onUpdateTask,
  onDeleteTask,
  activeTimerTaskId,
  onToggleTimer,
}: TaskDetailModalProps) {
  if (!task) return null;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [storyPoints, setStoryPoints] = useState(task.storyPoints);
  const [assigneeId, setAssigneeId] = useState(task.assigneeId || '');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [gpuReq, setGpuReq] = useState(task.customFields.gpuRequirement || '');
  const [targetAcc, setTargetAcc] = useState(task.customFields.targetAccuracy || '');
  const [cloudProv, setCloudProv] = useState(task.customFields.cloudProvider || '');

  const isTimerActive = activeTimerTaskId === task.id;

  const availablePrerequisites = allTasks.filter(
    (t) => t.id !== task.id && t.projectId === task.projectId
  );

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    const updated = { ...task, subtasks: updatedSubtasks };
    onUpdateTask(updated);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSubtask = {
      id: `st-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    const updated = { ...task, subtasks: [...task.subtasks, newSubtask] };
    onUpdateTask(updated);
    setNewSubtaskTitle('');
  };

  const handleSave = () => {
    const updated: Task = {
      ...task,
      title,
      description,
      status,
      priority,
      storyPoints,
      assigneeId: assigneeId || undefined,
      customFields: {
        ...task.customFields,
        gpuRequirement: gpuReq || undefined,
        targetAccuracy: targetAcc || undefined,
        cloudProvider: cloudProv || undefined,
      },
    };
    onUpdateTask(updated);
    onClose();
  };

  const selectedMember = members.find((m) => m.id === assigneeId);
  const skillMatch = selectedMember
    ? calculateSkillMatchScore(task.tags, selectedMember.skills)
    : 0;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
              {task.id}
            </span>
            <span className="text-xs text-slate-500">Created {task.createdAt}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleTimer(task)}
              className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-colors ${
                isTimerActive
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isTimerActive ? 'Stop Timer' : 'Track Time (IDE)'}</span>
            </button>

            <button
              onClick={() => {
                onDeleteTask(task.id);
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Title & Description */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 block">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">Technical Specification</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans leading-relaxed"
            />
          </div>

          {/* Quick status, priority, story points row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <label className="text-slate-500 font-medium block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full p-1.5 bg-white border border-slate-200 rounded text-slate-900"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 font-medium block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full p-1.5 bg-white border border-slate-200 rounded text-slate-900 capitalize"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 font-medium block mb-1">Story Points</label>
              <input
                type="number"
                min={1}
                max={21}
                value={storyPoints}
                onChange={(e) => setStoryPoints(Number(e.target.value))}
                className="w-full p-1.5 bg-white border border-slate-200 rounded text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Assignee & Skill Match Indicator */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">Assignee & Skill Match</label>
            <div className="flex items-center gap-3">
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role}) — {m.activePoints}/{m.maxCapacityPoints} pts
                  </option>
                ))}
              </select>

              {selectedMember && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-md text-indigo-700 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-semibold">{skillMatch}% Skill Match</span>
                </div>
              )}
            </div>
          </div>

          {/* Subtasks Checklist */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Subtask Breakdown Checklist</label>
              <span className="text-slate-400 font-mono">
                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} Done
              </span>
            </div>

            <div className="space-y-1.5">
              {task.subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => handleToggleSubtask(st.id)}
                  className={`flex items-center gap-2.5 p-2 rounded border cursor-pointer transition-colors ${
                    st.completed
                      ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => {}}
                    className="rounded border-slate-300 text-slate-900 pointer-events-none"
                  />
                  <span>{st.title}</span>
                </div>
              ))}
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add subtask item..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
              >
                + Add
              </button>
            </form>
          </div>

          {/* Custom Fields (DevOps & AI Requirements) */}
          <div className="border-t border-slate-100 pt-3 space-y-3">
            <label className="font-semibold text-slate-700 block">
              DevOps & AI Development Custom Fields
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-500 text-xs block mb-1">GPU Requirement</label>
                <input
                  type="text"
                  placeholder="e.g., NVIDIA H100 80GB"
                  value={gpuReq}
                  onChange={(e) => setGpuReq(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-500 text-xs block mb-1">Target Metric / Acc</label>
                <input
                  type="text"
                  placeholder="e.g., P95 < 50ms, Acc > 85%"
                  value={targetAcc}
                  onChange={(e) => setTargetAcc(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-500 text-xs block mb-1">Cloud / Infra Provider</label>
                <input
                  type="text"
                  placeholder="e.g., AWS us-east-1 / EKS"
                  value={cloudProv}
                  onChange={(e) => setCloudProv(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Total Time Logged: <span className="font-mono font-medium text-slate-800">{task.timeSpentMinutes} mins</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 rounded font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium shadow-xs transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
