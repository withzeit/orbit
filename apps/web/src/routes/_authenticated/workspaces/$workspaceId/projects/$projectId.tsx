import { createFileRoute, Link } from "@tanstack/react-router";
import type { Task } from "@orbit/shared";
import { useEffect, useState } from "react";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import {
  useCreateTask,
  useDeleteTask,
  useProjectTasks,
  useUpdateTask,
  useUpdateTaskStatus,
} from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useWorkspace } from "@/hooks/useWorkspaces";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId",
)({
  component: ProjectTasksPage,
});

function ProjectTasksPage() {
  const { workspaceId, projectId } = Route.useParams();
  const { setActiveWorkspaceId } = useWorkspaceContext();
  const { data: workspace, isLoading: workspaceLoading } = useWorkspace(workspaceId);
  const { data: projects = [], isLoading: projectsLoading } = useProjects(workspaceId);
  const { data: tasks = [], isLoading: tasksLoading, error: tasksError } = useProjectTasks(projectId);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const createTask = useCreateTask(projectId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);
  const updateStatus = useUpdateTaskStatus(projectId);

  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    setActiveWorkspaceId(workspaceId);
  }, [workspaceId, setActiveWorkspaceId]);

  const handleCreate = (values: Parameters<typeof createTask.mutate>[0]["input"]) => {
    createTask.mutate(
      { input: values },
      {
        onSuccess: () => setShowCreateForm(false),
      },
    );
  };

  const handleUpdate = (values: Parameters<typeof updateTask.mutate>[0]["input"]) => {
    if (!editingTask) return;
    updateTask.mutate(
      { taskId: editingTask.id, input: values },
      { onSuccess: () => setEditingTask(null) },
    );
  };

  const handleDelete = () => {
    if (!editingTask || !window.confirm(`Delete task "${editingTask.title}"?`)) return;
    deleteTask.mutate(editingTask.id, { onSuccess: () => setEditingTask(null) });
  };

  if (workspaceLoading || projectsLoading) {
    return <p className="text-sm text-slate-500">Loading project…</p>;
  }

  if (!workspace || !project) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Project not found
        <Link
          to="/workspaces/$workspaceId/projects"
          params={{ workspaceId }}
          className="ml-2 underline"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Link
          to="/workspaces/$workspaceId/projects"
          params={{ workspaceId }}
          className="text-sm text-orbit-600 hover:text-orbit-700"
        >
          ← {workspace.name} projects
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <span
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h1 className="text-2xl font-semibold text-slate-900">{project.name}</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">Kanban board</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          {tasksLoading ? "Loading tasks…" : `${tasks.length} task${tasks.length === 1 ? "" : "s"}`}
        </p>
        {!showCreateForm && !editingTask && (
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="rounded-lg bg-orbit-600 px-4 py-2 text-sm font-medium text-white hover:bg-orbit-700"
          >
            New task
          </button>
        )}
      </div>

      {tasksError && <p className="text-sm text-red-600">{tasksError.message}</p>}

      {(showCreateForm || editingTask) && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            {editingTask ? "Edit task" : "New task"}
          </h2>
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowCreateForm(false);
              setEditingTask(null);
            }}
            isSubmitting={createTask.isPending || updateTask.isPending}
          />
          {editingTask && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteTask.isPending}
              className="mt-4 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              Delete task
            </button>
          )}
        </div>
      )}

      {!tasksLoading && (
        <KanbanBoard
          tasks={tasks}
          onEdit={setEditingTask}
          onStatusChange={(taskId, status) => updateStatus.mutate({ taskId, status })}
        />
      )}
    </div>
  );
}
