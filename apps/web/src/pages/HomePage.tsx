import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "@/lib/health";

function StatusBadge({ status }: { status: "ok" | "degraded" | "loading" | "error" }) {
  const styles = {
    ok: "bg-emerald-100 text-emerald-800",
    degraded: "bg-amber-100 text-amber-800",
    loading: "bg-slate-100 text-slate-600",
    error: "bg-red-100 text-red-800",
  } as const;

  const labels = {
    ok: "All systems go",
    degraded: "Degraded",
    loading: "Checking…",
    error: "Unreachable",
  } as const;

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export function HomePage() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    refetchInterval: 30_000,
  });

  const status =
    health.isLoading ? "loading" : health.isError ? "error" : health.data?.status ?? "error";

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-orbit-600">Orbit</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Life organizer</h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orbit-100 text-xl">
            ◎
          </div>
        </div>

        <p className="text-slate-600">
          Your workspace for tasks, projects, and the different areas of your life.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="inline-flex rounded-lg bg-orbit-600 px-4 py-2 text-sm font-medium text-white hover:bg-orbit-700"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Create account
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">System health</h2>
            <StatusBadge status={status} />
          </div>

          {health.data && (
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">API status</dt>
                <dd className="font-medium capitalize text-slate-900">{health.data.status}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Database</dt>
                <dd className="font-medium capitalize text-slate-900">{health.data.database}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-slate-500">Last checked</dt>
                <dd className="font-medium text-slate-900">
                  {new Date(health.data.timestamp).toLocaleString()}
                </dd>
              </div>
            </dl>
          )}

          {health.isError && (
            <p className="mt-4 text-sm text-red-600">
              Could not reach the API. Make sure the backend is running (default port 4000) and
              Postgres is up.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
