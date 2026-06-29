import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useRegister } from "@/lib/auth";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    register.mutate(
      { name, email, password },
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
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-600">Start organizing your life in one place.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orbit-500 focus:outline-none focus:ring-2 focus:ring-orbit-200"
            />
          </div>

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
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orbit-500 focus:outline-none focus:ring-2 focus:ring-orbit-200"
            />
            <p className="mt-1 text-xs text-slate-500">At least 8 characters</p>
          </div>

          {register.isError && (
            <p className="text-sm text-red-600">
              {register.error instanceof Error ? register.error.message : "Registration failed"}
            </p>
          )}

          <button
            type="submit"
            disabled={register.isPending}
            className="w-full rounded-lg bg-orbit-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orbit-700 disabled:opacity-60"
          >
            {register.isPending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-orbit-600 hover:text-orbit-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
