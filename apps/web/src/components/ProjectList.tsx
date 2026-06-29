import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Project } from "@orbit/shared";
import { PROJECT_COLORS } from "@/lib/project-colors";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "@/hooks/useProjects";

function ProjectRow({ project, workspaceId }: { project: Project; workspaceId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [color, setColor] = useState(project.color);
  const updateProject = useUpdateProject(workspaceId);
  const deleteProject = useDeleteProject(workspaceId);

  const handleSave = () => {
    updateProject.mutate(
      {
        id: project.id,
        input: {
          name: name.trim(),
          color,
        },
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete project "${project.name}"?`)) {
      return;
    }
    deleteProject.mutate(project.id);
  };

  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span
        className="h-3 w-3 shrink-0 rounded-full"
        style={{ backgroundColor: isEditing ? color : project.color }}
      />
      {isEditing ? (
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1 text-sm"
          />
          <div className="flex gap-1">
            {PROJECT_COLORS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setColor(option)}
                className={`h-6 w-6 rounded-full border-2 ${color === option ? "border-slate-900" : "border-transparent"}`}
                style={{ backgroundColor: option }}
                aria-label={`Color ${option}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-orbit-600 px-3 py-1 text-sm text-white"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-lg px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <Link
            to="/workspaces/$workspaceId/projects/$projectId"
            params={{ workspaceId, projectId: project.id }}
            className="flex-1 font-medium text-slate-900 hover:text-orbit-600"
          >
            {project.name}
          </Link>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-lg px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg px-3 py-1 text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </>
      )}
    </li>
  );
}

function CreateProjectForm({ workspaceId }: { workspaceId: string }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(PROJECT_COLORS[0]);
  const createProject = useCreateProject(workspaceId);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }
    createProject.mutate(
      { name: name.trim(), color },
      {
        onSuccess: () => {
          setName("");
          setColor(PROJECT_COLORS[0]);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">New project</h3>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Project name"
          className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <div className="flex gap-1">
          {PROJECT_COLORS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setColor(option)}
              className={`h-7 w-7 rounded-full border-2 ${color === option ? "border-slate-900" : "border-transparent"}`}
              style={{ backgroundColor: option }}
              aria-label={`Color ${option}`}
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={createProject.isPending || !name.trim()}
          className="rounded-lg bg-orbit-600 px-4 py-2 text-sm font-medium text-white hover:bg-orbit-700 disabled:opacity-50"
        >
          {createProject.isPending ? "Adding…" : "Add project"}
        </button>
      </div>
      {createProject.error && (
        <p className="mt-2 text-sm text-red-600">{createProject.error.message}</p>
      )}
    </form>
  );
}

export function ProjectList({ workspaceId }: { workspaceId: string }) {
  const { data: projects = [], isLoading, error } = useProjects(workspaceId);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading projects…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error.message}</p>;
  }

  return (
    <div className="space-y-4">
      <CreateProjectForm workspaceId={workspaceId} />
      {projects.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
          No projects yet. Create one above to get started.
        </p>
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} workspaceId={workspaceId} />
          ))}
        </ul>
      )}
    </div>
  );
}
