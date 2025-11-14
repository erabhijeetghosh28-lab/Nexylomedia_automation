import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { ApiError } from "../../lib/api";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await login({ email, password });
      const defaultDestination =
        result.role === "super_admin" ? "/admin" : "/projects";
      const redirectTo =
        searchParams.get("redirect") ?? defaultDestination;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to sign in. Please try again.");
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
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted dark:text-slate-400">
            Sign in with your workspace credentials to access projects,
            automations, and approvals.
          </p>
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            placeholder="you@company.com"
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
          {error ? (
            <div className="rounded-xl border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}
          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </form>
        <p className="text-sm text-muted dark:text-slate-400">
          Need an organization workspace?{" "}
          <Link to="/signup" className="font-semibold text-primary">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


