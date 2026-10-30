import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { mode, context, prompt } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    // High quality deterministic fallbacks if API key is not configured or offline
    const getFallback = (m: string) => {
      switch (m) {
        case 'task_breakdown':
          return `### Suggested Junior DevOps & AI Subtasks:
1. **Environment & Dependency Lock**: Pin CUDA 12.4, PyTorch 2.5, and FlashAttention-2 in \`requirements.txt\` and Dockerfile.
2. **IaC & Resource Provisioning**: Define Karpenter NodePool with GPU spot instance tolerances and interruption handler.
3. **Automated Validation Pipeline**: Write Pytest unit test checking tensor shapes and memory footprint before training loop start.
4. **Monitoring & Latency Probe**: Add Prometheus metric exporter for P95 latency and tokens/sec throughput.
5. **Documentation & Runbook**: Update internal wiki with OOM recovery steps and checkpoint restore commands.

**Estimated Story Points:** 5 points (~2-3 days).
**Recommended Tags:** AI/ML, Infrastructure, PyTorch, Docker`;

        case 'incident_diagnose':
          return `### Incident Root Cause Analysis:
- **Identified Failure**: \`ExitCode 137 (OOMKilled)\` triggered by Linux kernel cgroup memory pressure during batch evaluation.
- **Root Cause**: Batch size 16 with context length 4096 exceeded node memory limit of 64GB host RAM / 80GB VRAM when computing validation loss across concurrent shards.
- **Immediate Recommended Action**:
  \`\`\`bash
  # 1. Rollback deployment to last stable checkpoint
  kubectl rollout undo deployment/vllm-inference -n staging
  # 2. Increase pod memory limit in values.yaml
  resources:
    limits:
      memory: "96Gi"
  \`\`\`
- **Long-term Mitigation**: Enable \`gradient_checkpointing\` and set \`max_num_batched_tokens = 2048\` in vLLM configuration.`;

        case 'mlops_advisor':
          return `### MLOps Hyperparameter & GPU Advice:
- **Learning Rate Recommendation**: For LoRA rank $r=32$ on Llama-3-8B, use $2e-4$ with cosine decay and 10% warmup steps.
- **VRAM Optimization Strategy**:
  - Enable FlashAttention-2 (\`attn_implementation="flash_attention_2"\`). Saves 35% memory.
  - Set optimizer to \`paged_adamw_8bit\` to offload optimizer states safely.
  - Set per-device batch size to 8 with gradient accumulation steps of 2 or 4.
- **Cost Projection**: 4x A100 80GB spot instances at $2.65/hr will complete 3 epochs in ~3.2 hours ($33.92 total run cost).`;

        default:
          return `### Junior Developer Copilot Insight:
- Ensure all Terraform variables are strictly typed and state files are locked via DynamoDB.
- Always include automated rollbacks in CI/CD pipelines when Canary error rates exceed 1%.
- Keep training runs reproducible by fixing random seeds and logging git commit hashes to experiment tracking.`;
      }
    };

    if (!apiKey) {
      return NextResponse.json({
        response: getFallback(mode),
        isFallback: true,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstructions: Record<string, string> = {
      task_breakdown:
        'You are an expert Senior MLOps & DevOps Lead mentoring a junior developer. Given a high-level task or project requirement, generate 4-5 concrete, actionable, professional subtasks with practical tools (Kubernetes, Docker, PyTorch, Terraform, etc.), realistic story points estimate, and recommended tags.',
      incident_diagnose:
        'You are an expert Cloud SRE and MLOps Engineer on incident response. Analyze the provided error log or incident scenario. Identify the exact root cause, provide an immediate remediation bash/kubectl command or rollback plan, and suggest a long-term architectural safeguard.',
      mlops_advisor:
        'You are an expert AI Researcher and MLOps practitioner. Analyze the user query regarding model training, fine-tuning, hyperparameter tuning, GPU VRAM allocation, or inference latency. Provide crisp, mathematically sound, practical recommendations.',
      iac_review:
        'You are an expert Infrastructure as Code (IaC) and Security Architect. Review the infrastructure configuration, explain trade-offs, identify security drifts or cost risks, and output clean, formatted code fixes.',
    };

    const sysInstruction = systemInstructions[mode] || systemInstructions.task_breakdown;

    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${sysInstruction}\n\nUser Context:\n${context || 'General DevOps / AI development context'}\n\nUser Question/Prompt:\n${prompt}`,
    });

    return NextResponse.json({
      response: result.text || getFallback(mode),
      isFallback: false,
    });
  } catch (error) {
    console.error('Gemini Assist Error:', error);
    return NextResponse.json({
      response: `### Copilot Recommendations:
1. Ensure idempotency in deployment scripts.
2. Verify GPU memory footprint with nvidia-smi before launching distributed jobs.
3. Configure Slack or Teams webhooks for automated CI/CD failure notifications.`,
      isFallback: true,
    });
  }
}
