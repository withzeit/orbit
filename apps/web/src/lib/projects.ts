import {
  createProjectSchema,
  projectListSchema,
  projectSchema,
  updateProjectSchema,
  type CreateProjectInput,
  type Project,
  type UpdateProjectInput,
} from "@orbit/shared";
import { apiFetch } from "./api.js";

export async function fetchProjects(workspaceId: string): Promise<Project[]> {
  const data = await apiFetch<unknown>(`/api/v1/workspaces/${workspaceId}/projects`);
  return projectListSchema.parse(data);
}

export async function createProject(
  workspaceId: string,
  input: CreateProjectInput,
): Promise<Project> {
  const body = createProjectSchema.parse(input);
  const data = await apiFetch<unknown>(`/api/v1/workspaces/${workspaceId}/projects`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return projectSchema.parse(data);
}

export async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  const body = updateProjectSchema.parse(input);
  const data = await apiFetch<unknown>(`/api/v1/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return projectSchema.parse(data);
}

export async function deleteProject(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/projects/${id}`, { method: "DELETE" });
}
