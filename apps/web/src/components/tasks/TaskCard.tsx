import type { Task, TaskPriority, TaskStatus } from "@orbit/shared";

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

function formatDueDate(dueDate: string | null): string | null {
  if (!dueDate) return null;
  return new Date(`${dueDate}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function isOverdue(dueDate: string | null, status: TaskStatus): boolean {
  if (!dueDate || status === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${dueDate}T00:00:00`) < today;
}

export function isDueToday(dueDate: string | null, status: TaskStatus): boolean {
  if (!dueDate || status === "done") return false;
  const today = new Date();
  const due = new Date(`${dueDate}T00:00:00`);
  return (
    due.getFullYear() === today.getFullYear() &&
    due.getMonth() === today.getMonth() &&
    due.getDate() === today.getDate()
  );
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function TaskCard({ task, onEdit, onStatusChange }: TaskCardProps) {
  const dueLabel = formatDueDate(task.dueDate);
  const overdue = isOverdue(task.dueDate, task.status);
  const dueToday = isDueToday(task.dueDate, task.status);

  const cycleStatus = () => {
    const order: TaskStatus[] = ["todo", "in_progress", "done"];
    onStatusChange(task.id, order[(order.indexOf(task.status) + 1) % order.length]);
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="text-left text-sm font-medium text-slate-900 hover:text-orbit-600"
        >
          {task.title}
        </button>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{task.description}</p>
      )}
      <div className="mt-3 flex items-center justify-between gap-2">
        {dueLabel ? (
          <span
            className={`text-xs font-medium ${
              overdue ? "text-red-600" : dueToday ? "text-orbit-600" : "text-slate-500"
            }`}
          >
            {overdue ? "Overdue · " : dueToday ? "Due today · " : "Due "}
            {dueLabel}
          </span>
        ) : (
          <span className="text-xs text-slate-400">No due date</span>
        )}
        <button
          type="button"
          onClick={cycleStatus}
          className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
        >
          {STATUS_LABELS[task.status]} →
        </button>
      </div>
    </article>
  );
}
