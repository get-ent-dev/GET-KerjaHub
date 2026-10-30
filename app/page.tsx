'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Kanban,
  Server,
  Cpu,
  Users,
  Zap,
  TrendingUp,
  Shield,
  Sparkles,
  Play,
  Clock,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { KanbanBoard } from '@/components/KanbanBoard';
import { ProjectsOverview } from '@/components/ProjectsOverview';
import { DevOpsStudio } from '@/components/DevOpsStudio';
import { AiMlOpsLab } from '@/components/AiMlOpsLab';
import { CollaborationView } from '@/components/CollaborationView';
import { IntegrationsAndAutomations } from '@/components/IntegrationsAndAutomations';
import { AnalyticsReporting } from '@/components/AnalyticsReporting';
import { SecurityRbac } from '@/components/SecurityRbac';
import { AiCopilotModal } from '@/components/AiCopilotModal';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { AlertsDrawer } from '@/components/AlertsDrawer';

import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MEMBERS,
  INITIAL_RULES,
  INITIAL_PIPELINES,
  INITIAL_IAC_RESOURCES,
  INITIAL_ALERTS,
  INITIAL_INCIDENT,
  INITIAL_MODELS,
  INITIAL_EXPERIMENTS,
  INITIAL_DATASETS,
  INITIAL_GPUS,
  INITIAL_TRAINING_JOBS,
  INITIAL_RUNBOOKS,
  INITIAL_AUDIT_LOGS,
} from '@/lib/mock-data';

import {
  Project,
  Task,
  TaskStatus,
  DeploymentPipeline,
  IaCResource,
  MetricAlert,
  Incident,
  ModelRecord,
  ExperimentRun,
  TrainingJob,
  AuditLogItem,
} from '@/types/devpulse';
import { AutomationRule, applyAutomationRules } from '@/lib/devpulse-logic';

export default function Home() {
  // Navigation
  const [activeNav, setActiveNav] = useState<
    'kanban' | 'projects' | 'devops' | 'ai_mlops' | 'collaboration' | 'integrations' | 'analytics' | 'security'
  >('kanban');

  // Core entities state
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(INITIAL_PROJECTS[0].id);
  const [activeEnv, setActiveEnv] = useState<'production' | 'staging' | 'dev'>('staging');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [pipelines, setPipelines] = useState<DeploymentPipeline[]>(INITIAL_PIPELINES);
  const [iacResources, setIacResources] = useState<IaCResource[]>(INITIAL_IAC_RESOURCES);
  const [alerts, setAlerts] = useState<MetricAlert[]>(INITIAL_ALERTS);
  const [incident, setIncident] = useState<Incident>(INITIAL_INCIDENT);
  const [models, setModels] = useState<ModelRecord[]>(INITIAL_MODELS);
  const [experiments, setExperiments] = useState<ExperimentRun[]>(INITIAL_EXPERIMENTS);
  const [datasets] = useState(INITIAL_DATASETS);
  const [gpus, setGpus] = useState(INITIAL_GPUS);
  const [jobs, setJobs] = useState<TrainingJob[]>(INITIAL_TRAINING_JOBS);
  const [runbooks] = useState(INITIAL_RUNBOOKS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Time tracking state
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | undefined>('task-101');
  const [timerSeconds, setTimerSeconds] = useState(185 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Modals state
  const [taskDetailModalTask, setTaskDetailModalTask] = useState<Task | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskDefaultStatus, setCreateTaskDefaultStatus] = useState<TaskStatus>('backlog');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInitialMode, setCopilotInitialMode] = useState('task_breakdown');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // Timer interval
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const showNotification = (msg: string) => {
    setNotificationBanner(msg);
    setTimeout(() => setNotificationBanner(null), 3500);
  };

  // Timer actions
  const handleToggleTimer = (task?: Task) => {
    if (task) {
      if (activeTimerTaskId === task.id) {
        setIsTimerRunning(!isTimerRunning);
      } else {
        setActiveTimerTaskId(task.id);
        setTimerSeconds(task.timeSpentMinutes * 60);
        setIsTimerRunning(true);
        showNotification(`Started IDE time tracking on: "${task.title}"`);
      }
    } else {
      setIsTimerRunning(!isTimerRunning);
    }
  };

  // Task handlers
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    showNotification(`Task status updated to ${newStatus.replace('_', ' ')}`);
  };

  const handleUpdateTask = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    showNotification(`Updated task "${updated.title}"`);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showNotification(`Deleted task ${taskId}`);
  };

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now().toString().slice(-4)}`,
      projectId: taskData.projectId || selectedProjectId,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'backlog',
      priority: taskData.priority || 'medium',
      tags: taskData.tags || ['AI/ML'],
      storyPoints: taskData.storyPoints || 3,
      timeSpentMinutes: 0,
      dependencies: taskData.dependencies || [],
      subtasks: taskData.subtasks || [],
      customFields: taskData.customFields || {},
      assigneeId: taskData.assigneeId,
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: taskData.dueDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    };

    setTasks((prev) => [newTask, ...prev]);
    showNotification(`Created new task: "${newTask.title}"`);
  };

  // Auto assign rule evaluator
  const handleAutoAssign = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const result = applyAutomationRules(task, automationRules);
    if (result.assigneeId) {
      const assignedMember = members.find((m) => m.id === result.assigneeId);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                assigneeId: result.assigneeId,
                tags: result.tags,
                priority: result.priority || t.priority,
              }
            : t
        )
      );
      showNotification(
        `Auto-assigned to ${assignedMember?.name} based on keyword rule match.`
      );
    } else {
      showNotification('No matching keyword automation rule found for this task.');
    }
  };

  // Project handlers
  const handleCreateProject = (projectData: Partial<Project>) => {
    const newProj: Project = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      name: projectData.name || 'New Project',
      key: projectData.key || 'NEW',
      description: projectData.description || '',
      category: projectData.category || 'AI/ML',
      tags: projectData.tags || [],
      status: 'active',
      health: 'healthy',
      leadId: 'user-1',
      progressPct: 0,
      subProjects: projectData.subProjects || [],
      linkedProjectIds: [],
      repoUrl: projectData.repoUrl || 'https://github.com/devpulse/repo',
      environment: projectData.environment || 'staging',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProjects((prev) => [...prev, newProj]);
    setSelectedProjectId(newProj.id);
    showNotification(`Created project "${newProj.name}" [${newProj.key}]`);
  };

  // Pipeline execution simulation
  const handleRunPipeline = () => {
    const newRunNumber = pipelines[0].runNumber + 1;
    const newPipe: DeploymentPipeline = {
      id: `pipe-${newRunNumber}`,
      projectId: selectedProjectId,
      runNumber: newRunNumber,
      branch: 'main',
      commitSha: Math.random().toString(16).substring(2, 9),
      commitMsg: 'ci(pipeline): trigger automated validation and canary deploy',
      author: 'Junior Developer',
      status: 'running',
      durationSeconds: 15,
      startedAt: 'Just now',
      stages: [
        {
          name: 'Lint & Format',
          status: 'success',
          durationMs: 4000,
          logs: ['ruff check . --fix ... PASS', 'black --check . ... OK'],
        },
        {
          name: 'Unit Tests',
          status: 'success',
          durationMs: 8000,
          logs: ['pytest tests/ -q ... 84 passed in 7.8s'],
        },
        {
          name: 'Docker Build',
          status: 'running',
          durationMs: 3000,
          logs: ['Building container layer 4/8... cache hit'],
        },
        {
          name: 'CVE Security Scan',
          status: 'pending',
          durationMs: 0,
          logs: [],
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
    };

    setPipelines([newPipe, ...pipelines]);
    showNotification(`Started CI/CD Pipeline #${newRunNumber}`);

    // Simulate completion
    setTimeout(() => {
      setPipelines((prev) =>
        prev.map((p) =>
          p.id === newPipe.id
            ? {
                ...p,
                status: 'success',
                stages: p.stages.map((s) => ({
                  ...s,
                  status: 'success',
                  durationMs: s.durationMs || 5000,
                  logs: s.logs.length > 0 ? s.logs : ['Stage executed successfully with 0 errors.'],
                })),
              }
            : p
        )
      );
      showNotification(`CI/CD Pipeline #${newRunNumber} completed successfully!`);
    }, 2500);
  };

  // 1-Click Rollback handler
  const handleRollback = (pipelineId: string) => {
    const target = pipelines.find((p) => p.id === pipelineId);
    showNotification(`Rollback executed! Restored deployment to stable target.`);

    // Record immutable audit entry
    const newAudit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      user: 'You (Junior DevOps & AI)',
      action: `Executed 1-Click Rollback to pipeline #${target?.runNumber || 'prev'}`,
      target: 'EKS cluster pods',
      ip: '192.168.1.102',
      category: 'deploy',
    };
    setAuditLogs([newAudit, ...auditLogs]);
  };

  // IaC drift check simulator
  const handleDriftCheck = (resourceId: string) => {
    setIacResources((prev) =>
      prev.map((r) =>
        r.id === resourceId
          ? {
              ...r,
              driftStatus: 'in_sync',
              lastApplied: 'Just now (Reconciled)',
            }
          : r
      )
    );
    showNotification(`Terraform state refreshed: Resource ${resourceId} is now in sync.`);
  };

  // Alerts
  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'acknowledged' } : a))
    );
    showNotification(`Acknowledged alert ${id}`);
  };

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a))
    );
    showNotification(`Resolved alert ${id}`);
  };

  // MLOps
  const handleUpdateCanarySplit = (modelId: string, splitPct: number) => {
    setModels((prev) =>
      prev.map((m) => (m.id === modelId ? { ...m, canarySplitPercent: splitPct } : m))
    );
  };

  const handleSubmitTrainingJob = (jobData: Partial<TrainingJob>) => {
    const newJob: TrainingJob = {
      id: `job-${Date.now().toString().slice(-4)}`,
      name: jobData.name || 'Fine-Tuning Run',
      modelType: jobData.modelType || 'LoRA / PyTorch',
      priority: jobData.priority || 'normal',
      requestedGpus: jobData.requestedGpus || 1,
      submittedBy: jobData.submittedBy || 'Junior AI Dev',
      status: 'running',
      progressPct: 5,
      estimatedHoursRemaining: 3.2,
      preemptible: !!jobData.preemptible,
    };

    setJobs([newJob, ...jobs]);
    showNotification(`Submitted GPU Training Job: "${newJob.name}"`);
  };

  const handleCancelTrainingJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'cancelled' } : j))
    );
    showNotification(`Cancelled job ${jobId}`);
  };

  const activeTimerTask = tasks.find((t) => t.id === activeTimerTaskId) || null;
  const unreadAlerts = alerts.filter((a) => a.status !== 'resolved').length;
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Toast Notification Banner */}
      {notificationBanner && (
        <div className="fixed top-3 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationBanner}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        activeEnv={activeEnv}
        onChangeEnv={setActiveEnv}
        activeTimerTask={activeTimerTask}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        onToggleTimer={() => handleToggleTimer()}
        onOpenCreateTask={() => {
          setCreateTaskDefaultStatus('backlog');
          setIsCreateTaskOpen(true);
        }}
        onOpenCreateProject={() => setIsCreateProjectOpen(true)}
        onOpenCopilot={(mode) => {
          setCopilotInitialMode(mode || 'task_breakdown');
          setIsCopilotOpen(true);
        }}
        unreadAlertCount={unreadAlerts}
        onOpenAlerts={() => setIsAlertsOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col space-y-6">
        {/* Workspace Navigation Bar */}
        <nav className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveNav('kanban')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeNav === 'kanban'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Task Kanban</span>
          </button>

          <button
            onClick={() => setActiveNav('projects')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeNav === 'projects'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Projects & Hierarchy</span>
          </button>

          <button
            onClick={() => setActiveNav('devops')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeNav === 'devops'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>DevOps & IaC Studio</span>
          </button>

          <button
            onClick={() => setActiveNav('ai_mlops')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeNav === 'ai_mlops'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AI & MLOps Lab</span>
          </button>

          <button
            onClick={() => setActiveNav('collaboration')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeNav === 'collaboration'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team & Runbooks</span>
          </button>

          <button
            onClick={() => setActiveNav('integrations')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeNav === 'integrations'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Integrations & Rules</span>
          </button>

          <button
            onClick={() => setActiveNav('analytics')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeNav === 'analytics'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>DORA & Analytics</span>
          </button>

          <button
            onClick={() => setActiveNav('security')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeNav === 'security'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>RBAC & Security</span>
          </button>
        </nav>

        {/* View Switcher Container */}
        <main className="flex-1">
          {activeNav === 'kanban' && (
            <KanbanBoard
              tasks={tasks}
              members={members}
              selectedProjectId={selectedProjectId}
              automationRules={automationRules}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onOpenTaskDetail={(t) => setTaskDetailModalTask(t)}
              onOpenCreateTask={(col) => {
                setCreateTaskDefaultStatus(col || 'backlog');
                setIsCreateTaskOpen(true);
              }}
              onAutoAssign={handleAutoAssign}
              activeTimerTaskId={activeTimerTaskId}
              onToggleTimer={handleToggleTimer}
            />
          )}

          {activeNav === 'projects' && (
            <ProjectsOverview
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={(id) => {
                setSelectedProjectId(id);
                setActiveNav('kanban');
              }}
              onOpenCreateProject={() => setIsCreateProjectOpen(true)}
              onOpenTemplate={(name) => {
                showNotification(`Applied project template: "${name}"`);
                setIsCreateProjectOpen(true);
              }}
            />
          )}

          {activeNav === 'devops' && (
            <DevOpsStudio
              pipelines={pipelines}
              iacResources={iacResources}
              alerts={alerts}
              incident={incident}
              activeEnv={activeEnv}
              onRunPipeline={handleRunPipeline}
              onRollback={handleRollback}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onResolveAlert={handleResolveAlert}
              onTriggerDriftCheck={handleDriftCheck}
            />
          )}

          {activeNav === 'ai_mlops' && (
            <AiMlOpsLab
              models={models}
              experiments={experiments}
              datasets={datasets}
              gpus={gpus}
              jobs={jobs}
              onUpdateCanarySplit={handleUpdateCanarySplit}
              onSubmitTrainingJob={handleSubmitTrainingJob}
              onCancelTrainingJob={handleCancelTrainingJob}
              onOpenCopilot={(m) => {
                setCopilotInitialMode(m || 'mlops_advisor');
                setIsCopilotOpen(true);
              }}
            />
          )}

          {activeNav === 'collaboration' && (
            <CollaborationView
              members={members}
              runbooks={runbooks}
            />
          )}

          {activeNav === 'integrations' && (
            <IntegrationsAndAutomations
              automationRules={automationRules}
              members={members}
              onAddRule={(rule) => {
                setAutomationRules([...automationRules, rule]);
                showNotification(`Added automation rule: "${rule.name}"`);
              }}
              onTestRule={(rule) => {
                showNotification(`Rule "${rule.name}" triggered: matched 2 active tasks.`);
              }}
            />
          )}

          {activeNav === 'analytics' && <AnalyticsReporting />}

          {activeNav === 'security' && <SecurityRbac auditLogs={auditLogs} />}
        </main>
      </div>

      {/* Interactive Modals */}
      <AiCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        initialMode={copilotInitialMode}
        projectContext={`Active Project: ${currentProject.name} (${currentProject.category})`}
      />

      <TaskDetailModal
        task={taskDetailModalTask}
        allTasks={tasks}
        members={members}
        onClose={() => setTaskDetailModalTask(null)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        activeTimerTaskId={activeTimerTaskId}
        onToggleTimer={handleToggleTimer}
      />

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        projects={projects}
        selectedProjectId={selectedProjectId}
        members={members}
        automationRules={automationRules}
        defaultStatus={createTaskDefaultStatus}
        onCreateTask={handleCreateTask}
      />

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        incident={incident}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onResolveAlert={handleResolveAlert}
      />
    </div>
  );
}
