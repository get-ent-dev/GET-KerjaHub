'use client';

import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  Send,
  MessageSquare,
  CheckSquare,
  Sparkles,
  Award,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { TeamMember, Runbook } from '@/types/devpulse';

interface CollaborationViewProps {
  members: TeamMember[];
  runbooks: Runbook[];
  onOpenRunbookModal?: (runbook: Runbook) => void;
}

export function CollaborationView({ members, runbooks }: CollaborationViewProps) {
  const [activeTab, setActiveTab] = useState<'team' | 'runbooks' | 'onboarding' | 'chat'>('team');
  const [selectedRunbook, setSelectedRunbook] = useState<Runbook>(runbooks[0]);
  const [slackMessage, setSlackMessage] = useState('');
  const [slackHistory, setSlackHistory] = useState<{ user: string; text: string; time: string }[]>([
    {
      user: 'Sofia Chen',
      text: 'Pushed commit 7f9c2d1 with FlashAttention-2. Staging test passed without OOM!',
      time: '10:35 AM',
    },
    {
      user: 'Alex Rivera',
      text: 'Karpenter spot pool applied on staging. Drained node 4 with zero dropped packets.',
      time: '10:40 AM',
    },
    {
      user: 'Marcus Vance',
      text: 'Great work! Remember to check Terraform refresh status before opening the PR.',
      time: '10:42 AM',
    },
  ]);

  const [onboardingTasks, setOnboardingTasks] = useState([
    { id: 'ob-1', text: 'Install AWS CLI v2, kubectl, and kubectx locally', done: true },
    { id: 'ob-2', text: 'Configure SSH key and GPG commit signing with GitHub', done: true },
    { id: 'ob-3', text: 'Clone model-serving-core repo and build local Docker container', done: true },
    { id: 'ob-4', text: 'Run local PyTorch test suite with MPS or CUDA device verification', done: false },
    { id: 'ob-5', text: 'Review Runbook #1: Debugging CUDA Out of Memory (OOM)', done: false },
    { id: 'ob-6', text: 'Pair program on first Terraform Karpenter spot node PR', done: false },
  ]);

  const handleSendSlack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slackMessage.trim()) return;
    setSlackHistory([
      ...slackHistory,
      {
        user: 'You (Junior Dev)',
        text: slackMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setSlackMessage('');
  };

  const toggleOnboarding = (id: string) => {
    setOnboardingTasks(
      onboardingTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Team, Workload & Knowledge Sharing
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>Skill Matching Matrix</span>
            <span aria-hidden="true">·</span>
            <span>Workload & Burnout Balance</span>
            <span aria-hidden="true">·</span>
            <span>Internal Engineering Runbooks</span>
            <span aria-hidden="true">·</span>
            <span>Junior Onboarding Flow</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'team' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Team & Workload
          </button>
          <button
            onClick={() => setActiveTab('runbooks')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'runbooks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Knowledge Runbooks
          </button>
          <button
            onClick={() => setActiveTab('onboarding')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'onboarding' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Junior Onboarding
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'chat' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Slack / Teams Sync
          </button>
        </div>
      </div>

      {/* Tab 1: Team & Workload Balancing */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => {
              const workloadPct = Math.round((member.activePoints / member.maxCapacityPoints) * 100);
              const isOverloaded = workloadPct > 90;

              return (
                <div
                  key={member.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center">
                          {member.avatar}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                            {member.name}
                          </h4>
                          <span className="text-xs text-slate-500">{member.role}</span>
                        </div>
                      </div>

                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${
                          member.activeStatus === 'working'
                            ? 'bg-emerald-50 text-emerald-700'
                            : member.activeStatus === 'in_review'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {member.activeStatus.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Workload Capacity Bar */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Sprint Capacity</span>
                        <span
                          className={`font-mono font-medium ${
                            isOverloaded ? 'text-rose-600 font-bold' : 'text-slate-700'
                          }`}
                        >
                          {member.activePoints} / {member.maxCapacityPoints} pts ({workloadPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isOverloaded
                              ? 'bg-rose-500'
                              : workloadPct > 70
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, workloadPct)}%` }}
                        />
                      </div>
                      {isOverloaded && (
                        <span className="text-xs text-rose-600 flex items-center gap-1 font-medium pt-0.5">
                          <AlertCircle className="w-3 h-3" /> Near burnout threshold
                        </span>
                      )}
                    </div>

                    {/* Skill Inventory */}
                    <div>
                      <span className="text-xs font-medium text-slate-500 block mb-1.5">
                        Technical Skill Inventory:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-4 flex justify-between text-xs text-slate-400">
                    <span>{member.email}</span>
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Assign Task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Knowledge Runbooks */}
      {activeTab === 'runbooks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Runbook Index List */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Engineering Runbooks & Playbooks
            </h3>
            {runbooks.map((rb) => (
              <div
                key={rb.id}
                onClick={() => setSelectedRunbook(rb)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedRunbook.id === rb.id
                    ? 'bg-white border-slate-900 shadow-xs ring-1 ring-slate-900'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>{rb.category}</span>
                  <span>{rb.readTimeMin} min read</span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                  {rb.title}
                </h4>
                <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                  <span>By: {rb.author}</span>
                  <span>Updated {rb.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Runbook Reader */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {selectedRunbook.category} · {selectedRunbook.readTimeMin} min read
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedRunbook.title}</h3>
              <div className="text-xs text-slate-500 mt-1">
                Written by {selectedRunbook.author} · Last updated {selectedRunbook.lastUpdated}
              </div>
            </div>

            <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {selectedRunbook.content}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Junior Onboarding */}
      {activeTab === 'onboarding' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 max-w-2xl">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Junior DevOps & AI Developer Onboarding Program
            </h3>
            <p className="text-xs text-slate-500">
              Complete these essential setup steps to ramp up on cluster access, model repos, and CI/CD gates.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {onboardingTasks.map((t) => (
              <label
                key={t.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                  t.done ? 'bg-slate-50 border-slate-200 text-slate-500 line-through' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleOnboarding(t.id)}
                  className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                <span className="text-xs sm:text-sm">{t.text}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Slack / Microsoft Teams Sync */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 max-w-2xl">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Slack #devops-mlops-alerts Bridge
              </h3>
              <p className="text-xs text-slate-500">
                Synced channel notifications for commit deployments, PR reviews, and GPU alerts.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Webhook Connected
            </span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto p-1">
            {slackHistory.map((msg, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{msg.user}</span>
                  <span className="text-slate-400">{msg.time}</span>
                </div>
                <p className="text-slate-700">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendSlack} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Post update to Slack #devops-mlops-alerts..."
              value={slackMessage}
              onChange={(e) => setSlackMessage(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
