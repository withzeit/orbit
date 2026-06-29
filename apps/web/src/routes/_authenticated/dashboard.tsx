import { createFileRoute, Link } from "@tanstack/react-router";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { Route as AuthenticatedRoute } from "../_authenticated";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = AuthenticatedRoute.useRouteContext();
  const { activeWorkspace, isLoading } = useWorkspaceContext();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Signed in as {user.name} ({user.email})
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading workspace…</p>
      ) : !activeWorkspace ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">No workspace yet.</p>
          <Link to="/workspaces" className="mt-2 inline-block text-sm text-orbit-600">
            Create a workspace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{activeWorkspace.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {activeWorkspace.type} workspace · {activeWorkspace.slug}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Quick links</h3>
            <Link
              to="/workspaces/$workspaceId/projects"
              params={{ workspaceId: activeWorkspace.id }}
              className="mt-3 inline-flex rounded-lg bg-orbit-600 px-4 py-2 text-sm font-medium text-white hover:bg-orbit-700"
            >
              View projects
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
