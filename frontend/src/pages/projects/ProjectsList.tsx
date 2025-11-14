import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import Modal from "../../components/ui/Modal";
import { useAuth } from "../../contexts/AuthContext";
import { useApi } from "../../hooks/useApi";
import type { Project } from "../../lib/api";
import { ApiError } from "../../lib/api";

const statusLabels: Record<Project["status"], string> = {
  active: "Active",
  paused: "Paused",
  archived: "Archived",
};

const statusBadgeClass: Record<Project["status"], string> = {
  active: "bg-success/10 text-success border-success/20",
  paused: "bg-warning/10 text-warning border-warning/20",
  archived: "bg-muted/20 text-muted border-muted/30",
};

const ProjectsListPage = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const api = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const canCreateProject = useMemo(
    () => auth?.role === "org_admin" || auth?.role === "super_admin",
    [auth?.role],
  );

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const result = await api.listProjects();
        if (isMounted) {
          setProjects(result.projects);
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof ApiError) {
            setError(err.message);
          } else {
            setError("Unable to load projects. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, [api]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setCreating(false);
  };

  const handleCreateProject = async () => {
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const result = await api.createProject({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setProjects((prev) => [result.project, ...prev]);
      resetForm();
      setFormOpen(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create project. Please try again.");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    setError(null);
    try {
      await api.deleteProject(projectToDelete.id);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to delete project. Please try again.");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary dark:text-primary-light">
            Nexylomedia Automation
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Projects & Domains
          </h1>
          <p className="mt-2 text-sm text-muted dark:text-slate-400">
            Manage tenant projects, track domain submissions, and trigger SEO
            automation workflows across your workspace.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-bg px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="font-semibold text-slate-900 dark:text-white">
            Signed in as
          </p>
          <p className="mt-1 text-xs uppercase tracking-wide text-muted dark:text-slate-400">
            {auth?.user.email} · {auth?.role ?? "member"}
          </p>
        </div>
      </header>

      {canCreateProject ? (
        <Card
          title="Create a new project"
          subtitle="Projects organize domains, automations, and analytics per tenant workspace."
          action={
            <Button
              variant={formOpen ? "ghost" : "primary"}
              onClick={() => setFormOpen((prev) => !prev)}
            >
              {formOpen ? "Hide form" : "New project"}
            </Button>
          }
        >
          {formOpen ? (
            <div className="flex flex-col gap-4">
              <TextInput
                label="Project name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Marketing Website"
                required
              />
              <TextInput
                label="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional context for admins and members"
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleCreateProject}
                  loading={creating}
                  disabled={!name.trim()}
                >
                  Create project
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    resetForm();
                    setFormOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted dark:text-slate-400">
              Only org admins and super admins can create new projects.
            </p>
          )}
        </Card>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-danger/40 bg-danger/5 p-6 text-danger">
          {error}
        </div>
      ) : null}

      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Delete project"
        description={`Are you sure you want to delete "${projectToDelete?.name}"? This action cannot be undone and will also delete all associated domains, audits, and related data.`}
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={deleting}
            >
              Delete project
            </Button>
          </div>
        }
      >
        <p className="text-sm text-muted dark:text-slate-400">
          This will permanently delete the project and all its data including:
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-muted dark:text-slate-400">
          <li>All domains associated with this project</li>
          <li>All SEO audits and issues</li>
          <li>All site pages and related data</li>
        </ul>
      </Modal>

      <Card
        title="Projects"
        subtitle="Select a project to manage domains, run PageSpeed audits, or review automation activity."
      >
        {loading ? (
          <p className="text-sm text-muted dark:text-slate-400">
            Loading projects…
          </p>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center dark:border-slate-800">
            <p className="font-semibold text-slate-900 dark:text-white">
              No projects yet
            </p>
            <p className="mt-2 text-sm text-muted dark:text-slate-400">
              {canCreateProject
                ? "Create your first project to start onboarding domains and running audits."
                : "Ask an org admin to create a project and invite you."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-bg p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-wide text-muted dark:text-slate-400">
                      {project.slug}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusBadgeClass[project.status]}`}
                  >
                    {statusLabels[project.status]}
                  </span>
                </div>
                <p className="text-sm text-muted dark:text-slate-400">
                  {project.description ??
                    "No description provided. Keep stakeholders aligned by documenting goals here."}
                </p>
                <div className="flex items-center justify-between text-xs text-muted dark:text-slate-400">
                  <p>
                    Domains:{" "}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {project.domains.length}
                    </span>
                  </p>
                  <p>
                    Owner:{" "}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {project.createdBy?.displayName ??
                        project.createdBy?.email ??
                        "Unknown"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    View project
                  </Button>
                  {canCreateProject && (
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(project)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProjectsListPage;



