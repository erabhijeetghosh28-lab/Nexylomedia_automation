import { useState } from "react";
import { FiMail, FiSearch, FiShield, FiUserPlus } from "react-icons/fi";
import AppShell from "../../layouts/AppShell";
import DataTable from "../../components/ui/DataTable";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import { teamMembers } from "../../data/org";

type OrgPageProps = {
  onNavigate?: (route: string) => void;
};

const TeamUsers = ({ onNavigate }: OrgPageProps) => {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <AppShell
      title="Team & Users"
      description="Manage seats, roles, and access controls for your organization. Invite teammates, adjust roles, and track last activity."
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
            icon={<FiSearch />}
            className="hidden sm:inline-flex"
          >
            Directory
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<FiUserPlus />}
            onClick={() => setInviteOpen(true)}
          >
            Invite user
          </Button>
        </div>
      }
      onNavigate={onNavigate}
    >
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4 rounded-2xl border border-border bg-bg p-6 shadow-subtle dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TextInput
              icon={<FiSearch />}
              placeholder="Search users by name or email"
              className="sm:w-72"
            />
            <Select defaultValue="all" className="sm:w-48">
              <option value="all">All roles</option>
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="member">Member</option>
            </Select>
          </div>

          <DataTable
            columns={[
              {
                key: "name",
                header: "User",
                render: (item: (typeof teamMembers)[number]) => (
                  <div className="flex items-center gap-3">
                    <Avatar name={item.name} status={item.status} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted dark:text-slate-400">
                        {item.email}
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                key: "role",
                header: "Role",
                render: (item: (typeof teamMembers)[number]) => (
                  <Badge
                    variant={
                      item.role === "Owner"
                        ? "primary"
                        : item.role === "Manager"
                          ? "info"
                          : "default"
                    }
                  >
                    {item.role}
                  </Badge>
                ),
              },
              {
                key: "lastActive",
                header: "Last active",
              },
            ]}
            data={teamMembers}
          />
        </div>

        <aside className="space-y-4 rounded-2xl border border-border bg-bg p-6 shadow-subtle dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Access overview
          </h3>
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
                  Owners manage billing and feature flags; managers handle teams;
                  members edit campaigns and content.
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                18 / 25 seats in use
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-warning" />
                3 invites pending activation
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                SSO available on Growth plan
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-primary/5 p-5 text-xs text-slate-700 dark:border-slate-700 dark:bg-primary/10 dark:text-slate-200">
            <p className="font-semibold text-primary dark:text-primary-light">
              Best practice: assign at least two owners
            </p>
            <p>
              Owners can rotate API keys, manage plan changes, and integrate new
              automation workflows. Ensure redundancy for compliance.
            </p>
          </div>
        </aside>
      </section>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite a teammate"
        description="Send an email invite with role-based permissions. They’ll receive onboarding steps and a link to join the workspace."
        footer={
          <>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={<FiMail />}>
              Send invitation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <TextInput label="Full name" placeholder="Jordan Lee" required />
          <TextInput
            label="Work email"
            placeholder="jordan@nexylomedia.com"
            type="email"
            required
          />
          <Select label="Role" defaultValue="manager">
            <option value="owner">Owner – billing + platform controls</option>
            <option value="manager">Manager – team, campaigns, content</option>
            <option value="member">Member – editor access</option>
            <option value="viewer">Viewer – read-only dashboards</option>
          </Select>
          <label className="flex items-start gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-sm text-muted dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <input type="checkbox" className="mt-1" defaultChecked />
            <span>
              Require MFA on first login
              <span className="block text-xs">
                Recommended for all new users to secure API credential access.
              </span>
            </span>
          </label>
        </div>
      </Modal>
    </AppShell>
  );
};

export default TeamUsers;


