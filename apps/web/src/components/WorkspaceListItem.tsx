import { Link } from "@tanstack/react-router";
import type { Workspace } from "@orbit/shared";
import { useDeleteWorkspace, useUpdateWorkspace } from "@/hooks/useWorkspaces";
import { useState } from "react";

export function WorkspaceListItem({ workspace }: { workspace: Workspace }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workspace.name);
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();

  const handleSave = () => {
    if (!name.trim() || name.trim() === workspace.name) {
      setIsEditing(false);
      return;
    }
    updateWorkspace.mutate(
      { id: workspace.id, input: { name: name.trim() } },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete workspace "${workspace.name}"? This removes all projects.`)) {
      return;
    }
    deleteWorkspace.mutate(workspace.id);
  };

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm"
          />
        ) : (
          <>
            <p className="truncate font-medium text-slate-900">{workspace.name}</p>
            <p className="text-xs text-slate-500">
              {workspace.type} · {workspace.slug}
            </p>
          </>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          to="/workspaces/$workspaceId/projects"
          params={{ workspaceId: workspace.id }}
          className="rounded-lg px-3 py-1.5 text-sm text-orbit-600 hover:bg-orbit-50"
        >
          Projects
        </Link>
        {isEditing ? (
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-orbit-600 px-3 py-1.5 text-sm text-white"
          >
            Save
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
          >
            Edit
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={workspace.type === "personal"}
          title={workspace.type === "personal" ? "Personal workspace cannot be deleted" : undefined}
          className="rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
