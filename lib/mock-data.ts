import {
  Project,
  Task,
  TeamMember,
  DeploymentPipeline,
  IaCResource,
  MetricAlert,
  Incident,
  ModelRecord,
  ExperimentRun,
  Dataset,
  GpuNode,
  TrainingJob,
  Runbook,
  AuditLogItem,
} from '@/types/devpulse';
import { AutomationRule } from './devpulse-logic';

export const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Alex Rivera',
    role: 'Junior DevOps',
    email: 'alex.rivera@devpulse.io',
    avatar: 'AR',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'GitHub Actions', 'Prometheus'],
    activePoints: 8,
    maxCapacityPoints: 13,
    activeStatus: 'working',
  },
  {
    id: 'user-2',
    name: 'Sofia Chen',
    role: 'Junior AI Developer',
    email: 'sofia.chen@devpulse.io',
    avatar: 'SC',
    skills: ['PyTorch', 'Transformers', 'CUDA', 'LoRA', 'LangChain', 'vLLM'],
    activePoints: 11,
    maxCapacityPoints: 13,
    activeStatus: 'working',
  },
  {
    id: 'user-3',
    name: 'Marcus Vance',
    role: 'DevOps Lead',
    email: 'marcus.vance@devpulse.io',
    avatar: 'MV',
    skills: ['Kubernetes', 'Helm', 'AWS EKS', 'IaC', 'ArgoCD', 'Terraform'],
    activePoints: 14,
    maxCapacityPoints: 21,
    activeStatus: 'in_review',
  },
  {
    id: 'user-4',
    name: 'Dr. Elena Rostova',
    role: 'MLOps Engineer',
    email: 'elena.rostova@devpulse.io',
    avatar: 'ER',
    skills: ['MLflow', 'Triton Server', 'CUDA', 'Distributed Training', 'TensorRT', 'Ray'],
    activePoints: 12,
    maxCapacityPoints: 21,
    activeStatus: 'working',
  },
  {
    id: 'user-5',
    name: 'Liam Patel',
    role: 'Security Analyst',
    email: 'liam.patel@devpulse.io',
    avatar: 'LP',
    skills: ['Trivy', 'Falco', 'IAM', 'SOC 2', 'Kubernetes RBAC', 'GPG'],
    activePoints: 5,
    maxCapacityPoints: 13,
    activeStatus: 'idle',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'LLM Fine-Tuning & vLLM Serving Pipeline',
    key: 'LLM',
    description: 'Domain adaptation of open-source weights using LoRA, continuous validation, and high-throughput low-latency inference on H100 clusters.',
    category: 'AI/ML',
    tags: ['AI/ML', 'PyTorch', 'vLLM', 'H100'],
    status: 'active',
    health: 'healthy',
    leadId: 'user-2',
    progressPct: 68,
    subProjects: [
      { id: 'sub-1', name: 'Dataset Sanitization & Tokenization', taskCount: 3 },
      { id: 'sub-2', name: 'LoRA Training & Eval Checkpointing', taskCount: 4 },
      { id: 'sub-3', name: 'vLLM Helm Chart & Autoscaling', taskCount: 3 },
    ],
    linkedProjectIds: ['proj-2'],
    repoUrl: 'https://github.com/devpulse/model-serving-core',
    environment: 'staging',
    createdAt: '2026-09-15',
  },
  {
    id: 'proj-2',
    name: 'EKS Karpenter GPU Cluster & GitOps IaC',
    key: 'INFRA',
    description: 'Infrastructure as Code managing spot GPU nodes, Karpenter autoscaler, and ArgoCD synchronization for fast worker node provisioning.',
    category: 'Infrastructure',
    tags: ['Infrastructure', 'Terraform', 'AWS', 'Kubernetes'],
    status: 'active',
    health: 'healthy',
    leadId: 'user-1',
    progressPct: 82,
    subProjects: [
      { id: 'sub-4', name: 'Terraform VPC & Node Groups', taskCount: 4 },
      { id: 'sub-5', name: 'Karpenter GPU NodeProvisioner', taskCount: 2 },
    ],
    linkedProjectIds: ['proj-1', 'proj-3'],
    repoUrl: 'https://github.com/devpulse/terraform-aws-cluster',
    environment: 'production',
    createdAt: '2026-09-01',
  },
  {
    id: 'proj-3',
    name: 'Automated Microservices CI/CD & CVE Gate',
    key: 'CICD',
    description: 'Zero-trust deployment workflow with automated unit tests, container builds, Trivy CVE vulnerability scans, and canary rollouts.',
    category: 'CI/CD',
    tags: ['CI/CD', 'GitHub Actions', 'Docker', 'Trivy'],
    status: 'active',
    health: 'healthy',
    leadId: 'user-1',
    progressPct: 91,
    subProjects: [],
    linkedProjectIds: ['proj-2'],
    repoUrl: 'https://github.com/devpulse/ci-cd-templates',
    environment: 'production',
    createdAt: '2026-08-20',
  },
  {
    id: 'proj-4',
    name: 'Platform Zero-Trust RBAC & Audit Hardening',
    key: 'SEC',
    description: 'Granular role-based access control, automated secret rotation, Falco runtime anomaly detection, and ISO 27001 readiness review.',
    category: 'Security',
    tags: ['Security', 'IAM', 'Compliance', 'Audit'],
    status: 'planning',
    health: 'healthy',
    leadId: 'user-5',
    progressPct: 35,
    subProjects: [],
    linkedProjectIds: ['proj-2'],
    repoUrl: 'https://github.com/devpulse/security-audit-rules',
    environment: 'staging',
    createdAt: '2026-10-10',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-101',
    projectId: 'proj-1',
    title: 'Configure FlashAttention-2 & gradient checkpointing in LoRA trainer',
    description: 'Enable FlashAttention-2 to reduce peak VRAM by ~35% on A100/H100 during batch size 16 sequence length 4096 runs.',
    status: 'in_progress',
    priority: 'high',
    tags: ['AI/ML', 'CUDA', 'PyTorch'],
    assigneeId: 'user-2',
    storyPoints: 5,
    timeSpentMinutes: 185,
    isTrackingTime: true,
    dependencies: [],
    subtasks: [
      { id: 'st-1', title: 'Verify flash-attn wheel compatibility with PyTorch 2.5', completed: true },
      { id: 'st-2', title: 'Benchmark VRAM footprint with 4k context tokens', completed: true },
      { id: 'st-3', title: 'Integrate gradient checkpointing flag in train_lora.py', completed: false },
    ],
    customFields: {
      gpuRequirement: 'NVIDIA H100 (80GB)',
      targetAccuracy: 'Perplexity < 3.2',
    },
    ideSync: {
      file: 'src/training/train_lora.py',
      line: 142,
      activeBranch: 'feat/flash-attn-opt',
    },
    createdAt: '2026-10-25',
    dueDate: '2026-11-02',
  },
  {
    id: 'task-102',
    projectId: 'proj-1',
    title: 'Implement vLLM streaming response metrics and P95 latency probe',
    description: 'Add Prometheus metrics export for time-to-first-token (TTFT) and inter-token latency across concurrent requests.',
    status: 'review',
    priority: 'medium',
    tags: ['AI/ML', 'vLLM', 'Prometheus'],
    assigneeId: 'user-2',
    storyPoints: 3,
    timeSpentMinutes: 120,
    dependencies: ['task-101'],
    subtasks: [
      { id: 'st-4', title: 'Add histogram buckets for TTFT (<50ms, <150ms)', completed: true },
      { id: 'st-5', title: 'Verify grafana dashboard scraper endpoint', completed: true },
    ],
    customFields: {
      gpuRequirement: 'NVIDIA A100 (80GB)',
      targetAccuracy: 'P95 TTFT < 80ms',
    },
    createdAt: '2026-10-26',
    dueDate: '2026-11-04',
  },
  {
    id: 'task-103',
    projectId: 'proj-2',
    title: 'Apply Terraform Karpenter node provisioner for g5.12xlarge spot instances',
    description: 'Define NodePool CRDs with interruption handling to leverage AWS Spot instances at a 65% cost reduction.',
    status: 'in_progress',
    priority: 'critical',
    tags: ['Infrastructure', 'Terraform', 'Kubernetes'],
    assigneeId: 'user-1',
    storyPoints: 5,
    timeSpentMinutes: 240,
    dependencies: [],
    subtasks: [
      { id: 'st-6', title: 'Write Karpenter NodePool HCL module', completed: true },
      { id: 'st-7', title: 'Set up SQS event queue for AWS Spot termination warnings', completed: true },
      { id: 'st-8', title: 'Validate terraform plan with local drift check', completed: false },
    ],
    customFields: {
      cloudProvider: 'AWS us-east-1',
      iacTool: 'Terraform v1.9',
    },
    ideSync: {
      file: 'infra/k8s/karpenter_nodepool.tf',
      line: 38,
      activeBranch: 'infra/karpenter-spot',
    },
    createdAt: '2026-10-24',
    dueDate: '2026-10-31',
  },
  {
    id: 'task-104',
    projectId: 'proj-3',
    title: 'Add Trivy vulnerability blocker in GitHub Actions build matrix',
    description: 'Fail CI if CRITICAL or HIGH CVEs are found in base container images before pushing to registry.',
    status: 'done',
    priority: 'high',
    tags: ['CI/CD', 'Security', 'Docker'],
    assigneeId: 'user-1',
    storyPoints: 3,
    timeSpentMinutes: 95,
    dependencies: [],
    subtasks: [
      { id: 'st-9', title: 'Pin trivy-action@0.28.0', completed: true },
      { id: 'st-10', title: 'Configure .trivyignore for false-positive CVEs', completed: true },
    ],
    customFields: {
      cloudProvider: 'GitHub Actions / GHCR',
    },
    createdAt: '2026-10-22',
    dueDate: '2026-10-28',
  },
  {
    id: 'task-105',
    projectId: 'proj-1',
    title: 'Run automated model evaluation suite on GSM8k and HumanEval',
    description: 'Benchmark checkpoint #104 against baseline weights and log BLEU, ROUGE-L, and code execution pass@1 rates.',
    status: 'backlog',
    priority: 'medium',
    tags: ['AI/ML', 'Eval', 'LoRA'],
    assigneeId: 'user-4',
    storyPoints: 5,
    timeSpentMinutes: 0,
    dependencies: ['task-101'],
    subtasks: [
      { id: 'st-11', title: 'Prepare tokenized GSM8k test split', completed: false },
      { id: 'st-12', title: 'Execute sandbox python execution harness', completed: false },
    ],
    customFields: {
      gpuRequirement: 'NVIDIA A100 (80GB)',
      targetAccuracy: 'Pass@1 > 68%',
    },
    createdAt: '2026-10-27',
    dueDate: '2026-11-06',
  },
  {
    id: 'task-106',
    projectId: 'proj-2',
    title: 'Set up Prometheus Alertmanager routing to Slack #alerts-devops',
    description: 'Configure high-severity alerts for PodCrashLoopBackOff, GPU thermal throttling (>82C), and node memory pressure.',
    status: 'backlog',
    priority: 'high',
    tags: ['Infrastructure', 'Prometheus', 'Monitoring'],
    assigneeId: 'user-3',
    storyPoints: 3,
    timeSpentMinutes: 0,
    dependencies: ['task-103'],
    subtasks: [
      { id: 'st-13', title: 'Define alert routing matrix in AlertmanagerConfig', completed: false },
    ],
    customFields: {
      cloudProvider: 'Kubernetes In-Cluster',
    },
    createdAt: '2026-10-28',
    dueDate: '2026-11-05',
  },
];

export const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'Auto-Assign GPU & CUDA to AI/ML Specialist',
    keyword: 'cuda',
    assignToMemberId: 'user-2',
    addTags: ['AI/ML', 'CUDA'],
    setPriority: 'high',
  },
  {
    id: 'rule-2',
    name: 'Auto-Assign Terraform & IaC to DevOps Lead',
    keyword: 'terraform',
    assignToMemberId: 'user-1',
    addTags: ['Infrastructure', 'IaC'],
    setPriority: 'medium',
  },
  {
    id: 'rule-3',
    name: 'Auto-Flag Security & CVE Tasks',
    keyword: 'cve',
    assignToMemberId: 'user-5',
    addTags: ['Security', 'Vulnerability'],
    setPriority: 'critical',
  },
  {
    id: 'rule-4',
    name: 'Auto-Assign Kubernetes & Pod Issues',
    keyword: 'k8s',
    assignToMemberId: 'user-1',
    addTags: ['Infrastructure', 'Kubernetes'],
  },
];

export const INITIAL_PIPELINES: DeploymentPipeline[] = [
  {
    id: 'pipe-842',
    projectId: 'proj-1',
    runNumber: 842,
    branch: 'main',
    commitSha: '7f9c2d1',
    commitMsg: 'feat(lora): integrate FlashAttention-2 kernel acceleration',
    author: 'Sofia Chen',
    status: 'success',
    durationSeconds: 142,
    startedAt: '12 minutes ago',
    stages: [
      {
        name: 'Lint & Format',
        status: 'success',
        durationMs: 12000,
        logs: ['ruff check . --fix ... OK', 'mypy src/ ... 0 errors found in 34 files'],
      },
      {
        name: 'Unit Tests',
        status: 'success',
        durationMs: 34000,
        logs: ['pytest tests/unit/ -v ... 62 passed, 0 failed in 31.4s'],
      },
      {
        name: 'Docker Build',
        status: 'success',
        durationMs: 48000,
        logs: ['docker build -t ghcr.io/devpulse/model-worker:sha-7f9c2d1 .', 'Pushed image digest sha256:e3b0c44...'],
      },
      {
        name: 'CVE Security Scan',
        status: 'success',
        durationMs: 18000,
        logs: ['Trivy scanner: 0 CRITICAL, 0 HIGH, 2 MEDIUM (accepted)'],
      },
      {
        name: 'Deploy Staging',
        status: 'success',
        durationMs: 15000,
        logs: ['helm upgrade --install model-serving ./chart -n staging', 'Deployment rollout completed successfully'],
      },
      {
        name: 'Smoke & E2E',
        status: 'success',
        durationMs: 15000,
        logs: ['curl -f http://staging.internal/healthz ... HTTP 200', 'Inference latency probe: 42ms OK'],
      },
    ],
  },
  {
    id: 'pipe-841',
    projectId: 'proj-2',
    runNumber: 841,
    branch: 'infra/karpenter-spot',
    commitSha: '2b48fe3',
    commitMsg: 'fix(karpenter): adjust spot interruption grace period to 120s',
    author: 'Alex Rivera',
    status: 'running',
    durationSeconds: 65,
    startedAt: '2 minutes ago',
    stages: [
      {
        name: 'Lint & Format',
        status: 'success',
        durationMs: 8000,
        logs: ['tflint --recursive ... OK', 'terraform fmt -check ... OK'],
      },
      {
        name: 'Unit Tests',
        status: 'success',
        durationMs: 14000,
        logs: ['terratest validate_nodepool_test.go ... PASS'],
      },
      {
        name: 'Docker Build',
        status: 'success',
        durationMs: 21000,
        logs: ['Building Karpenter controller sidecar ... digest verified'],
      },
      {
        name: 'CVE Security Scan',
        status: 'running',
        durationMs: 12000,
        logs: ['Scanning container layers with Trivy... checking base Alpine image'],
      },
      {
        name: 'Deploy Staging',
        status: 'pending',
        durationMs: 0,
        logs: [],
      },
      {
        name: 'Smoke & E2E',
        status: 'pending',
        durationMs: 0,
        logs: [],
      },
    ],
  },
];

export const INITIAL_IAC_RESOURCES: IaCResource[] = [
  {
    id: 'iac-1',
    name: 'aws_eks_nodepool.gpu_spot',
    type: 'karpenter.sh/v1beta1/NodePool',
    provider: 'AWS',
    driftStatus: 'in_sync',
    lastApplied: '2 hours ago',
    filePath: 'infra/k8s/karpenter_nodepool.tf',
    hclSnippet: `resource "karpenter_node_pool" "gpu_spot" {
  name = "gpu-spot-pool"
  template {
    spec {
      requirements = [
        { key = "karpenter.k8s.aws/instance-category", operator = "In", values = ["g5", "p4d"] },
        { key = "karpenter.sh/capacity-type", operator = "In", values = ["spot"] }
      ]
    }
  }
}`,
  },
  {
    id: 'iac-2',
    name: 'aws_security_group.vllm_internal',
    type: 'aws_security_group',
    provider: 'AWS',
    driftStatus: 'drift_detected',
    lastApplied: '3 days ago',
    filePath: 'infra/security/sg_inference.tf',
    hclSnippet: `resource "aws_security_group" "vllm_internal" {
  name        = "vllm-inference-sg"
  description = "Allow inbound port 8000 from private VPC only"
  vpc_id      = var.vpc_id
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }
}`,
  },
  {
    id: 'iac-3',
    name: 'cloudflare_record.api_gateway',
    type: 'cloudflare_record',
    provider: 'Cloudflare',
    driftStatus: 'in_sync',
    lastApplied: 'Yesterday',
    filePath: 'infra/dns/cloudflare.tf',
    hclSnippet: `resource "cloudflare_record" "api" {
  zone_id = var.cloudflare_zone_id
  name    = "api-devpulse"
  content = aws_lb.ingress.dns_name
  type    = "CNAME"
  proxied = true
}`,
  },
];

export const INITIAL_ALERTS: MetricAlert[] = [
  {
    id: 'alert-1',
    title: 'High GPU VRAM Allocation Warning',
    severity: 'warning',
    service: 'vLLM-Worker-Pod-4',
    metric: 'gpu_memory_used_ratio',
    value: '94.2%',
    threshold: '> 90%',
    time: '5m ago',
    status: 'active',
  },
  {
    id: 'alert-2',
    title: 'Container ExitCode 137 (OOMKilled)',
    severity: 'critical',
    service: 'eval-gsm8k-harness',
    metric: 'pod_container_status_terminated_reason',
    value: 'OOMKilled',
    threshold: '!= 0',
    time: '18m ago',
    status: 'acknowledged',
  },
  {
    id: 'alert-3',
    title: 'P95 Inference Latency Spike',
    severity: 'info',
    service: 'api-gateway',
    metric: 'http_request_duration_seconds{quantile="0.95"}',
    value: '142ms',
    threshold: '> 100ms',
    time: '42m ago',
    status: 'resolved',
  },
];

export const INITIAL_INCIDENT: Incident = {
  id: 'INC-204',
  title: 'Worker Node GPU Thermal Throttling on A100 Cluster',
  severity: 'P2',
  commanderId: 'user-3',
  status: 'monitoring',
  createdAt: '45 minutes ago',
  impact: 'Batch evaluation throughput dropped by 22% on cluster rack us-east-1a.',
  summary: 'Cooling duct fan obstruction on rack 4 caused GPU junction temperature to hit 84C. Karpenter drained 2 worker nodes to preempt hardware failure.',
  timeline: [
    { time: '09:05 AM', note: 'Alertmanager fired GPU_Temperature_Critical on node ip-10-0-4-12', author: 'Prometheus Bot' },
    { time: '09:08 AM', note: 'Incident declared by Marcus Vance. Initiated cordon and node drain.', author: 'Marcus Vance' },
    { time: '09:18 AM', note: 'Karpenter spun up replacement g5.12xlarge on alternative availability zone.', author: 'Alex Rivera' },
    { time: '09:30 AM', note: 'Throughput restored to 1,420 tokens/sec. Monitoring cluster telemetry.', author: 'Sofia Chen' },
  ],
};

export const INITIAL_MODELS: ModelRecord[] = [
  {
    id: 'mod-1',
    name: 'DevPulse-CodeInstruct',
    version: 'v2.4.0',
    architecture: 'Llama-3-8B-Instruct',
    weightsHash: 'sha256:4a8b...19e2',
    format: 'safetensors',
    stage: 'production',
    canarySplitPercent: 90,
    metrics: {
      accuracy: 84.6,
      evalLoss: 1.12,
      latencyP95Ms: 48,
      throughputTokPerSec: 1840,
      rougeL: 0.72,
    },
    lastDeployed: '3 days ago',
  },
  {
    id: 'mod-2',
    name: 'DevPulse-CodeInstruct-Canary',
    version: 'v2.5.0-rc1',
    architecture: 'Llama-3-8B-Instruct (LoRA r=32)',
    weightsHash: 'sha256:9c12...88df',
    format: 'tensorrt-llm',
    stage: 'canary',
    canarySplitPercent: 10,
    metrics: {
      accuracy: 87.2,
      evalLoss: 0.98,
      latencyP95Ms: 38,
      throughputTokPerSec: 2210,
      rougeL: 0.76,
    },
    lastDeployed: '4 hours ago',
  },
  {
    id: 'mod-3',
    name: 'DevPulse-InfraYaml-Parser',
    version: 'v1.1.0',
    architecture: 'Mistral-7B-v0.3',
    weightsHash: 'sha256:77bc...33aa',
    format: 'gguf',
    stage: 'staging',
    canarySplitPercent: 0,
    metrics: {
      accuracy: 79.4,
      evalLoss: 1.45,
      latencyP95Ms: 62,
      throughputTokPerSec: 1250,
      rougeL: 0.68,
    },
    lastDeployed: '1 week ago',
  },
];

export const INITIAL_EXPERIMENTS: ExperimentRun[] = [
  {
    id: 'exp-108',
    name: 'run-lora-r32-lr2e-4-warmup10',
    modelBase: 'Llama-3-8B',
    status: 'completed',
    hyperparameters: {
      learningRate: 0.0002,
      batchSize: 16,
      epochs: 3,
      loraR: 32,
      warmupRatio: 0.1,
      optimizer: 'adamw_torch_fused',
    },
    metrics: {
      valLoss: 0.98,
      perplexity: 2.66,
      evalF1: 87.2,
      gpuMemPeakGb: 64.2,
    },
    durationMin: 184,
    createdAt: 'Yesterday',
  },
  {
    id: 'exp-107',
    name: 'run-lora-r16-lr1e-4-baseline',
    modelBase: 'Llama-3-8B',
    status: 'completed',
    hyperparameters: {
      learningRate: 0.0001,
      batchSize: 16,
      epochs: 3,
      loraR: 16,
      warmupRatio: 0.05,
      optimizer: 'adamw_torch',
    },
    metrics: {
      valLoss: 1.12,
      perplexity: 3.06,
      evalF1: 84.6,
      gpuMemPeakGb: 58.4,
    },
    durationMin: 172,
    createdAt: '3 days ago',
  },
  {
    id: 'exp-109',
    name: 'run-dpo-alignment-epoch1',
    modelBase: 'DevPulse-CodeInstruct-v2.4',
    status: 'running',
    hyperparameters: {
      learningRate: 0.00005,
      batchSize: 8,
      epochs: 2,
      loraR: 64,
      warmupRatio: 0.15,
      optimizer: 'adamw_bnb_8bit',
    },
    metrics: {
      valLoss: 1.04,
      perplexity: 2.82,
      evalF1: 86.0,
      gpuMemPeakGb: 71.0,
    },
    durationMin: 74,
    createdAt: 'Today',
  },
];

export const INITIAL_DATASETS: Dataset[] = [
  {
    id: 'ds-1',
    name: 'DevOps-Playbooks-Synthetics',
    version: 'v3.2',
    totalTokens: '42.8M',
    sampleCount: 125000,
    format: 'Parquet / JsonLines',
    license: 'Apache-2.0',
    split: '90/5/5 (train/val/test)',
    driftStatus: 'nominal',
  },
  {
    id: 'ds-2',
    name: 'Kubernetes-Incident-Postmortems',
    version: 'v1.4',
    totalTokens: '18.4M',
    sampleCount: 48000,
    format: 'JsonLines',
    license: 'MIT',
    split: '80/10/10',
    driftStatus: 'minor_shift',
  },
];

export const INITIAL_GPUS: GpuNode[] = [
  {
    id: 'gpu-node-01',
    name: 'H100-SXM5-Rack-A',
    type: 'NVIDIA H100',
    vramTotalGb: 80,
    vramUsedGb: 68,
    tempC: 62,
    powerW: 410,
    status: 'active',
    currentJobName: 'exp-109: DPO Alignment Fine-Tuning',
    hourlyCostUsd: 3.85,
  },
  {
    id: 'gpu-node-02',
    name: 'A100-80GB-SX-01',
    type: 'NVIDIA A100',
    vramTotalGb: 80,
    vramUsedGb: 74,
    tempC: 67,
    powerW: 320,
    status: 'active',
    currentJobName: 'vLLM Production Inference Pod #1',
    hourlyCostUsd: 2.65,
  },
  {
    id: 'gpu-node-03',
    name: 'A100-80GB-SX-02',
    type: 'NVIDIA A100',
    vramTotalGb: 80,
    vramUsedGb: 34,
    tempC: 54,
    powerW: 240,
    status: 'active',
    currentJobName: 'vLLM Canary 10% Traffic Serving',
    hourlyCostUsd: 2.65,
  },
  {
    id: 'gpu-node-04',
    name: 'L4-TensorCore-01',
    type: 'NVIDIA L4',
    vramTotalGb: 24,
    vramUsedGb: 0,
    tempC: 38,
    powerW: 72,
    status: 'idle',
    hourlyCostUsd: 0.78,
  },
];

export const INITIAL_TRAINING_JOBS: TrainingJob[] = [
  {
    id: 'job-901',
    name: 'DPO Preference Alignment Llama-3-8B',
    modelType: 'Alignment / DPO',
    priority: 'high',
    requestedGpus: 1,
    submittedBy: 'Sofia Chen',
    status: 'running',
    progressPct: 62,
    estimatedHoursRemaining: 1.8,
    preemptible: false,
  },
  {
    id: 'job-902',
    name: 'Kubernetes YAML Synthesizer Pre-train',
    modelType: 'Causal LM / Mistral',
    priority: 'normal',
    requestedGpus: 2,
    submittedBy: 'Dr. Elena Rostova',
    status: 'queued',
    progressPct: 0,
    estimatedHoursRemaining: 6.5,
    preemptible: true,
  },
  {
    id: 'job-903',
    name: 'Terraform Vulnerability Classifier',
    modelType: 'BERT / Classification',
    priority: 'critical',
    requestedGpus: 1,
    submittedBy: 'Alex Rivera',
    status: 'queued',
    progressPct: 0,
    estimatedHoursRemaining: 0.9,
    preemptible: false,
  },
];

export const INITIAL_RUNBOOKS: Runbook[] = [
  {
    id: 'rb-1',
    title: 'Debugging CUDA Out of Memory (OOM) in LoRA Training',
    category: 'AI/MLOps',
    readTimeMin: 4,
    author: 'Elena Rostova',
    lastUpdated: 'Oct 20, 2026',
    content: `### Immediate Checklist for CUDA OOM:
1. **Reduce Batch Size & Double Gradient Accumulation:**
   - If \`per_device_train_batch_size = 16\` fails, set to \`8\` and increase \`gradient_accumulation_steps = 2\`. Effective batch size remains identical.
2. **Enable FlashAttention-2:**
   - Pass \`attn_implementation="flash_attention_2"\` to \`from_pretrained()\`.
3. **Turn on Gradient Checkpointing:**
   - \`model.gradient_checkpointing_enable()\` saves ~40% VRAM at the cost of ~20% compute re-computation.
4. **Use 8-Bit AdamW Optimizer:**
   - \`optim="paged_adamw_8bit"\` moves optimizer states to CPU when VRAM spikes.`,
  },
  {
    id: 'rb-2',
    title: 'Graceful Handling of AWS Spot Node Preemption with Karpenter',
    category: 'DevOps',
    readTimeMin: 5,
    author: 'Alex Rivera',
    lastUpdated: 'Oct 24, 2026',
    content: `### Spot Interruption Sequence:
1. AWS sends a 2-minute notice via EventBridge.
2. Karpenter intercepts notice and begins draining pods immediately.
3. Use \`preStop\` lifecycle hook to save checkpoint weights to S3 before container SIGTERM.
\`\`\`yaml
lifecycle:
  preStop:
    exec:
      command: ["python", "-m", "devpulse.save_checkpoint"]
\`\`\``,
  },
  {
    id: 'rb-3',
    title: 'Terraform State Drift Remediation Without Downtime',
    category: 'DevOps',
    readTimeMin: 3,
    author: 'Marcus Vance',
    lastUpdated: 'Oct 15, 2026',
    content: `### Steps to Reconcile Out-of-Band Changes:
1. Run \`terraform plan -refresh-only\` to identify actual cloud resources without mutating state.
2. Check if drift was an automated scaling event or an unauthorized manual change.
3. Import or adopt state with \`terraform apply -refresh-only\`.`,
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    timestamp: '10:42:15 AM',
    user: 'Alex Rivera (Junior DevOps)',
    action: 'Triggered Rollback to pipe-840 (v1.3.9)',
    target: 'EKS staging/vllm-deployment',
    ip: '192.168.1.45',
    category: 'deploy',
  },
  {
    id: 'aud-2',
    timestamp: '10:35:02 AM',
    user: 'Sofia Chen (Junior AI Developer)',
    action: 'Promoted Checkpoint #108 to Canary 10%',
    target: 'ModelRegistry:DevPulse-CodeInstruct',
    ip: '192.168.1.18',
    category: 'model',
  },
  {
    id: 'aud-3',
    timestamp: '10:14:50 AM',
    user: 'Marcus Vance (DevOps Lead)',
    action: 'Acknowledged Incident INC-204',
    target: 'Cluster Rack 4 GPU Alert',
    ip: '10.0.1.2',
    category: 'infra',
  },
  {
    id: 'aud-4',
    timestamp: '09:48:12 AM',
    user: 'Liam Patel (Security)',
    action: 'Granted temporary IAM breakglass to user-1',
    target: 'AWS KMS Key: devpulse-weights-enc',
    ip: '10.0.8.99',
    category: 'rbac',
  },
];
