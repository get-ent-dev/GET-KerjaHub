'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  ShieldAlert,
  DollarSign,
  Clock,
  Layers,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { calculateDoraMetrics } from '@/lib/devpulse-logic';

export function AnalyticsReporting() {
  const [activeTab, setActiveTab] = useState<'dora' | 'sprint' | 'budget' | 'risks'>('dora');

  // Sample deployment logs for DORA calculation
  const sampleDeployments = [
    { id: '1', timestamp: Date.now() - 86400000 * 2, status: 'success' as const, leadTimeMinutes: 24 },
    { id: '2', timestamp: Date.now() - 86400000 * 4, status: 'success' as const, leadTimeMinutes: 32 },
    { id: '3', timestamp: Date.now() - 86400000 * 6, status: 'success' as const, leadTimeMinutes: 18 },
    { id: '4', timestamp: Date.now() - 86400000 * 8, status: 'failed' as const, leadTimeMinutes: 45, recoveryTimeMinutes: 18 },
    { id: '5', timestamp: Date.now() - 86400000 * 10, status: 'success' as const, leadTimeMinutes: 28 },
    { id: '6', timestamp: Date.now() - 86400000 * 12, status: 'success' as const, leadTimeMinutes: 30 },
  ];

  const dora = calculateDoraMetrics(sampleDeployments, 14);

  const sprintBurndown = [
    { day: 'Day 1', ideal: 45, actual: 45 },
    { day: 'Day 3', ideal: 36, actual: 38 },
    { day: 'Day 5', ideal: 27, actual: 26 },
    { day: 'Day 7', ideal: 18, actual: 16 },
    { day: 'Day 9', ideal: 9, actual: 8 },
    { day: 'Day 10', ideal: 0, actual: 2 },
  ];

  const risks = [
    {
      title: 'AWS Spot GPU Node Preemption during Multi-Epoch Training',
      severity: 'Medium',
      impact: 'High',
      mitigation: 'Enabled Karpenter interruption warning handler and S3 checkpointing every 500 steps.',
      owner: 'Alex Rivera',
    },
    {
      title: 'FlashAttention-2 CUDA Driver Incompatibility on Older Worker Nodes',
      severity: 'Low',
      impact: 'Medium',
      mitigation: 'Pinned NVIDIA container toolkit runtime to 12.4 in DaemonSet Helm chart.',
      owner: 'Sofia Chen',
    },
    {
      title: 'Kubernetes Ingress Certificate Expiry on Staging API Gateway',
      severity: 'Low',
      impact: 'Low',
      mitigation: 'Configured cert-manager Let’s Encrypt auto-renewal with 30-day lookahead alerts.',
      owner: 'Marcus Vance',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            DevOps & Project Analytics (DORA & Sprint Velocity)
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>DORA 4 Core Metrics</span>
            <span aria-hidden="true">·</span>
            <span>Sprint Burndown & Velocity</span>
            <span aria-hidden="true">·</span>
            <span>Cloud & GPU Budget Forecasting</span>
            <span aria-hidden="true">·</span>
            <span>Risk Assessment Matrix</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('dora')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'dora' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            DORA Metrics
          </button>
          <button
            onClick={() => setActiveTab('sprint')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'sprint' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Sprint Velocity
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'budget' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Budget & Forecast
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'risks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Risk Matrix
          </button>
        </div>
      </div>

      {/* Tab 1: DORA 4 Metrics */}
      {activeTab === 'dora' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs text-slate-500 block">Deployment Frequency</span>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {dora.deploymentFrequencyPerWeek} / wk
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Elite Performance Tier
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs text-slate-500 block">Lead Time for Changes</span>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {dora.medianLeadTimeMinutes} mins
              </div>
              <div className="text-xs text-emerald-700 font-medium">
                Commit to Staging &lt; 1 hour
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs text-slate-500 block">Change Failure Rate</span>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {dora.changeFailureRatePercentage}%
              </div>
              <div className="text-xs text-emerald-700 font-medium">
                Below 5% threshold
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs text-slate-500 block">Mean Time to Recovery (MTTR)</span>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {dora.meanTimeToRecoveryMinutes} mins
              </div>
              <div className="text-xs text-emerald-700 font-medium">
                Instant 1-Click Rollback enabled
              </div>
            </div>
          </div>

          {/* DORA explanation for Junior DevOps */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-700 space-y-2">
            <h4 className="font-semibold text-slate-900 text-sm">
              Junior DevOps Guide: How DORA Metrics Drive Quality
            </h4>
            <p className="leading-relaxed">
              These four metrics (from DevOps Research and Assessment) measure software delivery throughput and stability.
              Our pipeline gates ensure rapid cycle times (median 28 min) while keeping failure rates under 5% through automated Trivy scans and canary validation.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Sprint Burndown & Velocity */}
      {activeTab === 'sprint' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Sprint 14 Burndown Progress</h3>
              <p className="text-xs text-slate-500">45 Total Story Points · Target Sprint Completion in 2 days</p>
            </div>
            <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Velocity: 42 pts/sprint avg
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
            {sprintBurndown.map((point) => (
              <div key={point.day} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-center space-y-1">
                <span className="font-medium text-slate-600 block">{point.day}</span>
                <div className="font-mono text-base font-bold text-slate-900">{point.actual} pts</div>
                <div className="text-slate-400 font-mono text-xs">Ideal: {point.ideal}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Cloud & GPU Budget */}
      {activeTab === 'budget' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs text-slate-500 block">Monthly Cloud Budget</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">$6,000.00</div>
            <span className="text-xs text-slate-400">AWS + GCP Cloud Credits</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs text-slate-500 block">Month-to-Date Consumed</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">$3,840.50</div>
            <span className="text-xs text-emerald-600 font-medium">64% of allocated budget</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs text-slate-500 block">Projected Spot Savings</span>
            <div className="text-2xl font-bold text-emerald-700 font-mono">$4,210.00</div>
            <span className="text-xs text-slate-500">Achieved via Karpenter spot nodes</span>
          </div>
        </div>
      )}

      {/* Tab 4: Risk Matrix */}
      {activeTab === 'risks' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Project Risk Assessment & Mitigation Strategies
          </h3>

          <div className="divide-y divide-slate-100">
            {risks.map((risk, i) => (
              <div key={i} className="py-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                    {risk.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium">
                      Severity: {risk.severity}
                    </span>
                    <span className="text-slate-400">Owner: {risk.owner}</span>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <span className="font-medium text-slate-800">Mitigation: </span>
                  {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
