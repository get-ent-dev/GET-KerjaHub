'use client';

import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  Key,
  Users,
} from 'lucide-react';
import { AuditLogItem } from '@/types/devpulse';

interface SecurityRbacProps {
  auditLogs: AuditLogItem[];
}

export function SecurityRbac({ auditLogs }: SecurityRbacProps) {
  const [activeTab, setActiveTab] = useState<'rbac' | 'audit' | 'compliance'>('rbac');
  const [auditSearch, setAuditSearch] = useState('');

  const [roles, setRoles] = useState([
    {
      role: 'DevOps Lead',
      description: 'Full cluster control, secret rotation, production deploys, and rollback authority.',
      permissions: ['Deploy Production', 'Manage Cloud IAM', 'Modify IaC State', 'Drain Nodes', 'Manage RBAC'],
    },
    {
      role: 'MLOps Engineer',
      description: 'Model registry promotion, A/B canary split changes, GPU queue prioritization.',
      permissions: ['Deploy Canary', 'Access GPU Cluster', 'Modify Hyperparameters', 'Read Staging Logs'],
    },
    {
      role: 'Junior DevOps',
      description: 'Deploy to development & staging, write Terraform PRs, view cluster metrics.',
      permissions: ['Deploy Dev/Staging', 'Run CI/CD Pipelines', 'View IaC Diff', 'Acknowledge Alerts'],
    },
    {
      role: 'Junior AI Developer',
      description: 'Train models, submit jobs, run evaluation benchmarks, log experiment metrics.',
      permissions: ['Submit Training Jobs', 'Read Datasets', 'View Checkpoints', 'Inspect Model Logs'],
    },
  ]);

  const complianceChecklist = [
    { title: 'SOC 2 Type II: Encrypted At-Rest Weights (KMS AES-256)', status: 'compliant' },
    { title: 'ISO 27001: Immutable Audit Trail for Production Rollbacks', status: 'compliant' },
    { title: 'Zero-Trust: Ephemeral IAM Tokens via GitHub OIDC', status: 'compliant' },
    { title: 'Automated Container Vulnerability Gate (Trivy CVE blocker)', status: 'compliant' },
    { title: 'Disaster Recovery: S3 Multi-Region Checkpoint Replication', status: 'in_progress' },
  ];

  const filteredAuditLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.target.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Security, Granular RBAC & Compliance
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>Role-Based Access Control</span>
            <span aria-hidden="true">·</span>
            <span>Immutable Audit Logging</span>
            <span aria-hidden="true">·</span>
            <span>SSO Identity Integration</span>
            <span aria-hidden="true">·</span>
            <span>SOC 2 & ISO 27001 Readiness</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'rbac' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            RBAC Roles
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Audit Log Trail
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'compliance' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Compliance Checklist
          </button>
        </div>
      </div>

      {/* Tab 1: RBAC */}
      {activeTab === 'rbac' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((r) => (
            <div key={r.role} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">{r.role}</h3>
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700">
                  {r.permissions.length} Permissions
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{r.description}</p>

              <div>
                <span className="text-xs font-medium text-slate-500 block mb-1.5">
                  Allowed Capabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {r.permissions.map((p) => (
                    <span
                      key={p}
                      className="text-xs bg-slate-50 border border-slate-200 text-slate-800 px-2 py-0.5 rounded"
                    >
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Immutable System Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Cryptographically hashed audit events logged across deployments, IAM, and model registry changes.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-medium">Timestamp</th>
                  <th className="py-2.5 px-3 font-medium">User Account</th>
                  <th className="py-2.5 px-3 font-medium">Action Performed</th>
                  <th className="py-2.5 px-3 font-medium">Target Resource</th>
                  <th className="py-2.5 px-3 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{log.user}</td>
                    <td className="py-2.5 px-3">{log.action}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{log.target}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Compliance Checklist */}
      {activeTab === 'compliance' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 max-w-2xl">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-semibold text-slate-900">
              Enterprise Compliance & Security Posture
            </h3>
            <p className="text-xs text-slate-500">
              Readiness tracking for ISO 27001, SOC 2 Type II, and data boundary validations.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {complianceChecklist.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  {item.status === 'compliant' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className="font-medium text-slate-800">{item.title}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                    item.status === 'compliant'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {item.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
