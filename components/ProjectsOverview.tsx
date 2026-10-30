'use client';

import React, { useState } from 'react';
import {
  Layers,
  GitBranch,
  ArrowRight,
  Plus,
  Link as LinkIcon,
  FolderGit2,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Project, ProjectCategory } from '@/types/devpulse';

interface ProjectsOverviewProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onOpenCreateProject: () => void;
  onOpenTemplate: (templateName: string) => void;
}

export function ProjectsOverview({
  projects,
  selectedProjectId,
  onSelectProject,
  onOpenCreateProject,
  onOpenTemplate,
}: ProjectsOverviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'hierarchy'>('grid');

  const categories: ('all' | ProjectCategory)[] = [
    'all',
    'AI/ML',
    'Infrastructure',
    'CI/CD',
    'Security',
  ];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const templates = [
    {
      name: 'Fine-Tuning LLM & vLLM Serving',
      category: 'AI/ML',
      desc: 'LoRA fine-tuning loop, evaluation harnesses (GSM8k, HumanEval), and vLLM multi-GPU inference Helm chart.',
      tags: ['PyTorch', 'CUDA', 'LoRA', 'vLLM'],
    },
    {
      name: 'EKS Karpenter GPU Cluster GitOps',
      category: 'Infrastructure',
      desc: 'Terraform modules for AWS EKS, Karpenter spot node provisioner, and ArgoCD cluster manifest sync.',
      tags: ['Terraform', 'Kubernetes', 'Karpenter', 'AWS'],
    },
    {
      name: 'Microservices Zero-Trust CI/CD',
      category: 'CI/CD',
      desc: 'GitHub Actions workflow with Docker multi-stage builds, Trivy CVE blocker, and canary rollout stages.',
      tags: ['GitHub Actions', 'Docker', 'Trivy', 'Canary'],
    },
    {
      name: 'SOC 2 & ISO 27001 Security Hardening',
      category: 'Security',
      desc: 'Granular Kubernetes RBAC, IAM secret rotation, runtime Falco anomaly alerts, and automated audit trails.',
      tags: ['Security', 'IAM', 'Falco', 'Audit'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls: Filter & Templates */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Projects & Initiatives
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>{projects.length} Active Initiatives</span>
            <span aria-hidden="true">·</span>
            <span>Hierarchical Sub-Projects</span>
            <span aria-hidden="true">·</span>
            <span>Cross-Project Dependency Linking</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap capitalize ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'All Initiatives' : cat}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('hierarchy')}
              className={`px-2.5 py-1.5 rounded-md transition-colors ${
                viewMode === 'hierarchy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Hierarchy
            </button>
          </div>
        </div>
      </div>

      {/* Main View: Grid vs Hierarchy */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            const linkedProjects = projects.filter((p) =>
              proj.linkedProjectIds.includes(p.id)
            );

            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-slate-900 ring-1 ring-slate-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-mono font-medium text-slate-700">[{proj.key}]</span>
                      <span aria-hidden="true">·</span>
                      <span>{proj.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{proj.environment}</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                      {proj.name}
                    </h3>
                  </div>

                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      proj.health === 'healthy'
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-amber-700 bg-amber-50'
                    }`}
                  >
                    {proj.health}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {proj.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Initiative Progress</span>
                    <span className="font-medium text-slate-700">{proj.progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-900 h-full rounded-full transition-all duration-300"
                      style={{ width: `${proj.progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Sub-projects breakdown if any */}
                {proj.subProjects && proj.subProjects.length > 0 && (
                  <div className="border-t border-slate-100 pt-3 mb-3">
                    <span className="text-xs font-medium text-slate-500 block mb-1.5">
                      Sub-Projects ({proj.subProjects.length}):
                    </span>
                    <div className="space-y-1">
                      {proj.subProjects.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between text-xs text-slate-700 py-0.5"
                        >
                          <span className="truncate pr-2">↳ {sub.name}</span>
                          <span className="text-slate-400 shrink-0 font-mono">
                            {sub.taskCount} tasks
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Linked Initiatives / Dependencies */}
                {linkedProjects.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <LinkIcon className="w-3 h-3 text-slate-400" />
                    <span>Linked to:</span>
                    {linkedProjects.map((lp) => (
                      <span key={lp.id} className="font-mono text-slate-700 font-medium">
                        [{lp.key}]
                      </span>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-3 pt-2">
                  {proj.tags.map((t, idx) => (
                    <React.Fragment key={t}>
                      <span>{t}</span>
                      {idx < proj.tags.length - 1 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Hierarchical & Initiative Dependency Graph View */
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Initiative Dependency Hierarchy
            </h3>
            <p className="text-xs text-slate-500">
              Visualizes parent-child sub-projects and initiative dependencies across DevOps and AI streams.
            </p>
          </div>

          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-200 rounded text-slate-800">
                      {proj.key}
                    </span>
                    <span className="font-medium text-sm text-slate-900">{proj.name}</span>
                    <span className="text-xs text-slate-400">· {proj.category}</span>
                  </div>
                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                  >
                    Open Workspace <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {proj.subProjects && proj.subProjects.length > 0 && (
                  <div className="mt-3 pl-6 border-l-2 border-slate-200 space-y-2">
                    {proj.subProjects.map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-white p-2.5 rounded border border-slate-200 text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-800">{sub.name}</span>
                        </div>
                        <span className="text-slate-500 font-mono">{sub.taskCount} active tasks</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates Section for DevOps & AI workflows */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              DevOps & AI Project Templates
            </h3>
            <p className="text-xs text-slate-500">
              Pre-configured templates with workflow stages, task breakdown, and automated triggers.
            </p>
          </div>
          <button
            onClick={onOpenCreateProject}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Custom Project
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((tpl) => (
            <div
              key={tpl.name}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    {tpl.category}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <h4 className="text-xs font-semibold text-slate-900 mb-1 leading-snug">
                  {tpl.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-3">
                  {tpl.desc}
                </p>
              </div>

              <button
                onClick={() => onOpenTemplate(tpl.name)}
                className="w-full text-xs py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded border border-slate-200 transition-colors flex items-center justify-center gap-1"
              >
                Use Template <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
