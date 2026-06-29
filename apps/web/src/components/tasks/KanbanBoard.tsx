import type { Task, TaskStatus } from "@orbit/shared";
import { TaskCard } from "./TaskCard";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "Todo" },
  { status: "in_progress", label: "In Progress" },
  { status: "done", label: "Done" },
];

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function KanbanBoard({ tasks, onEdit, onStatusChange }: KanbanBoardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.status);
        return (
          <section key={column.status} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <header className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">{column.label}</h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs">{columnTasks.length}</span>
            </header>
            <div className="space-y-2">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
