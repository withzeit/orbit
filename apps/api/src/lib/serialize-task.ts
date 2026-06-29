import type { TaskModel } from "../models/task.js";

export function serializeTask(task: TaskModel) {
  return {
    id: task.id,
    projectId: task.projectId,
    userId: task.userId,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    sortOrder: task.sortOrder,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}
