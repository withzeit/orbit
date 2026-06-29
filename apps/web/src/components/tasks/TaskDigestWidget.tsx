import type { Task } from "@orbit/shared";
import { isDueToday, isOverdue } from "./TaskCard";

export function TaskDigestWidget({ tasks }: { tasks: Task[] }) {
  const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status));
  const dueToday = tasks.filter((t) => isDueToday(t.dueDate, t.status));

  if (!overdue.length && !dueToday.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold">Due dates</h2>
        <p className="mt-2 text-sm text-slate-500">Nothing overdue or due today.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold">Due dates</h2>
      {overdue.length > 0 && (
        <div className="mt-3">
          <h3 className="text-xs font-semibold uppercase text-red-600">Overdue</h3>
          <ul className="mt-2 space-y-1">
            {overdue.map((t) => (
              <li key={t.id} className="text-sm">
                {t.title}
              </li>
            ))}
          </ul>
        </div>
      )}
      {dueToday.length > 0 && (
        <div className="mt-3">
          <h3 className="text-xs font-semibold uppercase text-orbit-600">Due today</h3>
          <ul className="mt-2 space-y-1">
            {dueToday.map((t) => (
              <li key={t.id} className="text-sm">
                {t.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
