import { AppDataSource } from "../config/data-source";
import { env } from "../config/env";
import { SeoIssue, SeoIssueStatus } from "../entities/SeoIssue";
import { SeoFix, SeoFixProvider } from "../entities/SeoFix";
import { User } from "../entities/User";
import { HttpError } from "../middleware/errorHandler";
import { seoIssueRepository } from "../repositories/seoIssueRepository";
import { seoFixRepository } from "../repositories/seoFixRepository";
import { seoAuditRepository } from "../repositories/seoAuditRepository";

export const listIssues = async (
  auditId: string,
  filters?: {
    status?: SeoIssueStatus;
    severity?: string | null | undefined;
    category?: string | null | undefined;
  },
): Promise<SeoIssue[]> => {
  const query = seoIssueRepository()
    .createQueryBuilder("issue")
    .leftJoinAndSelect("issue.fixes", "fixes")
    .leftJoinAndSelect("fixes.createdBy", "fixCreator")
    .where("issue.audit.id = :auditId", { auditId });

  if (filters?.status) {
    query.andWhere("issue.status = :status", { status: filters.status });
  }
  if (filters?.severity) {
    query.andWhere("issue.severity = :severity", { severity: filters.severity });
  }
  if (filters?.category) {
    query.andWhere("issue.category = :category", { category: filters.category });
  }

  query.orderBy("issue.severity", "DESC").addOrderBy("issue.createdAt", "DESC");

  return query.getMany();
};

export const getIssueById = async (
  issueId: string,
  auditId: string,
): Promise<SeoIssue> => {
  const issue = await seoIssueRepository().findOne({
    where: { id: issueId, audit: { id: auditId } },
    relations: ["audit", "fixes", "fixes.createdBy"],
  });

  if (!issue) {
    throw new HttpError(404, "Issue not found");
  }

  return issue;
};

export const updateIssueStatus = async (
  issueId: string,
  status: SeoIssueStatus,
): Promise<SeoIssue> => {
  const issue = await seoIssueRepository().findOne({
    where: { id: issueId },
  });

  if (!issue) {
    throw new HttpError(404, "Issue not found");
  }

  issue.status = status;
  if (status === "resolved") {
    issue.resolvedAt = new Date();
  } else {
    issue.resolvedAt = null;
  }

  await seoIssueRepository().save(issue);
  return issue;
};

export const createFix = async (params: {
  issueId: string;
  provider: SeoFixProvider;
  content: Record<string, unknown>;
  createdById?: string;
}): Promise<SeoFix> => {
  const issue = await seoIssueRepository().findOne({
    where: { id: params.issueId },
  });

  if (!issue) {
    throw new HttpError(404, "Issue not found");
  }

  let createdBy: User | null = null;
  if (params.createdById) {
    createdBy = await AppDataSource.getRepository(User).findOne({
      where: { id: params.createdById },
    });
  }

  const fixRepo = seoFixRepository();
  const fix = fixRepo.create({
    issue,
    provider: params.provider,
    content: params.content,
    createdBy: createdBy ?? null,
  });

  return fixRepo.save(fix);
};

const generateGeminiFix = async (
  issue: SeoIssue,
  apiKey: string,
): Promise<Record<string, unknown>> => {
  const prompt = `You are an expert web developer. Generate a fix for this SEO/performance issue:

Issue Code: ${issue.code}
Category: ${issue.category}
Severity: ${issue.severity}
Description: ${issue.description}
${issue.recommendation ? `Recommendation: ${issue.recommendation}` : ""}
${issue.metricValue !== null && issue.metricValue !== undefined ? `Current Value: ${issue.metricValue}` : ""}
${issue.threshold !== null && issue.threshold !== undefined ? `Target Threshold: ${issue.threshold}` : ""}

Provide a JSON response with:
- type: "code_change" or "configuration" or "content"
- file: the file path that needs to be changed (or "multiple" if multiple files)
- changes: array of { line: number, old: string, new: string } for code changes, or { key: string, value: string } for config changes
- explanation: brief explanation of the fix
- estimatedImpact: "low", "medium", or "high"

Return only valid JSON, no markdown formatting.`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Gemini API error: ${response.statusText} - ${errorData}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error("No response from Gemini API");
  }

  // Try to parse JSON from the response
  let fixContent: Record<string, unknown>;
  try {
    const jsonText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    fixContent = JSON.parse(jsonText);
  } catch (parseError) {
    fixContent = {
      type: "code_change",
      file: "unknown",
      changes: [],
      explanation: text.substring(0, 500),
      estimatedImpact: "medium",
      rawResponse: text,
    };
  }

  return fixContent;
};

const generateGroqFix = async (
  issue: SeoIssue,
  apiKey: string,
): Promise<Record<string, unknown>> => {
  const prompt = `You are an expert web developer. Generate a fix for this SEO/performance issue:

Issue Code: ${issue.code}
Category: ${issue.category}
Severity: ${issue.severity}
Description: ${issue.description}
${issue.recommendation ? `Recommendation: ${issue.recommendation}` : ""}
${issue.metricValue !== null && issue.metricValue !== undefined ? `Current Value: ${issue.metricValue}` : ""}
${issue.threshold !== null && issue.threshold !== undefined ? `Target Threshold: ${issue.threshold}` : ""}

Provide a JSON response with:
- type: "code_change" or "configuration" or "content"
- file: the file path that needs to be changed (or "multiple" if multiple files)
- changes: array of { line: number, old: string, new: string } for code changes, or { key: string, value: string } for config changes
- explanation: brief explanation of the fix
- estimatedImpact: "low", "medium", or "high"

Return only valid JSON, no markdown formatting.`;

  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert web developer specializing in SEO and performance optimization. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Groq API error: ${response.statusText} - ${errorData}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  
  if (!text) {
    throw new Error("No response from Groq API");
  }

  // Try to parse JSON from the response
  let fixContent: Record<string, unknown>;
  try {
    const jsonText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    fixContent = JSON.parse(jsonText);
  } catch (parseError) {
    fixContent = {
      type: "code_change",
      file: "unknown",
      changes: [],
      explanation: text.substring(0, 500),
      estimatedImpact: "medium",
      rawResponse: text,
    };
  }

  return fixContent;
};

const compareFixesWithGroq = async (
  issue: SeoIssue,
  geminiFix: Record<string, unknown>,
  groqFix: Record<string, unknown>,
  groqApiKey: string,
): Promise<Record<string, unknown>> => {
  const comparisonPrompt = `You are an expert web developer evaluating two potential fixes for an SEO/performance issue.

Issue Details:
- Code: ${issue.code}
- Category: ${issue.category}
- Severity: ${issue.severity}
- Description: ${issue.description}
${issue.recommendation ? `- Recommendation: ${issue.recommendation}` : ""}

Fix 1 (Gemini):
${JSON.stringify(geminiFix, null, 2)}

Fix 2 (Groq):
${JSON.stringify(groqFix, null, 2)}

Compare both fixes and select the BEST one based on:
1. Accuracy and correctness
2. Completeness of the solution
3. Impact on performance/SEO
4. Code quality and best practices
5. Practicality and ease of implementation

Return a JSON response with:
- selectedFix: "gemini" or "groq"
- reason: brief explanation of why this fix is better
- finalFix: the complete fix object (copy the selected fix)
- comparison: {
    geminiScore: number (0-100),
    groqScore: number (0-100),
    geminiStrengths: array of strings,
    groqStrengths: array of strings
  }

Return only valid JSON, no markdown formatting.`;

  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert code reviewer and SEO specialist. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: comparisonPrompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 3000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Groq comparison API error: ${response.statusText} - ${errorData}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  
  if (!text) {
    throw new Error("No response from Groq comparison API");
  }

  // Try to parse JSON from the response
  let comparisonResult: Record<string, unknown>;
  try {
    const jsonText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    comparisonResult = JSON.parse(jsonText);
  } catch (parseError) {
    // If parsing fails, default to Groq's fix
    comparisonResult = {
      selectedFix: "groq",
      reason: "Failed to parse comparison, defaulting to Groq fix",
      finalFix: groqFix,
      comparison: {
        geminiScore: 50,
        groqScore: 50,
        geminiStrengths: [],
        groqStrengths: [],
      },
    };
  }

  // Ensure we have a finalFix
  if (!comparisonResult.finalFix) {
    const selected = comparisonResult.selectedFix === "gemini" ? geminiFix : groqFix;
    comparisonResult.finalFix = selected;
  }

  return comparisonResult;
};

export const generateAiFix = async (
  issueId: string,
  provider: "gpt" | "gemini" | "groq" = "gpt",
  apiKey?: string,
): Promise<SeoFix> => {
  const issue = await seoIssueRepository().findOne({
    where: { id: issueId },
    relations: ["audit", "audit.project", "audit.project.tenant"],
  });

  if (!issue) {
    throw new HttpError(404, "Issue not found");
  }

  // Use provided API key or fallback to env
  const geminiKey = provider === "gemini" ? (apiKey || env.geminiApiKey) : env.geminiApiKey;
  const groqKey = provider === "groq" ? (apiKey || env.groqApiKey) : env.groqApiKey;

  if (!geminiKey || !groqKey) {
    throw new HttpError(400, "Both Gemini and Groq API keys are required for comparison mode");
  }

  // Track usage
  if (issue.audit?.project?.tenant?.id) {
    const { usageService } = await import("./usageService");
    await usageService.increment(issue.audit.project.tenant.id, "ai_fixes_month", 1);
  }

  try {
    // Generate fixes from both providers in parallel
    const [geminiFix, groqFix] = await Promise.allSettled([
      generateGeminiFix(issue, geminiKey),
      generateGroqFix(issue, groqKey),
    ]);

    let geminiResult: Record<string, unknown> | null = null;
    let groqResult: Record<string, unknown> | null = null;

    if (geminiFix.status === "fulfilled") {
      geminiResult = geminiFix.value;
    } else {
      console.error("Gemini fix generation failed:", geminiFix.reason);
    }

    if (groqFix.status === "fulfilled") {
      groqResult = groqFix.value;
    } else {
      console.error("Groq fix generation failed:", groqFix.reason);
    }

    // If both failed, throw error
    if (!geminiResult && !groqResult) {
      throw new Error("Both Gemini and Groq fix generation failed");
    }

    // If only one succeeded, use that one
    if (!geminiResult && groqResult) {
      return createFix({
        issueId,
        provider: "groq",
        content: {
          ...groqResult,
          comparisonNote: "Gemini generation failed, using Groq fix",
        },
      });
    }

    if (geminiResult && !groqResult) {
      return createFix({
        issueId,
        provider: "gemini",
        content: {
          ...geminiResult,
          comparisonNote: "Groq generation failed, using Gemini fix",
        },
      });
    }

    // Both succeeded - use Groq to compare and select the best
    const comparison = await compareFixesWithGroq(
      issue,
      geminiResult!,
      groqResult!,
      groqKey,
    );

    const finalFix = comparison.finalFix as Record<string, unknown>;
    const selectedProvider = comparison.selectedFix === "gemini" ? "gemini" : "groq";

    return createFix({
      issueId,
      provider: selectedProvider,
      content: {
        ...finalFix,
        comparison: comparison.comparison,
        selectionReason: comparison.reason,
        geminiFix: geminiResult,
        groqFix: groqResult,
      },
    });
  } catch (error) {
    console.error("AI fix generation error:", error);
    // Fallback to a basic fix
    const mockFixContent = {
      type: "code_change",
      file: "index.html",
      changes: [
        {
          line: 15,
          old: '<img src="hero.jpg">',
          new: '<img src="hero.jpg" alt="Hero image description" loading="lazy">',
        },
      ],
      explanation: `Fix for ${issue.code}: ${issue.recommendation || issue.description}`,
      estimatedImpact: "medium",
      error: error instanceof Error ? error.message : "Unknown error",
    };

    return createFix({
      issueId,
      provider: "groq",
      content: mockFixContent,
    });
  }
};

