import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLogin } from "@/lib/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          void navigate({ to: "/dashboard" });
        },
      },
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-orbit-600">Orbit</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">Welcome back to your life organizer.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orbit-500 focus:outline-none focus:ring-2 focus:ring-orbit-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orbit-500 focus:outline-none focus:ring-2 focus:ring-orbit-200"
            />
          </div>

          {login.isError && (
            <p className="text-sm text-red-600">
              {login.error instanceof Error ? login.error.message : "Sign in failed"}
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full rounded-lg bg-orbit-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orbit-700 disabled:opacity-60"
          >
            {login.isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          No account?{" "}
          <Link to="/register" className="font-medium text-orbit-600 hover:text-orbit-700">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
