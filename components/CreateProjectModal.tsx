'use client';

import React, { useState } from 'react';
import { X, Sparkles, Layers } from 'lucide-react';
import { Project, ProjectCategory } from '@/types/devpulse';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (proj: Partial<Project>) => void;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onCreateProject,
}: CreateProjectModalProps) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('AI/ML');
  const [environment, setEnvironment] = useState<'production' | 'staging' | 'dev'>('staging');
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return;

    const tags = tagInput
      ? tagInput.split(',').map((t) => t.trim())
      : [category, 'Cloud'];

    onCreateProject({
      name: name.trim(),
      key: key.trim().toUpperCase(),
      description: description.trim(),
      category,
      environment,
      tags,
      status: 'active',
      health: 'healthy',
      leadId: 'user-1',
      progressPct: 0,
      subProjects: [
        { id: `sub-${Date.now()}-1`, name: 'Phase 1: Architecture & IaC baseline', taskCount: 2 },
        { id: `sub-${Date.now()}-2`, name: 'Phase 2: CI/CD & Automated Gates', taskCount: 1 },
      ],
      linkedProjectIds: [],
      repoUrl: `https://github.com/devpulse/${key.toLowerCase()}-service`,
      createdAt: new Date().toISOString().split('T')[0],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-semibold text-slate-900">
            Create DevOps or AI Initiative
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="font-medium text-slate-700 block mb-1">Project Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Vector DB Hybrid Search Pipeline"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!key) {
                    const initials = e.target.value
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 4);
                    setKey(initials);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Project Key</label>
              <input
                type="text"
                required
                placeholder="e.g., VDB"
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 font-mono uppercase focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Description & Scope</label>
            <textarea
              rows={3}
              placeholder="Explain technical objectives, SLA requirements, and deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Domain Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none"
              >
                <option value="AI/ML">AI / Machine Learning</option>
                <option value="Infrastructure">Infrastructure / IaC</option>
                <option value="CI/CD">CI/CD & Delivery</option>
                <option value="Security">Security & RBAC</option>
                <option value="Data Ops">Data Ops</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Primary Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none"
              >
                <option value="staging">Staging</option>
                <option value="dev">Development</option>
                <option value="production">Production</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">
              Categorization Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g., PyTorch, CUDA, Helm, Terraform"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
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
              Create Initiative
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
