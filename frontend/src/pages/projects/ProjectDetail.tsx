import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { useAuth } from "../../contexts/AuthContext";
import { useApi } from "../../hooks/useApi";
import type { Project, ProjectDomain } from "../../lib/api";
import { ApiError } from "../../lib/api";

const statusBadgeClass: Record<ProjectDomain["status"], string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  approved: "bg-success/10 text-success border-success/20",
  rejected: "bg-danger/10 text-danger border-danger/20",
  suspended: "bg-muted/20 text-muted border-muted/30",
};

const statusLabel: Record<ProjectDomain["status"], string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
};

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const { auth } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [host, setHost] = useState("");
  const [notes, setNotes] = useState("");
  const [submittingDomain, setSubmittingDomain] = useState(false);

  const canReview = useMemo(
    () => auth?.role === "org_admin" || auth?.role === "super_admin",
    [auth?.role],
  );

  const loadProject = async (withSpinner = true) => {
    if (!projectId) return;
    try {
      if (withSpinner) setLoading(true);
      setError(null);
      const result = await api.getProject(projectId);
      setProject(result.project);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to load project details. Please try again.");
      }
    } finally {
      if (withSpinner) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    void loadProject(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleSubmitDomain = async (event: FormEvent) => {
    event.preventDefault();
    if (!projectId || !host.trim()) return;
    setSubmittingDomain(true);
    setError(null);
    try {
      const result = await api.submitDomain(projectId, {
        host: host.trim(),
        notes: notes.trim() || undefined,
      });
      setProject((prev) =>
        prev
          ? { ...prev, domains: [result.domain, ...prev.domains] }
          : prev,
      );
      setHost("");
      setNotes("");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to submit domain. Please try again.");
      }
    } finally {
      setSubmittingDomain(false);
    }
  };

  const handleReview = async (
    domainId: string,
    status: "approved" | "rejected" | "suspended",
    setPrimary = false,
  ) => {
    if (!projectId) return;
    setRefreshing(true);
    setError(null);
    try {
      const result = await api.reviewDomain(projectId, domainId, {
        status,
        setPrimary,
      });
      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          domains: prev.domains.map((domain) =>
            domain.id === domainId ? result.domain : domain,
          ),
        };
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to update domain status. Please try again.");
      }
    } finally {
      setRefreshing(false);
    }
  };

  if (!projectId) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          Missing project identifier
        </p>
        <Button variant="outline" onClick={() => navigate("/projects")}>
          Back to projects
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
        ← Back to projects
      </Button>
      {loading ? (
        <Card title="Project overview">
          <p className="text-sm text-muted dark:text-slate-400">
            Loading project…
          </p>
        </Card>
      ) : project ? (
        <>
          <Card
            title={project.name}
            subtitle={
              project.description ??
              "Use this project to coordinate automations, audits, and traffic insights for a single domain or brand property."
            }
            action={
              <div className="flex flex-col items-end gap-2 text-right text-xs uppercase tracking-wide text-muted dark:text-slate-400">
                <span>Slug</span>
                <span className="rounded-full border border-border bg-bg px-3 py-1 font-semibold dark:border-slate-700 dark:bg-slate-900">
                  {project.slug}
                </span>
              </div>
            }
          >
            <dl className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-bg px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <dt className="text-xs uppercase tracking-wide text-muted dark:text-slate-400">
                  Status
                </dt>
                <dd className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {project.status}
                </dd>
              </div>
              <div className="rounded-2xl border border-border bg-bg px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <dt className="text-xs uppercase tracking-wide text-muted dark:text-slate-400">
                  Domains
                </dt>
                <dd className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {project.domains.length}
                </dd>
              </div>
              <div className="rounded-2xl border border-border bg-bg px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <dt className="text-xs uppercase tracking-wide text-muted dark:text-slate-400">
                  Created
                </dt>
                <dd className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {new Date(project.createdAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </Card>

          <Card
            title="SEO Autopilot"
            subtitle="Run SEO, PageSpeed, and Lighthouse audits to identify and fix issues automatically."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/projects/${projectId}/seo/audits`)}
              >
                View audits
              </Button>
            }
          >
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted dark:text-slate-400">
                Create automated SEO audits, identify issues, and generate AI-powered fixes for your project.
              </p>
              <Button
                onClick={() => navigate(`/projects/${projectId}/seo/audits`)}
              >
                Go to SEO audits
              </Button>
            </div>
          </Card>

          <Card
            title="Submit a domain"
            subtitle="Members can request new domains for SEO automation. Org admins can approve and trigger discovery."
          >
            <form className="flex flex-col gap-4" onSubmit={handleSubmitDomain}>
              <TextInput
                label="Domain URL or host"
                value={host}
                onChange={(event) => setHost(event.target.value)}
                placeholder="https://www.example.com"
                required
              />
              <TextInput
                label="Notes (optional)"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Context for approvers"
              />
              <div className="flex gap-3">
                <Button
                  type="submit"
                  loading={submittingDomain}
                  disabled={!host.trim()}
                >
                  Submit domain
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setHost("");
                    setNotes("");
                  }}
                >
                  Clear
                </Button>
              </div>
            </form>
          </Card>

          <Card
            title="Domains"
            subtitle="Track verification, approval status, and primary domain designation for automations."
            action={
              <Button
                variant="ghost"
                size="sm"
                loading={refreshing}
                onClick={() => loadProject(false)}
              >
                Refresh
              </Button>
            }
          >
            {error ? (
              <div className="mb-4 rounded-2xl border border-danger/40 bg-danger/5 px-4 py-3 text-danger">
                {error}
              </div>
            ) : null}
            {project.domains.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">
                  No domains yet
                </p>
                <p className="mt-2 text-sm text-muted dark:text-slate-400">
                  Submit a domain above to kick off discovery and PageSpeed
                  coverage.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {project.domains.map((domain) => (
                  <div
                    key={domain.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-bg p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {domain.host}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-wide text-muted dark:text-slate-400">
                          Submitted{" "}
                          {new Date(domain.createdAt).toLocaleDateString()} ·{" "}
                          {domain.submittedBy?.email ?? "Unknown user"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {domain.isPrimary ? (
                          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                            Primary domain
                          </span>
                        ) : null}
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusBadgeClass[domain.status]}`}
                        >
                          {statusLabel[domain.status]}
                        </span>
                      </div>
                    </div>
                    {domain.notes ? (
                      <p className="text-sm text-muted dark:text-slate-400">
                        {domain.notes}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted dark:text-slate-400">
                      <p>
                        Approved by:{" "}
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {domain.approvedBy?.email ?? "Pending"}
                        </span>
                      </p>
                      <p>
                        Updated{" "}
                        {new Date(domain.updatedAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {domain.status === "pending" && canReview ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleReview(domain.id, "approved")}
                            loading={refreshing}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReview(domain.id, "rejected")}
                            loading={refreshing}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleReview(domain.id, "suspended")
                            }
                            loading={refreshing}
                          >
                            Suspend
                          </Button>
                        </>
                      ) : null}
                      {domain.status === "approved" &&
                      canReview &&
                      !domain.isPrimary ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleReview(domain.id, "approved", true)
                          }
                          loading={refreshing}
                        >
                          Set as primary
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      ) : (
        <div className="rounded-2xl border border-danger/40 bg-danger/5 p-6 text-danger">
          {error ?? "Project not found."}
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;


