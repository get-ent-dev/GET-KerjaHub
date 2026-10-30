/**
 * Pure business logic functions for DevPulse Project Management System.
 * Fully decoupled from UI for deterministic testing and ultra-fast verification.
 */

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  assigneeId?: string;
  storyPoints: number;
  timeSpentMinutes: number;
  dependencies: string[];
  customFields?: Record<string, string>;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  skills: string[];
  maxCapacityPoints: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  keyword: string;
  assignToMemberId: string;
  addTags: string[];
  setPriority?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Evaluates automation rules on a task title & description.
 */
export function applyAutomationRules(
  task: Partial<Task>,
  rules: AutomationRule[]
): { assigneeId?: string; tags: string[]; priority?: Task['priority'] } {
  const text = `${task.title || ''} ${task.description || ''}`.toLowerCase();
  let updatedAssignee = task.assigneeId;
  const tagSet = new Set<string>(task.tags || []);
  let updatedPriority = task.priority;

  for (const rule of rules) {
    if (text.includes(rule.keyword.toLowerCase())) {
      if (!updatedAssignee) {
        updatedAssignee = rule.assignToMemberId;
      }
      rule.addTags.forEach((t) => tagSet.add(t));
      if (rule.setPriority && (!updatedPriority || updatedPriority === 'low' || updatedPriority === 'medium')) {
        updatedPriority = rule.setPriority;
      }
    }
  }

  return {
    assigneeId: updatedAssignee,
    tags: Array.from(tagSet),
    priority: updatedPriority,
  };
}

/**
 * Calculates DORA Metrics from deployment records.
 */
export interface DeploymentRecord {
  id: string;
  timestamp: number; // epoch ms
  status: 'success' | 'failed' | 'rolled_back';
  leadTimeMinutes: number;
  recoveryTimeMinutes?: number;
}

export interface DoraMetrics {
  deploymentFrequencyPerWeek: number;
  medianLeadTimeMinutes: number;
  changeFailureRatePercentage: number;
  meanTimeToRecoveryMinutes: number;
  performanceTier: 'Elite' | 'High' | 'Medium' | 'Low';
}

export function calculateDoraMetrics(
  deployments: DeploymentRecord[],
  windowDays: number = 30
): DoraMetrics {
  if (deployments.length === 0) {
    return {
      deploymentFrequencyPerWeek: 0,
      medianLeadTimeMinutes: 0,
      changeFailureRatePercentage: 0,
      meanTimeToRecoveryMinutes: 0,
      performanceTier: 'Low',
    };
  }

  const failedDeployments = deployments.filter(
    (d) => d.status === 'failed' || d.status === 'rolled_back'
  );
  const failureRate = (failedDeployments.length / deployments.length) * 100;

  const leadTimes = [...deployments].map((d) => d.leadTimeMinutes).sort((a, b) => a - b);
  const mid = Math.floor(leadTimes.length / 2);
  const medianLeadTime =
    leadTimes.length % 2 !== 0
      ? leadTimes[mid]
      : (leadTimes[mid - 1] + leadTimes[mid]) / 2;

  const recoveryTimes = failedDeployments
    .map((d) => d.recoveryTimeMinutes || 0)
    .filter((t) => t > 0);
  const mttr =
    recoveryTimes.length > 0
      ? recoveryTimes.reduce((acc, t) => acc + t, 0) / recoveryTimes.length
      : 0;

  const deploymentsPerWeek = Number(((deployments.length / windowDays) * 7).toFixed(1));

  let tier: DoraMetrics['performanceTier'] = 'Low';
  if (deploymentsPerWeek >= 7 && medianLeadTime <= 60 && failureRate < 5 && mttr <= 60) {
    tier = 'Elite';
  } else if (deploymentsPerWeek >= 1 && medianLeadTime <= 1440 && failureRate <= 15) {
    tier = 'High';
  } else if (deploymentsPerWeek >= 0.25) {
    tier = 'Medium';
  }

  return {
    deploymentFrequencyPerWeek: deploymentsPerWeek,
    medianLeadTimeMinutes: Math.round(medianLeadTime),
    changeFailureRatePercentage: Number(failureRate.toFixed(1)),
    meanTimeToRecoveryMinutes: Math.round(mttr),
    performanceTier: tier,
  };
}

/**
 * Calculates GPU Cluster utilization and hourly/monthly cost.
 */
export interface GpuInstance {
  id: string;
  type: 'NVIDIA H100' | 'NVIDIA A100' | 'NVIDIA L4' | 'NVIDIA T4';
  hourlyRate: number;
  totalVramGb: number;
  allocatedVramGb: number;
  status: 'active' | 'idle' | 'preempted' | 'maintenance';
}

export function calculateGpuMetrics(nodes: GpuInstance[]): {
  totalNodes: number;
  activeNodes: number;
  totalVramGb: number;
  allocatedVramGb: number;
  vramUtilizationPct: number;
  hourlyCostUsd: number;
  projectedMonthlyCostUsd: number;
} {
  if (nodes.length === 0) {
    return {
      totalNodes: 0,
      activeNodes: 0,
      totalVramGb: 0,
      allocatedVramGb: 0,
      vramUtilizationPct: 0,
      hourlyCostUsd: 0,
      projectedMonthlyCostUsd: 0,
    };
  }

  const activeNodes = nodes.filter((n) => n.status === 'active').length;
  const totalVram = nodes.reduce((sum, n) => sum + n.totalVramGb, 0);
  const allocatedVram = nodes.reduce((sum, n) => sum + n.allocatedVramGb, 0);
  const hourlyCost = nodes
    .filter((n) => n.status === 'active' || n.status === 'idle')
    .reduce((sum, n) => sum + n.hourlyRate, 0);

  const vramUtilizationPct = totalVram > 0 ? (allocatedVram / totalVram) * 100 : 0;
  const projectedMonthly = hourlyCost * 24 * 30.5;

  return {
    totalNodes: nodes.length,
    activeNodes,
    totalVramGb: totalVram,
    allocatedVramGb: allocatedVram,
    vramUtilizationPct: Number(vramUtilizationPct.toFixed(1)),
    hourlyCostUsd: Number(hourlyCost.toFixed(2)),
    projectedMonthlyCostUsd: Number(projectedMonthly.toFixed(2)),
  };
}

/**
 * Calculates workload balancing score & skill match score for task assignment.
 */
export function calculateSkillMatchScore(
  taskTags: string[],
  memberSkills: string[]
): number {
  if (taskTags.length === 0 || memberSkills.length === 0) return 50;

  const normalizedSkills = new Set(memberSkills.map((s) => s.toLowerCase()));
  let matches = 0;

  for (const tag of taskTags) {
    const normTag = tag.toLowerCase();
    if (
      normalizedSkills.has(normTag) ||
      Array.from(normalizedSkills).some(
        (sk) => sk.includes(normTag) || normTag.includes(sk)
      )
    ) {
      matches++;
    }
  }

  const score = Math.min(100, Math.round((matches / taskTags.length) * 100));
  return score === 0 ? 30 : score;
}
