export type ProjectCategory = 'AI/ML' | 'Infrastructure' | 'Security' | 'CI/CD' | 'Data Ops';

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  health: 'healthy' | 'at_risk' | 'delayed';
  leadId: string;
  progressPct: number;
  subProjects?: { id: string; name: string; taskCount: number }[];
  linkedProjectIds: string[];
  repoUrl: string;
  environment: 'production' | 'staging' | 'dev';
  createdAt: string;
}

export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  assigneeId?: string;
  storyPoints: number;
  timeSpentMinutes: number;
  isTrackingTime?: boolean;
  dependencies: string[]; // task IDs this task is blocked by
  subtasks: Subtask[];
  customFields: {
    cloudProvider?: string;
    gpuRequirement?: string;
    targetAccuracy?: string;
    iacTool?: string;
  };
  ideSync?: {
    file: string;
    line: number;
    activeBranch: string;
  };
  createdAt: string;
  dueDate: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'DevOps Lead' | 'MLOps Engineer' | 'Junior AI Developer' | 'Junior DevOps' | 'Security Analyst';
  email: string;
  avatar: string;
  skills: string[];
  activePoints: number;
  maxCapacityPoints: number;
  activeStatus: 'working' | 'in_review' | 'idle' | 'meeting';
}

export interface DeploymentPipeline {
  id: string;
  projectId: string;
  runNumber: number;
  branch: string;
  commitSha: string;
  commitMsg: string;
  author: string;
  status: 'running' | 'success' | 'failed' | 'cancelled';
  durationSeconds: number;
  startedAt: string;
  stages: {
    name: 'Lint & Format' | 'Unit Tests' | 'Docker Build' | 'CVE Security Scan' | 'Deploy Staging' | 'Smoke & E2E';
    status: 'success' | 'running' | 'pending' | 'failed';
    durationMs: number;
    logs: string[];
  }[];
}

export interface IaCResource {
  id: string;
  name: string;
  type: string;
  provider: 'AWS' | 'GCP' | 'Cloudflare';
  driftStatus: 'in_sync' | 'drift_detected';
  lastApplied: string;
  filePath: string;
  hclSnippet: string;
}

export interface MetricAlert {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  service: string;
  metric: string;
  value: string;
  threshold: string;
  time: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface Incident {
  id: string;
  title: string;
  severity: 'P1' | 'P2' | 'P3';
  commanderId: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  impact: string;
  summary: string;
  timeline: { time: string; note: string; author: string }[];
}

export interface ModelRecord {
  id: string;
  name: string;
  version: string;
  architecture: string;
  weightsHash: string;
  format: 'safetensors' | 'gguf' | 'onnx' | 'tensorrt-llm';
  stage: 'production' | 'canary' | 'staging' | 'archived';
  canarySplitPercent: number;
  metrics: {
    accuracy: number;
    evalLoss: number;
    latencyP95Ms: number;
    throughputTokPerSec: number;
    rougeL: number;
  };
  lastDeployed: string;
}

export interface ExperimentRun {
  id: string;
  name: string;
  modelBase: string;
  status: 'completed' | 'running' | 'failed';
  hyperparameters: {
    learningRate: number;
    batchSize: number;
    epochs: number;
    loraR: number;
    warmupRatio: number;
    optimizer: string;
  };
  metrics: {
    valLoss: number;
    perplexity: number;
    evalF1: number;
    gpuMemPeakGb: number;
  };
  durationMin: number;
  createdAt: string;
}

export interface Dataset {
  id: string;
  name: string;
  version: string;
  totalTokens: string;
  sampleCount: number;
  format: string;
  license: string;
  split: string;
  driftStatus: 'nominal' | 'minor_shift';
}

export interface GpuNode {
  id: string;
  name: string;
  type: 'NVIDIA H100' | 'NVIDIA A100' | 'NVIDIA L4';
  vramTotalGb: number;
  vramUsedGb: number;
  tempC: number;
  powerW: number;
  status: 'active' | 'idle' | 'preempted';
  currentJobName?: string;
  hourlyCostUsd: number;
}

export interface TrainingJob {
  id: string;
  name: string;
  modelType: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
  requestedGpus: number;
  submittedBy: string;
  status: 'queued' | 'running' | 'completed' | 'cancelled';
  progressPct: number;
  estimatedHoursRemaining: number;
  preemptible: boolean;
}

export interface Runbook {
  id: string;
  title: string;
  category: 'DevOps' | 'AI/MLOps' | 'Troubleshooting' | 'Security';
  readTimeMin: number;
  author: string;
  lastUpdated: string;
  content: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  ip: string;
  category: 'auth' | 'deploy' | 'infra' | 'model' | 'rbac';
}
