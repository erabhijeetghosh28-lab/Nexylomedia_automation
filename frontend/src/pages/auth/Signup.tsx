import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { ApiError } from "../../lib/api";

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signup({ email, password, tenantName });
      const destination =
        result.role === "super_admin" ? "/admin" : "/projects";
      navigate(destination, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to create workspace. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-10 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-6 rounded-3xl border border-border bg-bg p-10 shadow-subtle dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary dark:text-primary-light">
            Nexylomedia Automation
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            Create your workspace
          </h1>
          <p className="mt-2 text-sm text-muted dark:text-slate-400">
            We&apos;ll provision a tenant, create your org admin account, and
            sign you in immediately.
          </p>
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <TextInput
            label="Workspace name"
            name="tenantName"
            value={tenantName}
            onChange={(event) => setTenantName(event.target.value)}
            required
            placeholder="Acme Marketing"
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="you@company.com"
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="Create a secure password"
          />
          {error ? (
            <div className="rounded-xl border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}
          <Button type="submit" loading={loading} className="w-full">
            Create workspace
          </Button>
        </form>
        <p className="text-sm text-muted dark:text-slate-400">
          Already have access?{" "}
          <Link to="/login" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;


