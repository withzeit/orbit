import { createFileRoute } from "@tanstack/react-router";
import { Route as AuthenticatedRoute } from "../_authenticated";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = AuthenticatedRoute.useRouteContext();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Signed in as {user.name} ({user.email})
        </p>
      </div>
    </div>
  );
}
