import { useEffect, useState, useMemo } from "react";
import { FiMail, FiSearch, FiShield, FiUserPlus, FiEdit2, FiTrash2, FiSettings } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import DataTable from "../../components/ui/DataTable";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import Card from "../../components/ui/Card";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../contexts/AuthContext";
import type { TeamUser, TenantRole, RoleDefinition, Tool } from "../../lib/api";
import { ApiError } from "../../lib/api";

type OrgPageProps = {
  onNavigate?: (route: string) => void;
};

const TeamUsers = ({ onNavigate }: OrgPageProps) => {
  const { auth } = useAuth();
  const api = useApi();
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [roleDefinitions, setRoleDefinitions] = useState<Record<TenantRole, RoleDefinition> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState<TeamUser | null>(null);
  const [toolAccessOpen, setToolAccessOpen] = useState<TeamUser | null>(null);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<TenantRole | "all">("all");

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    role: "member" as TenantRole,
    toolAccess: {} as Record<string, boolean>,
  });

  const [editFormData, setEditFormData] = useState({
    role: "member" as TenantRole,
    toolAccess: {} as Record<string, boolean>,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersResult, toolsResult, rolesResult] = await Promise.all([
        api.listUsers(),
        api.getAvailableTools(),
        api.getRoleDefinitions(),
      ]);
      setUsers(usersResult.users);
      setTools(toolsResult.tools);
      setRoleDefinitions(rolesResult.roles);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }
    try {
      setError(null);
      const result = await api.createUser({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName || undefined,
        role: formData.role,
        toolAccess: Object.keys(formData.toolAccess).length > 0 ? formData.toolAccess : undefined,
      });
      setUsers((prev) => [result.user, ...prev]);
      setInviteOpen(false);
      setFormData({
        email: "",
        password: "",
        displayName: "",
        role: "member",
        toolAccess: {},
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create user");
      }
    }
  };

  const handleUpdateRole = async () => {
    if (!editUserOpen) return;
    try {
      setError(null);
      const result = await api.updateUserRole(editUserOpen.id, {
        role: editFormData.role,
        toolAccess: Object.keys(editFormData.toolAccess).length > 0 ? editFormData.toolAccess : undefined,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === result.user.id ? result.user : u))
      );
      setEditUserOpen(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update user");
      }
    }
  };

  const handleUpdateToolAccess = async () => {
    if (!toolAccessOpen) return;
    try {
      setError(null);
      const result = await api.updateUserToolAccess(toolAccessOpen.id, {
        toolAccess: editFormData.toolAccess,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === result.user.id ? result.user : u))
      );
      setToolAccessOpen(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update tool access");
      }
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    try {
      setError(null);
      await api.removeUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to remove user");
      }
    }
  };

  const openEditUser = (user: TeamUser) => {
    setEditUserOpen(user);
    setEditFormData({
      role: user.role,
      toolAccess: user.toolAccess || {},
    });
  };

  const openToolAccess = (user: TeamUser) => {
    setToolAccessOpen(user);
    setEditFormData({
      role: user.role,
      toolAccess: user.toolAccess || {},
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.displayName || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const roleBadgeVariant = (role: TenantRole) => {
    switch (role) {
      case "org_admin":
        return "primary";
      case "member":
        return "default";
      default:
        return "default";
    }
  };

  const getDefaultToolAccess = (role: TenantRole): Record<string, boolean> => {
    if (!roleDefinitions) return {};
    const defaults = roleDefinitions[role]?.defaultToolAccess || [];
    const access: Record<string, boolean> = {};
    defaults.forEach((toolId) => {
      access[toolId] = true;
    });
    return access;
  };

  return (
    <AppShell
      title="Team & Users"
      description="Manage seats, roles, and access controls for your organization. Create users, assign roles, and configure tool access."
      breadcrumbs={[
        { label: "Org Admin", href: "#" },
        { label: "Team" },
      ]}
      activeNav="team"
      rightAccessory={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<FiShield />}
            onClick={() => setRolesOpen(true)}
          >
            Role definitions
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<FiUserPlus />}
            onClick={() => setInviteOpen(true)}
          >
            Create user
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      {error && (
        <div className="mb-4 rounded-xl border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4 rounded-2xl border border-border bg-bg p-6 shadow-subtle dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TextInput
              icon={<FiSearch />}
              placeholder="Search users by name or email"
              className="sm:w-72"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as TenantRole | "all")}
              className="sm:w-48"
            >
              <option value="all">All roles</option>
              <option value="org_admin">Org Admin</option>
              <option value="member">Member</option>
            </Select>
          </div>

          {loading ? (
            <p className="text-sm text-muted dark:text-slate-400">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted dark:text-slate-400">
                No users found
              </p>
            </div>
          ) : (
            <DataTable
              columns={[
                {
                  key: "user",
                  header: "User",
                  render: (user: TeamUser) => (
                    <div className="flex items-center gap-3">
                      <Avatar name={user.displayName || user.email} />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {user.displayName || user.email}
                        </p>
                        <p className="text-xs text-muted dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "role",
                  header: "Role",
                  render: (user: TeamUser) => (
                    <Badge variant={roleBadgeVariant(user.role)}>
                      {user.role === "org_admin" ? "Org Admin" : "Member"}
                    </Badge>
                  ),
                },
                {
                  key: "actions",
                  header: "Actions",
                  render: (user: TeamUser) => (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<FiEdit2 />}
                        onClick={() => openEditUser(user)}
                        title="Edit role"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<FiSettings />}
                        onClick={() => openToolAccess(user)}
                        title="Configure tool access"
                      />
                      {user.id !== auth?.user.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<FiTrash2 />}
                          onClick={() => handleRemoveUser(user.id)}
                          title="Remove user"
                        />
                      )}
                    </div>
                  ),
                },
              ]}
              data={filteredUsers}
            />
          )}
        </div>

        <aside className="space-y-4">
          <Card title="Access overview">
            <div className="space-y-3 text-sm text-muted dark:text-slate-400">
              <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-bg px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                <span className="mt-1 text-primary">
                  <FiShield />
                </span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Role-based controls
                  </p>
                  <p className="text-xs">
                    Org admins manage team members, projects, and tool access. Members have access based on their assigned tools.
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  {users.filter((u) => u.role === "org_admin").length} org admin{users.filter((u) => u.role === "org_admin").length !== 1 ? "s" : ""}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-info" />
                  {users.filter((u) => u.role === "member").length} member{users.filter((u) => u.role === "member").length !== 1 ? "s" : ""}
                </li>
              </ul>
            </div>
          </Card>

          <Card title="Available tools">
            <div className="space-y-2 text-xs">
              {tools.map((tool) => (
                <div key={tool.id} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {tool.name}
                    </p>
                    <p className="text-muted dark:text-slate-400">{tool.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </section>

      {/* Create User Modal */}
      <Modal
        open={inviteOpen}
        onClose={() => {
          setInviteOpen(false);
          setFormData({
            email: "",
            password: "",
            displayName: "",
            role: "member",
            toolAccess: {},
          });
        }}
        title="Create user"
        description="Create a new user account and assign them to your organization with a specific role and tool access."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setInviteOpen(false);
                setFormData({
                  email: "",
                  password: "",
                  displayName: "",
                  role: "member",
                  toolAccess: {},
                });
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateUser}>
              Create user
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <TextInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="user@example.com"
            required
          />
          <TextInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Enter password"
            required
          />
          <TextInput
            label="Display name (optional)"
            value={formData.displayName}
            onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
            placeholder="John Doe"
          />
          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => {
              const role = e.target.value as TenantRole;
              setFormData((prev) => ({
                ...prev,
                role,
                toolAccess: getDefaultToolAccess(role),
              }));
            }}
          >
            <option value="member">Member</option>
            <option value="org_admin">Org Admin</option>
          </Select>
          {formData.role === "member" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Tool Access
              </label>
              {tools.map((tool) => (
                <label
                  key={tool.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <input
                    type="checkbox"
                    checked={formData.toolAccess[tool.id] || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        toolAccess: {
                          ...prev.toolAccess,
                          [tool.id]: e.target.checked,
                        },
                      }))
                    }
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {tool.name}
                    </p>
                    <p className="text-xs text-muted dark:text-slate-400">
                      {tool.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Edit User Role Modal */}
      <Modal
        open={!!editUserOpen}
        onClose={() => setEditUserOpen(null)}
        title={`Edit ${editUserOpen?.displayName || editUserOpen?.email}`}
        description="Update user role and tool access."
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditUserOpen(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateRole}>
              Save changes
            </Button>
          </>
        }
      >
        {editUserOpen && (
          <div className="space-y-4">
            <Select
              label="Role"
              value={editFormData.role}
              onChange={(e) => {
                const role = e.target.value as TenantRole;
                setEditFormData((prev) => ({
                  ...prev,
                  role,
                  toolAccess: getDefaultToolAccess(role),
                }));
              }}
            >
              <option value="member">Member</option>
              <option value="org_admin">Org Admin</option>
            </Select>
            {editFormData.role === "member" && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Tool Access
                </label>
                {tools.map((tool) => (
                  <label
                    key={tool.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={editFormData.toolAccess[tool.id] || false}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          toolAccess: {
                            ...prev.toolAccess,
                            [tool.id]: e.target.checked,
                          },
                        }))
                      }
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {tool.name}
                      </p>
                      <p className="text-xs text-muted dark:text-slate-400">
                        {tool.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Tool Access Modal */}
      <Modal
        open={!!toolAccessOpen}
        onClose={() => setToolAccessOpen(null)}
        title={`Configure tool access for ${toolAccessOpen?.displayName || toolAccessOpen?.email}`}
        description="Enable or disable specific tools for this user."
        footer={
          <>
            <Button variant="ghost" onClick={() => setToolAccessOpen(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateToolAccess}>
              Save changes
            </Button>
          </>
        }
      >
        {toolAccessOpen && (
          <div className="space-y-2">
            {tools.map((tool) => (
              <label
                key={tool.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <input
                  type="checkbox"
                  checked={editFormData.toolAccess[tool.id] || false}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      toolAccess: {
                        ...prev.toolAccess,
                        [tool.id]: e.target.checked,
                      },
                    }))
                  }
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {tool.name}
                  </p>
                  <p className="text-xs text-muted dark:text-slate-400">
                    {tool.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
      </Modal>

      {/* Role Definitions Modal */}
      <Modal
        open={rolesOpen}
        onClose={() => setRolesOpen(false)}
        title="Role definitions"
        description="Understand the permissions and default tool access for each role."
        footer={
          <Button variant="primary" onClick={() => setRolesOpen(false)}>
            Close
          </Button>
        }
      >
        {roleDefinitions && (
          <div className="space-y-4">
            {(["org_admin", "member"] as TenantRole[]).map((role) => {
              const def = roleDefinitions[role];
              return (
                <div
                  key={role}
                  className="rounded-xl border border-border bg-bg p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {def.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted dark:text-slate-400">
                    {def.description}
                  </p>
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                      Permissions
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {def.permissions.map((perm, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                          {perm}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400">
                      Default Tool Access
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {def.defaultToolAccess.map((toolId) => {
                        const tool = tools.find((t) => t.id === toolId);
                        return tool ? (
                          <Badge key={toolId} variant="default">
                            {tool.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </AppShell>
  );
};

export default TeamUsers;


