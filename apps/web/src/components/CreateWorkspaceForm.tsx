import { useState } from "react";
import type { WorkspaceType } from "@orbit/shared";
import { useCreateWorkspace } from "@/hooks/useWorkspaces";

const WORKSPACE_TYPES: { value: WorkspaceType; label: string }[] = [
  { value: "personal", label: "Personal" },
  { value: "business", label: "Business" },
  { value: "custom", label: "Custom" },
];

export function CreateWorkspaceForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState<WorkspaceType>("custom");
  const createWorkspace = useCreateWorkspace();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }
    createWorkspace.mutate(
      { name: name.trim(), type },
      {
        onSuccess: () => {
          setName("");
          setType("custom");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">Create workspace</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Workspace name"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orbit-500 focus:outline-none focus:ring-2 focus:ring-orbit-100"
        />
        <select
          value={type}
          onChange={(event) => setType(event.target.value as WorkspaceType)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orbit-500 focus:outline-none focus:ring-2 focus:ring-orbit-100"
        >
          {WORKSPACE_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={createWorkspace.isPending || !name.trim()}
          className="rounded-lg bg-orbit-600 px-4 py-2 text-sm font-medium text-white hover:bg-orbit-700 disabled:opacity-50"
        >
          {createWorkspace.isPending ? "Creating…" : "Create"}
        </button>
      </div>
      {createWorkspace.error && (
        <p className="mt-2 text-sm text-red-600">{createWorkspace.error.message}</p>
      )}
    </form>
  );
}
