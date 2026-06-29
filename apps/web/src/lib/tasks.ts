import {
  taskListSchema,
  taskSchema,
  type CreateTaskInput,
  type Task,
  type UpdateTaskInput,
} from "@orbit/shared";
import { apiFetch } from "./api";

export const userTasksQueryKey = ["tasks", "mine"] as const;

export async function fetchUserTasks(): Promise<Task[]> {
  const data = await apiFetch<unknown>("/api/v1/tasks");
  return taskListSchema.parse(data);
}

export async function fetchProjectTasks(projectId: string): Promise<Task[]> {
  const data = await apiFetch<unknown>(`/api/v1/projects/${projectId}/tasks`);
  return taskListSchema.parse(data);
}

export async function createTask(projectId: string, input: CreateTaskInput): Promise<Task> {
  const data = await apiFetch<unknown>(`/api/v1/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return taskSchema.parse(data);
}

export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
  const data = await apiFetch<unknown>(`/api/v1/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return taskSchema.parse(data);
}

export function deleteTask(taskId: string): Promise<void> {
  return apiFetch<void>(`/api/v1/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export function projectTasksQueryKey(projectId: string) {
  return ["projects", projectId, "tasks"] as const;
}
