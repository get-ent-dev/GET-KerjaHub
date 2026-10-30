'use client';

import React, { useState } from 'react';
import {
  GitPullRequest,
  GitBranch,
  Terminal,
  Zap,
  Globe,
  Plus,
  Play,
  CheckCircle2,
  Box,
  Code,
  Sparkles,
} from 'lucide-react';
import { AutomationRule } from '@/lib/devpulse-logic';
import { TeamMember } from '@/types/devpulse';

interface IntegrationsAndAutomationsProps {
  automationRules: AutomationRule[];
  members: TeamMember[];
  onAddRule: (rule: AutomationRule) => void;
  onTestRule: (rule: AutomationRule) => void;
}

export function IntegrationsAndAutomations({
  automationRules,
  members,
  onAddRule,
  onTestRule,
}: IntegrationsAndAutomationsProps) {
  const [activeTab, setActiveTab] = useState<'automation' | 'git' | 'registry' | 'ide'>('automation');
  const [newRuleKeyword, setNewRuleKeyword] = useState('');
  const [newRuleAssignee, setNewRuleAssignee] = useState(members[0]?.id || '');
  const [newRuleTag, setNewRuleTag] = useState('');
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleKeyword.trim()) return;
    const rule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: `Auto-Assign '${newRuleKeyword}'`,
      keyword: newRuleKeyword.trim(),
      assignToMemberId: newRuleAssignee,
      addTags: newRuleTag ? [newRuleTag.trim()] : [],
      setPriority: 'high',
    };
    onAddRule(rule);
    setNewRuleKeyword('');
    setNewRuleTag('');
  };

  const handleTestWebhook = () => {
    setWebhookStatus('Dispatching JSON payload to https://api.devpulse.io/v1/events...');
    setTimeout(() => {
      setWebhookStatus('Success: Received HTTP 200 OK (Event ID: evt_98c12a)');
    }, 800);
  };

  const sampleCommits = [
    { sha: '7f9c2d1', msg: 'feat(lora): integrate FlashAttention-2 kernel', author: 'Sofia Chen', time: '12m ago', branch: 'feat/flash-attn' },
    { sha: '2b48fe3', msg: 'fix(karpenter): adjust spot interruption grace period', author: 'Alex Rivera', time: '2h ago', branch: 'infra/karpenter' },
    { sha: '88df31a', msg: 'refactor(metrics): export vLLM P95 latency histogram', author: 'Sofia Chen', time: '5h ago', branch: 'feat/vllm-metrics' },
  ];

  const sampleContainers = [
    { repo: 'ghcr.io/devpulse/model-serving-core', tag: 'sha-7f9c2d1', size: '2.4 GB', cveCount: '0 Critical, 0 High', scan: 'Passed' },
    { repo: 'ghcr.io/devpulse/karpenter-nodepool-sync', tag: 'v1.2.0', size: '142 MB', cveCount: '0 Critical', scan: 'Passed' },
    { repo: 'ghcr.io/devpulse/trivy-scanner-gate', tag: 'latest', size: '84 MB', cveCount: '0 Critical', scan: 'Passed' },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Integrations, Developer Tooling & Automation Rules
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>Keyword Automation Engine</span>
            <span aria-hidden="true">·</span>
            <span>Git & Pull Requests</span>
            <span aria-hidden="true">·</span>
            <span>Container Registry & CVEs</span>
            <span aria-hidden="true">·</span>
            <span>VS Code IDE Extension Bridge</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('automation')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'automation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Automation Engine
          </button>
          <button
            onClick={() => setActiveTab('git')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'git' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Git & PRs
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'registry' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Containers
          </button>
          <button
            onClick={() => setActiveTab('ide')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'ide' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            IDE Extension
          </button>
        </div>
      </div>

      {/* Tab 1: Automation Engine */}
      {activeTab === 'automation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rules List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Active Task Automation Rules
              </h3>
              <p className="text-xs text-slate-500">
                When a task title or description matches a keyword, DevPulse automatically routes it to the designated developer and attaches categorized tags.
              </p>

              <div className="space-y-2 pt-2">
                {automationRules.map((rule) => {
                  const targetMember = members.find((m) => m.id === rule.assignToMemberId);
                  return (
                    <div
                      key={rule.id}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-semibold text-slate-900">{rule.name}</span>
                          <span className="font-mono text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">
                            keyword: &quot;{rule.keyword}&quot;
                          </span>
                        </div>
                        <div className="text-slate-600">
                          Assigns to: <span className="font-medium text-slate-900">{targetMember?.name || 'Unassigned'}</span> ({targetMember?.role})
                          {rule.addTags.length > 0 && (
                            <span className="text-slate-500"> · Tags: {rule.addTags.join(', ')}</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onTestRule(rule)}
                        className="self-start sm:self-auto text-xs px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded font-medium transition-colors"
                      >
                        Simulate Rule
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Webhook Dispatch Simulator */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Outbound Webhook Tester
                  </h3>
                  <p className="text-xs text-slate-500">
                    Send test events to your CI server, Slack, or custom automation endpoint.
                  </p>
                </div>
                <button
                  onClick={handleTestWebhook}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
                >
                  Send Test Payload
                </button>
              </div>

              {webhookStatus && (
                <div className="p-3 bg-slate-900 rounded-lg font-mono text-xs text-emerald-400">
                  {webhookStatus}
                </div>
              )}
            </div>
          </div>

          {/* Create Rule Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Create Automation Rule</h3>
            <form onSubmit={handleAddRule} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Trigger Keyword</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., helm, triton, deepseek"
                  value={newRuleKeyword}
                  onChange={(e) => setNewRuleKeyword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Auto-Assign To</label>
                <select
                  value={newRuleAssignee}
                  onChange={(e) => setNewRuleAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Auto-Add Tag</label>
                <input
                  type="text"
                  placeholder="e.g., Kubernetes, MLOps, Critical"
                  value={newRuleTag}
                  onChange={(e) => setNewRuleTag(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium transition-colors shadow-xs"
              >
                Save Automation Rule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Git Integration */}
      {activeTab === 'git' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Connected Repositories & Recent Commits
              </h3>
              <p className="text-xs text-slate-500">
                Automatically links commits, PR reviews, and tags to project tasks.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              GitHub App Synced
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {sampleCommits.map((c) => (
              <div key={c.sha} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-800">[{c.sha}]</span>
                    <span className="font-medium text-slate-900">{c.msg}</span>
                  </div>
                  <div className="text-slate-500">
                    By {c.author} · Branch: <span className="font-mono text-slate-700">{c.branch}</span> · {c.time}
                  </div>
                </div>
                <span className="font-mono text-slate-400">Verified GPG</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Container Registry */}
      {activeTab === 'registry' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Container Registry & Trivy Vulnerability Scans
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-medium">Image Repository</th>
                  <th className="py-2.5 px-3 font-medium">Tag</th>
                  <th className="py-2.5 px-3 font-medium">Image Size</th>
                  <th className="py-2.5 px-3 font-medium">CVE Security Scan</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {sampleContainers.map((img, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-medium text-slate-900">{img.repo}</td>
                    <td className="py-2.5 px-3">{img.tag}</td>
                    <td className="py-2.5 px-3">{img.size}</td>
                    <td className="py-2.5 px-3 text-emerald-700">{img.cveCount}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-sans">
                        {img.scan}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: IDE Extension */}
      {activeTab === 'ide' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 max-w-2xl">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-semibold text-slate-900">
              VS Code / Cursor IDE Extension Bridge
            </h3>
            <p className="text-xs text-slate-500">
              Syncs active cursor position, tracks time automatically on save, and enables 1-click task creation.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-200 space-y-2">
            <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span>Bridge Connection: localhost:4829</span>
              <span className="text-emerald-400">● Connected</span>
            </div>
            <div>Current Workspace: /home/dev/projects/model-serving-core</div>
            <div>Active File: src/training/train_lora.py (Line: 142)</div>
            <div>Current Git Branch: feat/flash-attn-opt</div>
            <div>Auto-tracked Time: 3h 05m logged to Task #101</div>
          </div>
        </div>
      )}
    </div>
  );
}
