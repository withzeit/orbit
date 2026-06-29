import { Link } from "@tanstack/react-router";
import { useWorkspaceContext } from "@/context/WorkspaceContext";

export function WorkspaceSwitcher() {
  const { workspaces, activeWorkspaceId, setActiveWorkspaceId, isLoading } =
    useWorkspaceContext();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
        Loading workspaces…
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label htmlFor="workspace-switcher" className="text-xs font-medium uppercase text-slate-500">
        Workspace
      </label>
      <select
        id="workspace-switcher"
        value={activeWorkspaceId ?? ""}
        onChange={(event) => setActiveWorkspaceId(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-orbit-500 focus:outline-none focus:ring-2 focus:ring-orbit-100"
      >
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>
      <Link
        to="/workspaces"
        className="inline-block text-xs text-orbit-600 hover:text-orbit-700"
      >
        Manage workspaces
      </Link>
    </div>
  );
}
