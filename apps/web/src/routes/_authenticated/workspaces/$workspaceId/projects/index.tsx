import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProjectList } from "@/components/ProjectList";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { useWorkspace } from "@/hooks/useWorkspaces";

export const Route = createFileRoute("/_authenticated/workspaces/$workspaceId/projects/")({
  component: WorkspaceProjectsPage,
});

function WorkspaceProjectsPage() {
  const { workspaceId } = Route.useParams();
  const { setActiveWorkspaceId } = useWorkspaceContext();
  const { data: workspace, isLoading, error } = useWorkspace(workspaceId);

  useEffect(() => {
    setActiveWorkspaceId(workspaceId);
  }, [workspaceId, setActiveWorkspaceId]);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading workspace…</p>;
  }

  if (error || !workspace) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error?.message ?? "Workspace not found"}
        <Link to="/workspaces" className="ml-2 underline">
          Back to workspaces
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to="/workspaces" className="text-sm text-orbit-600 hover:text-orbit-700">
          ← Workspaces
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{workspace.name}</h1>
        <p className="mt-1 text-sm text-slate-500">Projects in this workspace</p>
      </div>
      <ProjectList workspaceId={workspaceId} />
    </div>
  );
}
