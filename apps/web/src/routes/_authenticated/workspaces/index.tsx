import { createFileRoute } from "@tanstack/react-router";
import { CreateWorkspaceForm } from "@/components/CreateWorkspaceForm";
import { WorkspaceListItem } from "@/components/WorkspaceListItem";
import { useWorkspaces } from "@/hooks/useWorkspaces";

export const Route = createFileRoute("/_authenticated/workspaces/")({
  component: WorkspacesPage,
});

function WorkspacesPage() {
  const { data: workspaces = [], isLoading, error } = useWorkspaces();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Workspaces</h1>
        <p className="mt-1 text-sm text-slate-500">
          Organize your life and business into separate workspaces.
        </p>
      </div>
      <CreateWorkspaceForm />
      {isLoading && <p className="text-sm text-slate-500">Loading workspaces…</p>}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      {!isLoading && workspaces.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
          No workspaces yet.
        </p>
      )}
      <ul className="space-y-2">
        {workspaces.map((workspace) => (
          <WorkspaceListItem key={workspace.id} workspace={workspace} />
        ))}
      </ul>
    </div>
  );
}
