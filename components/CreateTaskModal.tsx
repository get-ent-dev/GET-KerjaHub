'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, TeamMember, Project } from '@/types/devpulse';
import { AutomationRule, applyAutomationRules } from '@/lib/devpulse-logic';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  selectedProjectId: string;
  members: TeamMember[];
  automationRules: AutomationRule[];
  defaultStatus?: TaskStatus;
  onCreateTask: (task: Partial<Task>) => void;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  projects,
  selectedProjectId,
  members,
  automationRules,
  defaultStatus = 'backlog',
  onCreateTask,
}: CreateTaskModalProps) {
  if (!isOpen) return null;

  const [projectId, setProjectId] = useState(selectedProjectId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [storyPoints, setStoryPoints] = useState(3);
  const [assigneeId, setAssigneeId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['AI/ML']);
  const [gpuReq, setGpuReq] = useState('');
  const [targetAcc, setTargetAcc] = useState('');
  const [cloudProv, setCloudProv] = useState('');

  // Auto-rule detection preview
  const ruleSuggestion = applyAutomationRules(
    { title, description, tags, priority, assigneeId },
    automationRules
  );

  const applyRuleSuggestion = () => {
    if (ruleSuggestion.assigneeId) setAssigneeId(ruleSuggestion.assigneeId);
    if (ruleSuggestion.tags) setTags(ruleSuggestion.tags);
    if (ruleSuggestion.priority) setPriority(ruleSuggestion.priority);
  };

  const templates = [
    {
      name: 'New Model Training',
      title: 'Run LoRA fine-tuning on domain dataset and validate perplexity',
      desc: 'Set up PyTorch training run with FlashAttention-2, gradient accumulation, and automated wandb/MLflow metrics logging.',
      tags: ['AI/ML', 'CUDA', 'PyTorch'],
      points: 5,
      priority: 'high' as const,
      gpu: 'NVIDIA H100 (80GB)',
    },
    {
      name: 'Infrastructure Spot Pool',
      title: 'Provision Karpenter spot node pool with termination warning queue',
      desc: 'Deploy Terraform modules for Karpenter NodePool CRD to utilize spot instances with automated SQS event draining.',
      tags: ['Infrastructure', 'Terraform', 'Kubernetes'],
      points: 5,
      priority: 'critical' as const,
      cloud: 'AWS EKS',
    },
    {
      name: 'Incident Postmortem',
      title: 'Draft postmortem for worker node GPU thermal throttling',
      desc: 'Document root cause, time-to-detection, node drain timeline, and preventive fan duct monitoring alert in Alertmanager.',
      tags: ['DevOps', 'Incident', 'Postmortem'],
      points: 3,
      priority: 'medium' as const,
    },
  ];

  const handleApplyTemplate = (tpl: typeof templates[0]) => {
    setTitle(tpl.title);
    setDescription(tpl.desc);
    setTags(tpl.tags);
    setStoryPoints(tpl.points);
    setPriority(tpl.priority);
    if (tpl.gpu) setGpuReq(tpl.gpu);
    if (tpl.cloud) setCloudProv(tpl.cloud);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      projectId,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      storyPoints,
      assigneeId: assigneeId || undefined,
      tags,
      timeSpentMinutes: 0,
      dependencies: [],
      subtasks: [
        { id: `st-1`, title: 'Define interface and technical dependencies', completed: false },
        { id: `st-2`, title: 'Implement and verify locally in Docker/Minikube', completed: false },
        { id: `st-3`, title: 'Open PR and link CI/CD build run', completed: false },
      ],
      customFields: {
        gpuRequirement: gpuReq || undefined,
        targetAccuracy: targetAcc || undefined,
        cloudProvider: cloudProv || undefined,
      },
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Create New DevOps or AI Task</h3>
            <p className="text-xs text-slate-500">
              Fill details, select recurring templates, or let automation rules suggest assignees.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Quick Templates Bar */}
          <div>
            <span className="text-slate-500 font-medium block mb-1">
              Use Task Template for Recurring Workflows:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {templates.map((tpl) => (
                <button
                  key={tpl.name}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors"
                >
                  + {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Project & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="font-medium text-slate-700 block mb-1">Target Initiative</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.key}] {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="font-medium text-slate-700 block mb-1">Task Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Benchmark vLLM serving latency with FP8 quantization"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>

          {/* Rule Match Banner if triggered */}
          {(ruleSuggestion.assigneeId !== assigneeId || ruleSuggestion.tags.length > tags.length) && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  Automation Rule matched! Auto-assign to{' '}
                  <span className="font-semibold">
                    {members.find((m) => m.id === ruleSuggestion.assigneeId)?.name}
                  </span>{' '}
                  and add tags?
                </span>
              </div>
              <button
                type="button"
                onClick={applyRuleSuggestion}
                className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 rounded font-medium transition-colors"
              >
                Apply Rule
              </button>
            </div>
          )}

          <div>
            <label className="font-medium text-slate-700 block mb-1">Technical Description</label>
            <textarea
              rows={3}
              placeholder="Describe requirements, acceptance criteria, or error logs..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* Status, Priority, Points, Assignee */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900 capitalize"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900 capitalize"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Story Points</label>
              <input
                type="number"
                min={1}
                max={21}
                value={storyPoints}
                onChange={(e) => setStoryPoints(Number(e.target.value))}
                className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-3">
            <div>
              <label className="text-slate-600 block mb-1">GPU Requirement</label>
              <input
                type="text"
                placeholder="e.g., NVIDIA H100"
                value={gpuReq}
                onChange={(e) => setGpuReq(e.target.value)}
                className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Target Accuracy / SLA</label>
              <input
                type="text"
                placeholder="e.g., Perplexity < 3.0"
                value={targetAcc}
                onChange={(e) => setTargetAcc(e.target.value)}
                className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Cloud / Infra Provider</label>
              <input
                type="text"
                placeholder="e.g., AWS / EKS"
                value={cloudProv}
                onChange={(e) => setCloudProv(e.target.value)}
                className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium shadow-xs transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
