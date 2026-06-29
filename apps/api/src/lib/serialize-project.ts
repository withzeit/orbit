import type { ProjectModel } from "../models/project.js";

export function serializeProject(project: ProjectModel) {
  return {
    id: project.id,
    workspaceId: project.workspaceId,
    name: project.name,
    color: project.color,
    sortOrder: project.sortOrder,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}
