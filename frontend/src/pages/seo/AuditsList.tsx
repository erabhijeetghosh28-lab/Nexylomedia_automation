import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useApi } from "../../hooks/useApi";
import type { SeoAudit, SeoAuditType, SeoAuditStatus } from "../../lib/api";
import { ApiError } from "../../lib/api";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";

const statusColors: Record<SeoAuditStatus, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  queued: "bg-info/10 text-info border-info/20",
  running: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  failed: "bg-danger/10 text-danger border-danger/20",
};

const typeLabels: Record<SeoAuditType, string> = {
  pagespeed: "PageSpeed",
  seo: "SEO",
  lighthouse: "Lighthouse",
};

const SeoAuditsListPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const [audits, setAudits] = useState<SeoAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [auditType, setAuditType] = useState<SeoAuditType>("pagespeed");

  useEffect(() => {
    if (projectId) {
      loadAudits();
    }
  }, [projectId]);

  const loadAudits = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await api.listAudits(projectId);
      setAudits(result.audits);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to load audits");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAudit = async () => {
    if (!projectId) return;
    setCreating(true);
    try {
      await api.createAudit(projectId, { type: auditType });
      setCreateModalOpen(false);
      await loadAudits();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create audit");
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              SEO Audits
            </h1>
            <p className="mt-2 text-sm text-muted dark:text-slate-400">
              Run and manage SEO, PageSpeed, and Lighthouse audits
            </p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>New audit</Button>
        </div>

        <Modal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create new audit"
          description="Choose the type of audit to run"
          footer={
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAudit} loading={creating}>
                Create audit
              </Button>
            </div>
          }
        >
          <Select
            label="Audit type"
            value={auditType}
            onChange={(event) =>
              setAuditType(event.target.value as SeoAuditType)
            }
          >
            <option value="pagespeed">PageSpeed Insights</option>
            <option value="seo">SEO Audit</option>
            <option value="lighthouse">Lighthouse</option>
          </Select>
        </Modal>

        {error && (
          <div className="mb-4 rounded-xl border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {loading ? (
          <Card>
            <p className="text-sm text-muted dark:text-slate-400">
              Loading audits…
            </p>
          </Card>
        ) : audits.length === 0 ? (
          <Card>
            <div className="py-10 text-center">
              <p className="font-semibold text-slate-900 dark:text-white">
                No audits yet
              </p>
              <p className="mt-2 text-sm text-muted dark:text-slate-400">
                Create your first audit to start analyzing your site
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {audits.map((audit) => (
              <Card key={audit.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {typeLabels[audit.type]} Audit
                      </h3>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusColors[audit.status]}`}
                      >
                        {audit.status}
                      </span>
                      {audit.score !== null && audit.score !== undefined && (
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          {audit.score}/100
                        </span>
                      )}
                    </div>
                    {audit.summary && (
                      <p className="mt-2 text-sm text-muted dark:text-slate-400">
                        {audit.summary}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted dark:text-slate-400">
                      <span>
                        {audit.issues?.length ?? 0} issue
                        {(audit.issues?.length ?? 0) !== 1 ? "s" : ""}
                      </span>
                      {audit.completedAt && (
                        <span>
                          Completed{" "}
                          {new Date(audit.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(
                          `/projects/${projectId}/seo/audits/${audit.id}`,
                        )
                      }
                    >
                      View
                    </Button>
                    {audit.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={async () => {
                          if (!projectId) return;
                          await api.runAudit(projectId, audit.id);
                          await loadAudits();
                        }}
                      >
                        Run
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SeoAuditsListPage;

