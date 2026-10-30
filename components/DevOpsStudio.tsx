'use client';

import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Terminal,
  Server,
  Shield,
  Activity,
  Layers,
  FileCode2,
  RefreshCw,
  Search,
  ExternalLink,
  Tag,
  Check,
} from 'lucide-react';
import {
  DeploymentPipeline,
  IaCResource,
  MetricAlert,
  Incident,
} from '@/types/devpulse';

interface DevOpsStudioProps {
  pipelines: DeploymentPipeline[];
  iacResources: IaCResource[];
  alerts: MetricAlert[];
  incident: Incident;
  activeEnv: 'production' | 'staging' | 'dev';
  onRunPipeline: () => void;
  onRollback: (pipelineId: string) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
  onTriggerDriftCheck: (resourceId: string) => void;
}

export function DevOpsStudio({
  pipelines,
  iacResources,
  alerts,
  incident,
  activeEnv,
  onRunPipeline,
  onRollback,
  onAcknowledgeAlert,
  onResolveAlert,
  onTriggerDriftCheck,
}: DevOpsStudioProps) {
  const [activeTab, setActiveTab] = useState<'cicd' | 'iac' | 'monitoring' | 'environments'>('cicd');
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(pipelines[0]?.id || '');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [isDriftChecking, setIsDriftChecking] = useState<string | null>(null);

  const selectedPipeline =
    pipelines.find((p) => p.id === selectedPipelineId) || pipelines[0];

  const handleDrift = (id: string) => {
    setIsDriftChecking(id);
    setTimeout(() => {
      onTriggerDriftCheck(id);
      setIsDriftChecking(null);
    }, 1000);
  };

  const sampleKubernetesLogs = [
    { time: '10:41:02', level: 'INFO', msg: 'Started HTTP server on :8000 (vLLM engine v0.6.3)' },
    { time: '10:41:15', level: 'INFO', msg: 'CUDA device count: 4, compute capability: 9.0 (H100)' },
    { time: '10:41:22', level: 'WARN', msg: 'PagedAttention memory pool warning: kv_cache fragmentation at 14%' },
    { time: '10:42:04', level: 'INFO', msg: 'Received /v1/chat/completions token batch: prompt=256 max_tokens=512' },
    { time: '10:42:35', level: 'ERROR', msg: 'ExitCode 137 in eval-gsm8k pod: OOMKilled by Linux cgroup limit (limit: 64GiB)' },
    { time: '10:43:00', level: 'INFO', msg: 'Karpenter autoscaler triggered pod rescheduling to node ip-10-0-4-88' },
  ];

  const filteredLogs = sampleKubernetesLogs.filter(
    (l) =>
      l.msg.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      l.level.toLowerCase().includes(logSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* DevOps Studio Sub-Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            DevOps & Infrastructure Studio
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>CI/CD Multi-Stage Gate</span>
            <span aria-hidden="true">·</span>
            <span>IaC Terraform Drift Control</span>
            <span aria-hidden="true">·</span>
            <span>Live Container Telemetry & Incident Ops</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('cicd')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'cicd' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            CI/CD Pipelines
          </button>
          <button
            onClick={() => setActiveTab('iac')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'iac' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            IaC & Terraform
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'monitoring' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Monitoring & Logs
          </button>
          <button
            onClick={() => setActiveTab('environments')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'environments' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Environments
          </button>
        </div>
      </div>

      {/* Tab 1: CI/CD Multi-Stage Pipeline Visualizer */}
      {activeTab === 'cicd' && (
        <div className="space-y-6">
          {/* Top Actions: Run Pipeline & Release Tag */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-slate-900 text-sm">
                  Active Build Pipeline: #{selectedPipeline?.runNumber}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    selectedPipeline?.status === 'success'
                      ? 'bg-emerald-50 text-emerald-700'
                      : selectedPipeline?.status === 'running'
                      ? 'bg-blue-50 text-blue-700 animate-pulse'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {selectedPipeline?.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                branch: {selectedPipeline?.branch} · sha: {selectedPipeline?.commitSha} · author:{' '}
                {selectedPipeline?.author}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onRunPipeline}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run New Pipeline</span>
              </button>
              <button
                onClick={() => onRollback(selectedPipeline.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md text-xs font-medium transition-colors"
                title="Rollback to previous stable version"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>1-Click Rollback</span>
              </button>
            </div>
          </div>

          {/* Visual Multi-Stage Pipeline Track */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4">
              Pipeline Execution Stages (Target: {activeEnv})
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {selectedPipeline?.stages.map((stage, idx) => (
                <div
                  key={stage.name}
                  className={`p-3.5 rounded-lg border text-xs flex flex-col justify-between ${
                    stage.status === 'success'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : stage.status === 'running'
                      ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-300'
                      : stage.status === 'failed'
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-slate-400 text-xs">0{idx + 1}</span>
                      {stage.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : stage.status === 'running' ? (
                        <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="font-semibold text-slate-900 leading-snug mb-1">
                      {stage.name}
                    </div>
                  </div>

                  <div className="text-slate-500 font-mono text-xs pt-2 border-t border-slate-200/60 mt-3">
                    {stage.durationMs > 0 ? `${(stage.durationMs / 1000).toFixed(1)}s` : 'queued'}
                  </div>
                </div>
              ))}
            </div>

            {/* Stage Logs Terminal */}
            <div className="mt-6 bg-slate-950 rounded-lg p-4 font-mono text-xs text-slate-200 space-y-1 overflow-x-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-slate-400">
                <span className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Live CI/CD Console Log Output
                </span>
                <span>SHA: {selectedPipeline.commitSha}</span>
              </div>
              {selectedPipeline.stages.flatMap((s) => s.logs).length > 0 ? (
                selectedPipeline.stages.flatMap((s) => s.logs).map((log, i) => (
                  <div key={i} className="text-slate-300 py-0.5">
                    <span className="text-slate-600 select-none mr-2">[{i + 1}]</span>
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-slate-500">Pipeline stages initialized. Logs will stream here.</div>
              )}
            </div>
          </div>

          {/* Deployment History Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Deployment Run History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-medium">Run</th>
                    <th className="py-2.5 px-3 font-medium">Commit</th>
                    <th className="py-2.5 px-3 font-medium">Branch</th>
                    <th className="py-2.5 px-3 font-medium">Status</th>
                    <th className="py-2.5 px-3 font-medium">Duration</th>
                    <th className="py-2.5 px-3 font-medium">Author</th>
                    <th className="py-2.5 px-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pipelines.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedPipelineId(p.id)}
                      className={`hover:bg-slate-50 cursor-pointer ${
                        p.id === selectedPipelineId ? 'bg-slate-50 font-medium' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-semibold">#{p.runNumber}</td>
                      <td className="py-2.5 px-3 font-mono">{p.commitSha}</td>
                      <td className="py-2.5 px-3">{p.branch}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            p.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.status === 'running'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{p.durationSeconds}s</td>
                      <td className="py-2.5 px-3">{p.author}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRollback(p.id);
                          }}
                          className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                        >
                          Rollback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: IaC & Terraform / OpenTofu */}
      {activeTab === 'iac' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Infrastructure as Code (IaC) Inventory
              </h3>
              <p className="text-xs text-slate-500">
                Terraform state sync, resource definitions, and automatic drift detection.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">Backend: S3 + DynamoDB Lock</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {iacResources.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-800">
                      {res.provider}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        res.driftStatus === 'in_sync'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {res.driftStatus === 'in_sync' ? 'In Sync' : 'Drift Detected'}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 font-mono mb-1">
                    {res.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono mb-3">{res.filePath}</p>

                  {/* HCL Snippet Preview */}
                  <pre className="bg-slate-950 text-slate-300 p-2.5 rounded-lg text-xs font-mono overflow-x-auto max-h-36 mb-3">
                    {res.hclSnippet}
                  </pre>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Applied: {res.lastApplied}</span>
                  <button
                    onClick={() => handleDrift(res.id)}
                    disabled={isDriftChecking === res.id}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-3 h-3 ${isDriftChecking === res.id ? 'animate-spin' : ''}`}
                    />
                    <span>{isDriftChecking === res.id ? 'Planning...' : 'Check Drift'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Monitoring, Live Container Logs & Incidents */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          {/* Active Incident Banner if any */}
          {incident && (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-amber-700 shrink-0" />
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-amber-200 text-amber-900 rounded">
                    {incident.severity}
                  </span>
                  <h3 className="font-semibold text-slate-900 text-sm">{incident.title}</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-amber-100 text-amber-800 uppercase">
                  {incident.status}
                </span>
              </div>
              <p className="text-xs text-slate-700 mb-3">{incident.impact}</p>

              <div className="bg-white rounded-lg p-3 border border-amber-200 text-xs space-y-1.5">
                <span className="font-semibold text-slate-800 block mb-1">Incident Timeline:</span>
                {incident.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-600">
                    <span className="font-mono text-slate-400 shrink-0">{item.time}</span>
                    <span>{item.note}</span>
                    <span className="text-slate-400">({item.author})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metric Alerts Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        alert.severity === 'critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : alert.severity === 'warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs text-slate-400">{alert.time}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono mb-2">Pod: {alert.service}</p>

                  <div className="bg-slate-50 p-2 rounded text-xs font-mono text-slate-700 mb-3">
                    Value: <span className="font-bold text-rose-600">{alert.value}</span> (Threshold:{' '}
                    {alert.threshold})
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  {alert.status === 'active' && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.status !== 'resolved' ? (
                    <button
                      onClick={() => onResolveAlert(alert.id)}
                      className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition-colors"
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Live Log Aggregation & Search */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-900 font-mono text-xs text-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-slate-100">
                  Kubernetes Cluster & Container Logs Stream
                </span>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Regex filter logs..."
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {filteredLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 py-0.5 leading-relaxed">
                  <span className="text-slate-500 shrink-0">{log.time}</span>
                  <span
                    className={`font-semibold shrink-0 ${
                      log.level === 'ERROR'
                        ? 'text-rose-400'
                        : log.level === 'WARN'
                        ? 'text-amber-400'
                        : 'text-blue-400'
                    }`}
                  >
                    [{log.level}]
                  </span>
                  <span className="text-slate-300">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Environment Management */}
      {activeTab === 'environments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              env: 'Development',
              region: 'us-east-1a (Minikube / Dev Cluster)',
              replicas: '2 pods',
              commit: 'sha-2b48fe3',
              lastDeploy: '10m ago',
              status: 'healthy',
              varsCount: 18,
            },
            {
              env: 'Staging',
              region: 'us-east-1 (EKS Cluster Staging)',
              replicas: '4 pods (H100 + A100)',
              commit: 'sha-7f9c2d1',
              lastDeploy: '12m ago',
              status: 'healthy',
              varsCount: 24,
            },
            {
              env: 'Production',
              region: 'us-east-1 + eu-central-1 (Multi-AZ)',
              replicas: '12 pods (H100 SXM5)',
              commit: 'sha-118df3a',
              lastDeploy: '3 days ago',
              status: 'healthy',
              varsCount: 31,
            },
          ].map((item) => (
            <div key={item.env} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">{item.env}</h3>
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700">
                  {item.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cluster Region:</span>
                  <span className="font-mono text-slate-800">{item.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Replicas:</span>
                  <span className="font-mono text-slate-800">{item.replicas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Commit SHA:</span>
                  <span className="font-mono text-slate-800">{item.commit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Config Secrets:</span>
                  <span className="font-mono text-slate-800">{item.varsCount} variables</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Deployed {item.lastDeploy}</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Sync Config
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
