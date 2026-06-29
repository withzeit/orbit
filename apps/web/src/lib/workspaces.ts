import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceListSchema,
  workspaceSchema,
  type CreateWorkspaceInput,
  type UpdateWorkspaceInput,
  type Workspace,
} from "@orbit/shared";
import { apiFetch } from "./api.js";

export async function fetchWorkspaces(): Promise<Workspace[]> {
  const data = await apiFetch<unknown>("/api/v1/workspaces");
  return workspaceListSchema.parse(data);
}

export async function fetchWorkspace(id: string): Promise<Workspace> {
  const data = await apiFetch<unknown>(`/api/v1/workspaces/${id}`);
  return workspaceSchema.parse(data);
}

export async function createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
  const body = createWorkspaceSchema.parse(input);
  const data = await apiFetch<unknown>("/api/v1/workspaces", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return workspaceSchema.parse(data);
}

export async function updateWorkspace(
  id: string,
  input: UpdateWorkspaceInput,
): Promise<Workspace> {
  const body = updateWorkspaceSchema.parse(input);
  const data = await apiFetch<unknown>(`/api/v1/workspaces/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return workspaceSchema.parse(data);
}

export async function deleteWorkspace(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/workspaces/${id}`, { method: "DELETE" });
}
