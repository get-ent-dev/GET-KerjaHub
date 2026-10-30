'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Activity,
  Plus,
  Play,
  Pause,
  XCircle,
  Sparkles,
  Sliders,
  DollarSign,
  TrendingDown,
  Database,
  ArrowRight,
  CheckCircle2,
  Clock,
  Gauge,
} from 'lucide-react';
import {
  ModelRecord,
  ExperimentRun,
  Dataset,
  GpuNode,
  TrainingJob,
} from '@/types/devpulse';
import { calculateGpuMetrics } from '@/lib/devpulse-logic';

interface AiMlOpsLabProps {
  models: ModelRecord[];
  experiments: ExperimentRun[];
  datasets: Dataset[];
  gpus: GpuNode[];
  jobs: TrainingJob[];
  onUpdateCanarySplit: (modelId: string, splitPct: number) => void;
  onSubmitTrainingJob: (job: Partial<TrainingJob>) => void;
  onCancelTrainingJob: (jobId: string) => void;
  onOpenCopilot: (initialMode?: string) => void;
}

export function AiMlOpsLab({
  models,
  experiments,
  datasets,
  gpus,
  jobs,
  onUpdateCanarySplit,
  onSubmitTrainingJob,
  onCancelTrainingJob,
  onOpenCopilot,
}: AiMlOpsLabProps) {
  const [activeTab, setActiveTab] = useState<'models' | 'experiments' | 'compute' | 'datasets'>('models');
  const [selectedExpForCompare, setSelectedExpForCompare] = useState<string[]>(['exp-108', 'exp-107']);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [newJobName, setNewJobName] = useState('');
  const [newJobType, setNewJobType] = useState('LoRA Fine-Tuning');
  const [newJobGpus, setNewJobGpus] = useState(1);
  const [newJobPriority, setNewJobPriority] = useState<'critical' | 'high' | 'normal' | 'low'>('normal');
  const [isPreemptible, setIsPreemptible] = useState(true);

  // Compute metrics from pure logic
  const gpuSummary = calculateGpuMetrics(
    gpus.map((g) => ({
      id: g.id,
      type: g.type,
      hourlyRate: g.hourlyCostUsd,
      totalVramGb: g.vramTotalGb,
      allocatedVramGb: g.vramUsedGb,
      status: g.status,
    }))
  );

  const toggleExpCompare = (id: string) => {
    if (selectedExpForCompare.includes(id)) {
      setSelectedExpForCompare(selectedExpForCompare.filter((i) => i !== id));
    } else {
      setSelectedExpForCompare([...selectedExpForCompare, id]);
    }
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobName.trim()) return;
    onSubmitTrainingJob({
      name: newJobName,
      modelType: newJobType,
      requestedGpus: newJobGpus,
      priority: newJobPriority,
      preemptible: isPreemptible,
      submittedBy: 'Junior AI Developer',
      status: 'queued',
      progressPct: 0,
      estimatedHoursRemaining: 3.5,
    });
    setNewJobName('');
    setShowNewJobModal(false);
  };

  return (
    <div className="space-y-6">
      {/* MLOps Lab Sub-Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            AI & MLOps Development Lab
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>Model Version Registry</span>
            <span aria-hidden="true">·</span>
            <span>A/B Canary Traffic Splitter</span>
            <span aria-hidden="true">·</span>
            <span>Hyperparameter Experiment Runs</span>
            <span aria-hidden="true">·</span>
            <span>GPU Compute Allocation</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'models' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Model Registry & A/B
          </button>
          <button
            onClick={() => setActiveTab('experiments')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'experiments' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Experiments
          </button>
          <button
            onClick={() => setActiveTab('compute')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'compute' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            GPU Compute & Queue
          </button>
          <button
            onClick={() => setActiveTab('datasets')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'datasets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Datasets
          </button>
        </div>
      </div>

      {/* Tab 1: Model Registry & Canary A/B Testing */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          {/* A/B Canary Splitter Interactive Controller */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Production vs Canary A/B Traffic Split
                </h3>
                <p className="text-xs text-slate-500">
                  Route real inference queries between stable release and LoRA canary candidate.
                </p>
              </div>
              <button
                onClick={() => onOpenCopilot('mlops_advisor')}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Advisor on Evaluation</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Model v2.4.0 (Production: {models[0]?.canarySplitPercent ?? 90}%)</span>
                <span>Model v2.5.0-rc1 (Canary: {models[1]?.canarySplitPercent ?? 10}%)</span>
              </div>

              {/* Interactive Traffic Split Slider */}
              <input
                type="range"
                min="0"
                max="50"
                value={models[1]?.canarySplitPercent ?? 10}
                onChange={(e) => {
                  const canaryVal = Number(e.target.value);
                  onUpdateCanarySplit(models[1].id, canaryVal);
                  onUpdateCanarySplit(models[0].id, 100 - canaryVal);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <span className="font-semibold text-slate-800">Production Baseline (v2.4.0)</span>
                  <div className="flex justify-between text-slate-600">
                    <span>Eval Accuracy:</span>
                    <span className="font-mono font-medium text-slate-900">84.6%</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>P95 Latency:</span>
                    <span className="font-mono font-medium text-slate-900">48ms</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Throughput:</span>
                    <span className="font-mono font-medium text-slate-900">1,840 tok/s</span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-indigo-900">Canary Candidate (v2.5.0-rc1)</span>
                    <span className="text-emerald-700 font-bold">+2.6% Acc</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Eval Accuracy:</span>
                    <span className="font-mono font-medium text-emerald-700">87.2%</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>P95 Latency:</span>
                    <span className="font-mono font-medium text-emerald-700">38ms (-20%)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Throughput:</span>
                    <span className="font-mono font-medium text-emerald-700">2,210 tok/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Registry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {models.map((mod) => (
              <div
                key={mod.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-800">
                      {mod.version}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${
                        mod.stage === 'production'
                          ? 'bg-emerald-50 text-emerald-700'
                          : mod.stage === 'canary'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {mod.stage}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 mb-0.5">{mod.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mb-3">{mod.architecture}</p>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Weights Format:</span>
                      <span className="font-mono text-slate-800">{mod.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Accuracy:</span>
                      <span className="font-mono font-medium text-slate-900">
                        {mod.metrics.accuracy}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Eval Loss:</span>
                      <span className="font-mono text-slate-900">{mod.metrics.evalLoss}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Weights SHA:</span>
                      <span className="font-mono text-slate-500 text-xs">{mod.weightsHash}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Deployed {mod.lastDeployed}</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                    View Checkpoint
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Experiment Tracking & Comparison */}
      {activeTab === 'experiments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Fine-Tuning Experiment Tracking
                </h3>
                <p className="text-xs text-slate-500">
                  Compare hyperparameters, loss curves, validation perplexity, and peak GPU VRAM across runs.
                </p>
              </div>

              <button
                onClick={() => onOpenCopilot('mlops_advisor')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-md text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Tuning Advisor</span>
              </button>
            </div>

            {/* Comparison Highlights */}
            {selectedExpForCompare.length >= 2 && (
              <div className="mb-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-semibold text-slate-900 block mb-2">
                  Side-by-Side Run Comparison:
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedExpForCompare.map((id) => {
                    const exp = experiments.find((e) => e.id === id);
                    if (!exp) return null;
                    return (
                      <div key={exp.id} className="bg-white p-3 rounded border border-slate-200 space-y-1">
                        <span className="font-mono font-semibold text-slate-900 text-xs block truncate">
                          {exp.name}
                        </span>
                        <div className="text-slate-500">LR: <span className="font-mono text-slate-800">{exp.hyperparameters.learningRate}</span></div>
                        <div className="text-slate-500">LoRA Rank: <span className="font-mono text-slate-800">r={exp.hyperparameters.loraR}</span></div>
                        <div className="text-slate-500">Perplexity: <span className="font-mono text-emerald-700 font-semibold">{exp.metrics.perplexity}</span></div>
                        <div className="text-slate-500">F1 Score: <span className="font-mono text-slate-900">{exp.metrics.evalF1}%</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Experiments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-medium">Compare</th>
                    <th className="py-2.5 px-3 font-medium">Experiment Run</th>
                    <th className="py-2.5 px-3 font-medium">Base Model</th>
                    <th className="py-2.5 px-3 font-medium">Learning Rate</th>
                    <th className="py-2.5 px-3 font-medium">Batch Size</th>
                    <th className="py-2.5 px-3 font-medium">LoRA Rank</th>
                    <th className="py-2.5 px-3 font-medium">Val Loss</th>
                    <th className="py-2.5 px-3 font-medium">Perplexity</th>
                    <th className="py-2.5 px-3 font-medium">Peak VRAM</th>
                    <th className="py-2.5 px-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {experiments.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          checked={selectedExpForCompare.includes(exp.id)}
                          onChange={() => toggleExpCompare(exp.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                        />
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{exp.name}</td>
                      <td className="py-2.5 px-3">{exp.modelBase}</td>
                      <td className="py-2.5 px-3 font-mono">{exp.hyperparameters.learningRate}</td>
                      <td className="py-2.5 px-3 font-mono">{exp.hyperparameters.batchSize}</td>
                      <td className="py-2.5 px-3 font-mono">r={exp.hyperparameters.loraR}</td>
                      <td className="py-2.5 px-3 font-mono">{exp.metrics.valLoss}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-emerald-700">{exp.metrics.perplexity}</td>
                      <td className="py-2.5 px-3 font-mono">{exp.metrics.gpuMemPeakGb} GB</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            exp.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : exp.status === 'running'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Compute & GPU Resource Management */}
      {activeTab === 'compute' && (
        <div className="space-y-6">
          {/* Top GPU Cluster Metrics from Pure Logic */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Active GPU Nodes</span>
              <div className="text-xl font-bold text-slate-900">
                {gpuSummary.activeNodes} / {gpuSummary.totalNodes} Nodes
              </div>
              <span className="text-xs text-slate-400">NVIDIA H100 & A100 Racks</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Total VRAM Allocated</span>
              <div className="text-xl font-bold text-slate-900">
                {gpuSummary.allocatedVramGb} / {gpuSummary.totalVramGb} GB
              </div>
              <span className="text-xs text-indigo-600 font-medium">
                {gpuSummary.vramUtilizationPct}% Utilization
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Compute Hourly Burn</span>
              <div className="text-xl font-bold text-slate-900">
                ${gpuSummary.hourlyCostUsd}/hr
              </div>
              <span className="text-xs text-slate-400">Spot & On-Demand mix</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Forecasted 30-Day Cost</span>
              <div className="text-xl font-bold text-slate-900">
                ${gpuSummary.projectedMonthlyCostUsd.toLocaleString()}
              </div>
              <span className="text-xs text-emerald-600 font-medium">Within $6,000 budget</span>
            </div>
          </div>

          {/* GPU Hardware Rack Cards */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Cluster Node Inventory & VRAM Allocation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {gpus.map((gpu) => (
                <div key={gpu.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-xs">{gpu.name}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        gpu.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {gpu.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 font-mono">{gpu.type}</div>

                  {/* VRAM Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>VRAM: {gpu.vramUsedGb}/{gpu.vramTotalGb}GB</span>
                      <span>{Math.round((gpu.vramUsedGb / gpu.vramTotalGb) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${(gpu.vramUsedGb / gpu.vramTotalGb) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>Temp: {gpu.tempC}°C</span>
                    <span>Power: {gpu.powerW}W</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training Job Scheduling Queue */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Training Job Scheduling Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Priority queue management with spot preemption tolerances and resource scheduling.
                </p>
              </div>

              <button
                onClick={() => setShowNewJobModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit Training Job</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <div key={job.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {job.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          job.priority === 'critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : job.priority === 'high'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {job.priority} priority
                      </span>
                      {job.preemptible && (
                        <span className="text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                          Spot Preemptible (-65%)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{job.modelType}</span>
                      <span aria-hidden="true">·</span>
                      <span>Requires: {job.requestedGpus} GPU</span>
                      <span aria-hidden="true">·</span>
                      <span>By: {job.submittedBy}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-mono text-xs font-semibold text-slate-800 capitalize block">
                        {job.status} ({job.progressPct}%)
                      </span>
                      <span className="text-xs text-slate-400">
                        {job.estimatedHoursRemaining > 0
                          ? `~${job.estimatedHoursRemaining}h remaining`
                          : 'Completed'}
                      </span>
                    </div>

                    {job.status !== 'completed' && job.status !== 'cancelled' && (
                      <button
                        onClick={() => onCancelTrainingJob(job.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Cancel training job"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Datasets */}
      {activeTab === 'datasets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {datasets.map((ds) => (
            <div key={ds.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-800">
                    {ds.version}
                  </span>
                  <h4 className="text-base font-semibold text-slate-900 mt-1">{ds.name}</h4>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    ds.driftStatus === 'nominal'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {ds.driftStatus === 'nominal' ? 'Distribution Nominal' : 'Minor Drift Shift'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Tokens:</span>
                  <span className="font-mono font-medium text-slate-900">{ds.totalTokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sample Count:</span>
                  <span className="font-mono text-slate-800">{ds.sampleCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Format & License:</span>
                  <span className="text-slate-800">{ds.format} · {ds.license}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Train/Val/Test Split:</span>
                  <span className="font-mono text-slate-800">{ds.split}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">Lineage: Clean synthetic + verified human QA</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Inspect Samples
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Job Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Schedule Training or Fine-Tuning Job
              </h3>
              <button
                onClick={() => setShowNewJobModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Job Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., run-lora-code-instruct-v2"
                  value={newJobName}
                  onChange={(e) => setNewJobName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Model / Task Type</label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none"
                  >
                    <option value="LoRA Fine-Tuning">LoRA Fine-Tuning</option>
                    <option value="DPO Preference Alignment">DPO Alignment</option>
                    <option value="Evaluation Benchmark">Eval Benchmark</option>
                    <option value="Pre-training Shard">Pre-training Shard</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">GPU Nodes</label>
                  <select
                    value={newJobGpus}
                    onChange={(e) => setNewJobGpus(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none"
                  >
                    <option value={1}>1x GPU (80GB VRAM)</option>
                    <option value={2}>2x GPUs (160GB VRAM)</option>
                    <option value={4}>4x GPUs (320GB VRAM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Queue Priority</label>
                <select
                  value={newJobPriority}
                  onChange={(e) => setNewJobPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none"
                >
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="preemptible"
                  checked={isPreemptible}
                  onChange={(e) => setIsPreemptible(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900"
                />
                <label htmlFor="preemptible" className="text-slate-700 cursor-pointer">
                  Allow Spot Preemption (65% cloud cost discount)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium transition-colors"
                >
                  Schedule Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
