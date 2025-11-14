import { AppDataSource } from "../config/data-source";
import { env } from "../config/env";
import { SeoAudit, SeoAuditType, SeoAuditStatus, SeoAuditTrigger } from "../entities/SeoAudit";
import { SeoIssue, SeoIssueSeverity, SeoIssueCategory } from "../entities/SeoIssue";
import { Project } from "../entities/Project";
import { SitePage } from "../entities/SitePage";
import { HttpError } from "../middleware/errorHandler";
import { seoAuditRepository } from "../repositories/seoAuditRepository";
import { seoIssueRepository } from "../repositories/seoIssueRepository";
import { projectRepository } from "../repositories/projectRepository";
import { projectDomainRepository } from "../repositories/projectDomainRepository";
import { sitePageRepository } from "../repositories/sitePageRepository";

type CreateAuditParams = {
  projectId: string;
  type: SeoAuditType;
  pageId?: string | null | undefined;
  trigger?: SeoAuditTrigger;
};

export const createAudit = async (params: CreateAuditParams): Promise<SeoAudit> => {
  const project = await projectRepository().findOne({
    where: { id: params.projectId },
  });
  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  let page: SitePage | null = null;
  if (params.pageId) {
    page = await sitePageRepository().findOne({
      where: { id: params.pageId, project: { id: params.projectId } },
    });
    if (!page) {
      throw new HttpError(404, "Page not found");
    }
  }

  const auditRepo = seoAuditRepository();
  const audit = auditRepo.create({
    project,
    page: page ?? null,
    type: params.type,
    status: "pending",
    trigger: params.trigger ?? "manual",
    runner: "mock",
  });

  const saved = await auditRepo.save(audit);

  // Simulate audit execution (in production, this would queue a job)
  setTimeout(() => {
    runAudit(saved.id).catch(console.error);
  }, 1000);

  return saved;
};

export const runAudit = async (
  auditId: string,
  pageSpeedApiKey?: string,
): Promise<SeoAudit> => {
  const auditRepo = seoAuditRepository();
  const audit = await auditRepo.findOne({
    where: { id: auditId },
    relations: ["project", "page", "issues"],
  });

  if (!audit) {
    throw new HttpError(404, "Audit not found");
  }

  if (audit.status === "completed" || audit.status === "running") {
    return audit;
  }

  audit.status = "running";
  audit.startedAt = new Date();
  await auditRepo.save(audit);

  try {
    // Get the project's primary domain for the audit
    const project = await projectRepository().findOne({
      where: { id: audit.project.id },
      relations: ["domains", "tenant"],
    });

    if (!project) {
      throw new HttpError(404, "Project not found");
    }

    const primaryDomain = project.domains.find((d) => d.isPrimary && d.status === "approved");
    if (!primaryDomain) {
      throw new HttpError(400, "No approved primary domain found for this project");
    }

    const url = primaryDomain.host.startsWith("http") 
      ? primaryDomain.host 
      : `https://${primaryDomain.host}`;

    let results;
    if (audit.type === "pagespeed" || audit.type === "lighthouse") {
      // Use PageSpeed Insights API
      results = await runPageSpeedAudit(url, audit.type, pageSpeedApiKey);
    } else {
      // For SEO audits, use a combination of PageSpeed and custom SEO checks
      results = await runSeoAudit(url, pageSpeedApiKey);
    }

    // Track usage - get tenant from project
    if (project.tenant?.id) {
      const { usageService } = await import("./usageService");
      await usageService.increment(project.tenant.id, "seo_runs_month", 1);
    }
    
    audit.score = results.score;
    audit.summary = results.summary;
    audit.rawResult = results.rawResult;
    audit.status = "completed";
    audit.completedAt = new Date();

    // Create issues from results
    const issueRepo = seoIssueRepository();
    const issues = results.issues.map((issueData) => {
      const issue = issueRepo.create({
        audit,
        code: issueData.code,
        severity: issueData.severity,
        category: issueData.category,
        description: issueData.description,
        metricValue: issueData.metricValue ?? null,
        threshold: issueData.threshold ?? null,
        recommendation: issueData.recommendation ?? null,
        status: "open",
      });
      return issue;
    });

    await issueRepo.save(issues);
    await auditRepo.save(audit);

    return audit;
  } catch (error) {
    audit.status = "failed";
    audit.completedAt = new Date();
    audit.error = error instanceof Error ? error.message : String(error);
    await auditRepo.save(audit);
    throw error;
  }
};

const runPageSpeedAudit = async (
  url: string,
  type: "pagespeed" | "lighthouse",
  apiKey?: string,
): Promise<{
  score: number;
  summary: string;
  rawResult: Record<string, unknown>;
  issues: Array<{
    code: string;
    severity: SeoIssueSeverity;
    category: SeoIssueCategory;
    description: string;
    metricValue?: number;
    threshold?: number;
    recommendation?: string;
  }>;
}> => {
  const finalApiKey = apiKey || env.pageSpeedApiKey;
  if (!finalApiKey) {
    // Fallback to mock if no API key
    return generateMockAuditResults(type);
  }

  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.statusText}`);
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;
    const categories = lighthouse.categories;
    const audits = lighthouse.audits;

    // Calculate overall score (average of performance, accessibility, best-practices, SEO)
    const performance = Math.round((categories.performance?.score ?? 0) * 100);
    const accessibility = Math.round((categories.accessibility?.score ?? 0) * 100);
    const bestPractices = Math.round((categories["best-practices"]?.score ?? 0) * 100);
    const seo = Math.round((categories.seo?.score ?? 0) * 100);
    const overallScore = Math.round((performance + accessibility + bestPractices + seo) / 4);

    // Extract issues from failed audits
    const issues: Array<{
      code: string;
      severity: SeoIssueSeverity;
      category: SeoIssueCategory;
      description: string;
      metricValue?: number;
      threshold?: number;
      recommendation?: string;
    }> = [];

    Object.entries(audits).forEach(([id, audit]: [string, any]) => {
      if (audit.score !== null && audit.score < 0.9) {
        const score = audit.score * 100;
        let severity: SeoIssueSeverity = "medium";
        if (score < 50) severity = "critical";
        else if (score < 75) severity = "high";
        else if (score < 90) severity = "medium";
        else severity = "low";

        let category: SeoIssueCategory = "performance";
        if (audit.id.includes("accessibility") || audit.id.includes("a11y")) {
          category = "accessibility";
        } else if (audit.id.includes("seo") || audit.id.includes("meta")) {
          category = "seo";
        } else if (audit.id.includes("best-practice")) {
          category = "best_practices";
        }

        issues.push({
          code: audit.id.toUpperCase().replace(/-/g, "_"),
          severity,
          category,
          description: audit.title,
          metricValue: audit.numericValue ?? undefined,
          threshold: audit.numericValue ? audit.numericValue * 1.1 : undefined,
          recommendation: audit.description ?? undefined,
        } as {
          code: string;
          severity: SeoIssueSeverity;
          category: SeoIssueCategory;
          description: string;
          metricValue?: number;
          threshold?: number;
          recommendation?: string;
        });
      }
    });

    return {
      score: overallScore,
      summary: `PageSpeed score: ${overallScore}/100. Performance: ${performance}, Accessibility: ${accessibility}, Best Practices: ${bestPractices}, SEO: ${seo}. Found ${issues.length} issues.`,
      rawResult: {
        performance,
        accessibility,
        bestPractices,
        seo,
        lighthouse: data.lighthouseResult,
      },
      issues: issues.slice(0, 50), // Limit to 50 issues
    };
  } catch (error) {
    console.error("PageSpeed API error:", error);
    // Fallback to mock on error
    return generateMockAuditResults(type);
  }
};

const runSeoAudit = async (
  url: string,
  apiKey?: string,
): Promise<{
  score: number;
  summary: string;
  rawResult: Record<string, unknown>;
  issues: Array<{
    code: string;
    severity: SeoIssueSeverity;
    category: SeoIssueCategory;
    description: string;
    metricValue?: number;
    threshold?: number;
    recommendation?: string;
  }>;
}> => {
  const finalApiKey = apiKey || env.pageSpeedApiKey;
  if (!finalApiKey) {
    return generateMockAuditResults("seo");
  }

  try {
    // Use PageSpeed API but focus on SEO category
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${finalApiKey}&category=SEO`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.statusText}`);
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;
    const seoCategory = lighthouse.categories.seo;
    const audits = lighthouse.audits;

    const seoScore = Math.round((seoCategory?.score ?? 0) * 100);

    const issues: Array<{
      code: string;
      severity: SeoIssueSeverity;
      category: SeoIssueCategory;
      description: string;
      metricValue?: number;
      threshold?: number;
      recommendation?: string;
    }> = [];

    // Extract SEO-specific issues
    Object.entries(audits).forEach(([id, audit]: [string, any]) => {
      if (
        (id.includes("meta") || id.includes("seo") || id.includes("link")) &&
        audit.score !== null &&
        audit.score < 0.9
      ) {
        const score = audit.score * 100;
        let severity: SeoIssueSeverity = "medium";
        if (score < 50) severity = "critical";
        else if (score < 75) severity = "high";
        else if (score < 90) severity = "medium";
        else severity = "low";

        issues.push({
          code: audit.id.toUpperCase().replace(/-/g, "_"),
          severity,
          category: "seo",
          description: audit.title,
          recommendation: audit.description ?? undefined,
        });
      }
    });

    return {
      score: seoScore,
      summary: `SEO score: ${seoScore}/100. Found ${issues.length} SEO issues.`,
      rawResult: {
        seo: seoScore,
        lighthouse: data.lighthouseResult,
      },
      issues,
    };
  } catch (error) {
    console.error("SEO Audit API error:", error);
    return generateMockAuditResults("seo");
  }
};

const generateMockAuditResults = (type: SeoAuditType) => {
  const baseScore = Math.floor(Math.random() * 30) + 70; // 70-100

  if (type === "pagespeed") {
    return {
      score: baseScore,
      summary: `PageSpeed score: ${baseScore}/100. ${Math.floor(Math.random() * 5) + 3} issues found.`,
      rawResult: {
        performance: baseScore,
        accessibility: Math.floor(Math.random() * 20) + 80,
        bestPractices: Math.floor(Math.random() * 20) + 80,
        seo: Math.floor(Math.random() * 20) + 80,
      },
      issues: [
        {
          code: "LCP",
          severity: baseScore < 75 ? "high" : "medium",
          category: "performance",
          description: "Largest Contentful Paint (LCP) is slow",
          metricValue: 3.2,
          threshold: 2.5,
          recommendation: "Optimize images and reduce render-blocking resources",
        },
        {
          code: "FID",
          severity: "medium",
          category: "performance",
          description: "First Input Delay could be improved",
          metricValue: 150,
          threshold: 100,
          recommendation: "Reduce JavaScript execution time",
        },
        {
          code: "CLS",
          severity: baseScore < 80 ? "high" : "low",
          category: "performance",
          description: "Cumulative Layout Shift detected",
          metricValue: 0.15,
          threshold: 0.1,
          recommendation: "Set explicit dimensions for images and ads",
        },
      ] as Array<{
        code: string;
        severity: SeoIssueSeverity;
        category: SeoIssueCategory;
        description: string;
        metricValue?: number;
        threshold?: number;
        recommendation?: string;
      }>,
    };
  }

  if (type === "seo") {
    return {
      score: baseScore,
      summary: `SEO score: ${baseScore}/100. ${Math.floor(Math.random() * 4) + 2} issues found.`,
      rawResult: {
        metaTags: baseScore,
        headings: Math.floor(Math.random() * 20) + 80,
        links: Math.floor(Math.random() * 20) + 80,
        images: Math.floor(Math.random() * 20) + 80,
      },
      issues: [
        {
          code: "MISSING_META_DESCRIPTION",
          severity: "medium",
          category: "seo",
          description: "Meta description is missing",
          recommendation: "Add a compelling meta description (150-160 characters)",
        },
        {
          code: "DUPLICATE_TITLE",
          severity: "low",
          category: "seo",
          description: "Title tag may be duplicated across pages",
          recommendation: "Ensure each page has a unique title tag",
        },
        {
          code: "MISSING_ALT_TEXT",
          severity: "medium",
          category: "seo",
          description: "Some images are missing alt text",
          recommendation: "Add descriptive alt text to all images",
        },
      ] as Array<{
        code: string;
        severity: SeoIssueSeverity;
        category: SeoIssueCategory;
        description: string;
        metricValue?: number;
        threshold?: number;
        recommendation?: string;
      }>,
    };
  }

  // lighthouse
  return {
    score: baseScore,
    summary: `Lighthouse score: ${baseScore}/100. ${Math.floor(Math.random() * 6) + 3} issues found.`,
    rawResult: {
      performance: baseScore,
      accessibility: Math.floor(Math.random() * 20) + 80,
      bestPractices: Math.floor(Math.random() * 20) + 80,
      seo: Math.floor(Math.random() * 20) + 80,
    },
    issues: [
      {
        code: "UNUSED_CSS",
        severity: "low",
        category: "performance",
        description: "Unused CSS rules detected",
        recommendation: "Remove unused CSS to reduce bundle size",
      },
      {
        code: "CONSOLE_ERRORS",
        severity: "medium",
        category: "best_practices",
        description: "Console errors found",
        recommendation: "Fix JavaScript errors in the console",
      },
      {
        code: "MISSING_ARIA_LABELS",
        severity: "medium",
        category: "accessibility",
        description: "Some interactive elements lack ARIA labels",
        recommendation: "Add ARIA labels for better accessibility",
      },
    ] as Array<{
      code: string;
      severity: SeoIssueSeverity;
      category: SeoIssueCategory;
      description: string;
      metricValue?: number;
      threshold?: number;
      recommendation?: string;
    }>,
  };
};

export const listAudits = async (
  projectId: string,
  filters?: {
    type?: SeoAuditType;
    status?: SeoAuditStatus;
    pageId?: string | null | undefined;
  },
): Promise<SeoAudit[]> => {
  const query = seoAuditRepository()
    .createQueryBuilder("audit")
    .leftJoinAndSelect("audit.page", "page")
    .leftJoinAndSelect("audit.issues", "issues")
    .where("audit.project_id = :projectId", { projectId });

  if (filters?.type) {
    query.andWhere("audit.type = :type", { type: filters.type });
  }
  if (filters?.status) {
    query.andWhere("audit.status = :status", { status: filters.status });
  }
  if (filters?.pageId) {
    query.andWhere("audit.page.id = :pageId", { pageId: filters.pageId });
  }

  query.orderBy("audit.createdAt", "DESC");

  return query.getMany();
};

export const getAuditById = async (
  auditId: string,
  projectId: string,
): Promise<SeoAudit> => {
  const audit = await seoAuditRepository().findOne({
    where: { id: auditId, project: { id: projectId } },
    relations: ["project", "page", "issues", "issues.fixes"],
  });

  if (!audit) {
    throw new HttpError(404, "Audit not found");
  }

  return audit;
};

