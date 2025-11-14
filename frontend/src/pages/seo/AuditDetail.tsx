import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useApi } from "../../hooks/useApi";
import type {
  SeoAudit,
  SeoIssue,
  SeoIssueStatus,
  SeoIssueSeverity,
} from "../../lib/api";
import { ApiError } from "../../lib/api";
import Select from "../../components/ui/Select";

const severityColors: Record<SeoIssueSeverity, string> = {
  info: "bg-info/10 text-info border-info/20",
  low: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-danger/10 text-danger border-danger/20",
  critical: "bg-danger/20 text-danger border-danger/40",
};

const SeoAuditDetailPage = () => {
  const { projectId, auditId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const [audit, setAudit] = useState<SeoAudit | null>(null);
  const [issues, setIssues] = useState<SeoIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<SeoIssueStatus | "all">(
    "all",
  );

  useEffect(() => {
    if (projectId && auditId) {
      loadAudit();
      loadIssues();
    }
  }, [projectId, auditId, statusFilter]);

  const loadAudit = async () => {
    if (!projectId || !auditId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await api.getAudit(projectId, auditId);
      setAudit(result.audit);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to load audit");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadIssues = async () => {
    if (!projectId || !auditId) return;
    try {
      const result = await api.listIssues(projectId, auditId, {
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setIssues(result.issues);
    } catch (err) {
      console.error("Failed to load issues:", err);
    }
  };

  const handleUpdateIssueStatus = async (
    issueId: string,
    status: SeoIssueStatus,
  ) => {
    if (!projectId || !auditId) return;
    try {
      await api.updateIssueStatus(projectId, auditId, issueId, status);
      await loadIssues();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  const handleGenerateFix = async (issueId: string) => {
    if (!projectId || !auditId) return;
    try {
      await api.generateAiFix(projectId, auditId, issueId);
      await loadIssues();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <Card>
            <p className="text-sm text-muted dark:text-slate-400">
              Loading audit…
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!audit) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <Card>
            <p className="text-sm text-danger">Audit not found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate(`/projects/${projectId}/seo/audits`)}
            >
              Back to audits
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/projects/${projectId}/seo/audits`)}
          >
            ← Back to audits
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <Card title={`${audit.type.toUpperCase()} Audit`} className="mb-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted dark:text-slate-400">
                Status
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                {audit.status}
              </p>
            </div>
            {audit.score !== null && audit.score !== undefined && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted dark:text-slate-400">
                  Score
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {audit.score}/100
                </p>
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-wide text-muted dark:text-slate-400">
                Issues found
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                {issues.length}
              </p>
            </div>
          </div>
          {audit.summary && (
            <div className="mt-4">
              <p className="text-sm text-muted dark:text-slate-400">
                {audit.summary}
              </p>
            </div>
          )}
          {audit.error && (
            <div className="mt-4 rounded-xl border border-danger/40 bg-danger/5 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-danger">
                Error
              </p>
              <p className="mt-1 text-sm text-danger">{audit.error}</p>
            </div>
          )}
        </Card>

        <Card
          title="Issues"
          action={
            <Select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as SeoIssueStatus | "all")
              }
              className="w-40"
            >
              <option value="all">All statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
              <option value="ignored">Ignored</option>
            </Select>
          }
        >
          {issues.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted dark:text-slate-400">
                No issues found
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-xl border border-border p-4 dark:border-slate-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase tracking-wide ${severityColors[issue.severity]}`}
                        >
                          {issue.severity}
                        </span>
                        <span className="text-xs uppercase tracking-wide text-muted dark:text-slate-400">
                          {issue.category}
                        </span>
                        <span className="font-mono text-xs text-muted dark:text-slate-400">
                          {issue.code}
                        </span>
                      </div>
                      <h4 className="mt-2 font-semibold text-slate-900 dark:text-white">
                        {issue.description}
                      </h4>
                      {issue.recommendation && (
                        <p className="mt-2 text-sm text-muted dark:text-slate-400">
                          {issue.recommendation}
                        </p>
                      )}
                      {issue.metricValue !== null &&
                        issue.metricValue !== undefined && (
                          <p className="mt-2 text-xs text-muted dark:text-slate-400">
                            Value: {issue.metricValue}
                            {issue.threshold !== null &&
                              issue.threshold !== undefined &&
                              ` (threshold: ${issue.threshold})`}
                          </p>
                        )}
                      {issue.fixes && issue.fixes.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-muted dark:text-slate-400">
                            {issue.fixes.length} fix
                            {issue.fixes.length !== 1 ? "es" : ""} available
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <Select
                        value={issue.status}
                        onChange={(event) =>
                          handleUpdateIssueStatus(
                            issue.id,
                            event.target.value as SeoIssueStatus,
                          )
                        }
                        className="w-40"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="ignored">Ignored</option>
                      </Select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateFix(issue.id)}
                      >
                        Generate AI fix
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SeoAuditDetailPage;

