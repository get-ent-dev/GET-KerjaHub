import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyAutomationRules,
  calculateDoraMetrics,
  calculateGpuMetrics,
  calculateSkillMatchScore,
  type AutomationRule,
  type DeploymentRecord,
  type GpuInstance,
} from './devpulse-logic';

test('applyAutomationRules assigns member and adds tags on keyword match', () => {
  const rules: AutomationRule[] = [
    {
      id: 'rule-1',
      name: 'GPU Task Auto-Assignment',
      keyword: 'cuda',
      assignToMemberId: 'user-mlops',
      addTags: ['AI/ML', 'GPU-Compute'],
      setPriority: 'high',
    },
    {
      id: 'rule-2',
      name: 'Terraform IaC Rule',
      keyword: 'terraform',
      assignToMemberId: 'user-devops',
      addTags: ['Infrastructure', 'IaC'],
    },
  ];

  const task = {
    title: 'Fix CUDA OOM in batch size 32 evaluation',
    description: 'We encountered out of memory during validation step',
    tags: ['Bug'],
  };

  const result = applyAutomationRules(task, rules);
  assert.equal(result.assigneeId, 'user-mlops');
  assert.equal(result.priority, 'high');
  assert.ok(result.tags.includes('AI/ML'));
  assert.ok(result.tags.includes('GPU-Compute'));
  assert.ok(result.tags.includes('Bug'));
});

test('calculateDoraMetrics correctly classifies elite/high metrics and MTTR', () => {
  const deployments: DeploymentRecord[] = [
    { id: 'd-1', timestamp: Date.now() - 100000, status: 'success', leadTimeMinutes: 30 },
    { id: 'd-2', timestamp: Date.now() - 80000, status: 'success', leadTimeMinutes: 25 },
    { id: 'd-3', timestamp: Date.now() - 60000, status: 'success', leadTimeMinutes: 40 },
    { id: 'd-4', timestamp: Date.now() - 40000, status: 'failed', leadTimeMinutes: 45, recoveryTimeMinutes: 20 },
    { id: 'd-5', timestamp: Date.now() - 20000, status: 'success', leadTimeMinutes: 35 },
  ];

  const metrics = calculateDoraMetrics(deployments, 7); // 5 deploys in 7 days = 5/wk
  assert.equal(metrics.deploymentFrequencyPerWeek, 5);
  assert.equal(metrics.changeFailureRatePercentage, 20); // 1 out of 5 = 20%
  assert.equal(metrics.meanTimeToRecoveryMinutes, 20);
  assert.equal(metrics.medianLeadTimeMinutes, 35);
});

test('calculateGpuMetrics aggregates VRAM utilization and hourly cost', () => {
  const nodes: GpuInstance[] = [
    { id: 'g-1', type: 'NVIDIA H100', hourlyRate: 3.5, totalVramGb: 80, allocatedVramGb: 60, status: 'active' },
    { id: 'g-2', type: 'NVIDIA A100', hourlyRate: 2.5, totalVramGb: 80, allocatedVramGb: 40, status: 'active' },
    { id: 'g-3', type: 'NVIDIA L4', hourlyRate: 0.8, totalVramGb: 24, allocatedVramGb: 0, status: 'idle' },
  ];

  const summary = calculateGpuMetrics(nodes);
  assert.equal(summary.totalNodes, 3);
  assert.equal(summary.activeNodes, 2);
  assert.equal(summary.totalVramGb, 184);
  assert.equal(summary.allocatedVramGb, 100);
  assert.equal(summary.hourlyCostUsd, 6.8);
  assert.ok(summary.projectedMonthlyCostUsd > 4000);
});

test('calculateSkillMatchScore measures overlap between task tags and member skills', () => {
  const tags = ['Kubernetes', 'Helm', 'Docker'];
  const memberSkills = ['kubernetes', 'helm', 'terraform', 'aws'];
  const score = calculateSkillMatchScore(tags, memberSkills);
  assert.ok(score >= 66);
});
