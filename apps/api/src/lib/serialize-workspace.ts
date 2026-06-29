import type { WorkspaceModel } from "../models/workspace.js";

export function serializeWorkspace(workspace: WorkspaceModel) {
  return {
    id: workspace.id,
    userId: workspace.userId,
    name: workspace.name,
    slug: workspace.slug,
    type: workspace.type,
    createdAt: workspace.createdAt.toISOString(),
    updatedAt: workspace.updatedAt.toISOString(),
  };
}
