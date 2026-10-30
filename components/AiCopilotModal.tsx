'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Terminal,
  Cpu,
  Shield,
  Send,
  Loader2,
  Copy,
  Check,
  CheckCircle2,
} from 'lucide-react';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: string;
  projectContext?: string;
}

export function AiCopilotModal({
  isOpen,
  onClose,
  initialMode = 'task_breakdown',
  projectContext,
}: AiCopilotModalProps) {
  const [mode, setMode] = useState<string>(initialMode);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const quickPrompts: Record<string, string[]> = {
    task_breakdown: [
      'Break down implementing vLLM P95 latency exporter and Grafana dashboard',
      'Create subtasks for migrating spot GPU cluster to Karpenter on AWS EKS',
      'Break down training LoRA adapter on Llama-3-8B with FlashAttention-2',
    ],
    incident_diagnose: [
      'Analyze ExitCode 137 (OOMKilled) in eval-gsm8k-harness pod during batch loss step',
      'Diagnose GPU thermal throttling alert reaching 84C on rack 4',
      'Kubernetes ingress gateway returning 504 Gateway Timeout during peak traffic',
    ],
    mlops_advisor: [
      'Recommend optimal learning rate and warmup ratio for LoRA rank 32 on Llama-3-8B',
      'How to eliminate CUDA out of memory when fine-tuning with 4k context tokens',
      'Compare TensorRT-LLM vs vLLM throughput for FP8 quantization serving',
    ],
    iac_review: [
      'Review Terraform Karpenter NodePool configuration for spot instance security',
      'Identify potential drift or security risks in our AWS security group rules',
    ],
  };

  const handleRunAi = async (queryText?: string) => {
    const activePrompt = queryText || prompt;
    if (!activePrompt.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          prompt: activePrompt,
          context: projectContext || 'Junior DevOps & AI Developer Workstation',
        }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setResponse('### Error contacting AI assistance API.\n\nPlease check network connectivity or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                DevPulse AI Developer Copilot
              </h3>
              <p className="text-xs text-slate-500">
                Specialized guidance for Junior DevOps & AI developers powered by Gemini
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-3 border-b border-slate-100 flex items-center gap-1 overflow-x-auto bg-white text-xs font-medium">
          <button
            onClick={() => {
              setMode('task_breakdown');
              setResponse(null);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              mode === 'task_breakdown'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Task Breakdown
          </button>
          <button
            onClick={() => {
              setMode('incident_diagnose');
              setResponse(null);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              mode === 'incident_diagnose'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Incident Root Cause
          </button>
          <button
            onClick={() => {
              setMode('mlops_advisor');
              setResponse(null);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              mode === 'mlops_advisor'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            MLOps & GPU Advisor
          </button>
          <button
            onClick={() => {
              setMode('iac_review');
              setResponse(null);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              mode === 'iac_review'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            IaC Terraform Review
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Quick Prompts */}
          <div>
            <span className="text-slate-400 font-medium block mb-1.5">
              Suggested queries for Junior Developers:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(quickPrompts[mode] || []).map((qp, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(qp);
                    handleRunAi(qp);
                  }}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 rounded text-left transition-colors truncate max-w-full"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Display */}
          {loading && (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-indigo-600" />
              <p>Analyzing technical parameters and formulating engineering recommendation...</p>
            </div>
          )}

          {response && !loading && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:text-slate-900 shadow-2xs"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <div className="prose prose-slate max-w-none text-xs leading-relaxed whitespace-pre-wrap font-sans text-slate-800">
                {response}
              </div>
            </div>
          )}
        </div>

        {/* Footer Input */}
        <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
          <input
            type="text"
            placeholder="Ask AI Copilot for advice, bash commands, or configurations..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRunAi();
            }}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
          <button
            onClick={() => handleRunAi()}
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Ask</span>
          </button>
        </div>
      </div>
    </div>
  );
}
