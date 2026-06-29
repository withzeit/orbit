import type { FastifyInstance } from "fastify";

export class OwnershipError extends Error {
  constructor(
    readonly statusCode: 403 | 404,
    message: string,
  ) {
    super(message);
    this.name = "OwnershipError";
  }
}

export async function assertWorkspaceOwnership(
  fastify: FastifyInstance,
  workspaceId: string,
  userId: string,
) {
  const workspace = await fastify.models.Workspace.findByPk(workspaceId);

  if (!workspace) {
    throw new OwnershipError(404, "Workspace not found");
  }

  if (workspace.userId !== userId) {
    throw new OwnershipError(403, "Forbidden");
  }

  return workspace;
}

export async function assertProjectOwnership(
  fastify: FastifyInstance,
  projectId: string,
  userId: string,
) {
  const project = await fastify.models.Project.findByPk(projectId, {
    include: [
      {
        model: fastify.models.Workspace,
        as: "workspace",
        required: true,
      },
    ],
  });

  if (!project) {
    throw new OwnershipError(404, "Project not found");
  }

  const workspace = project.get("workspace") as { userId: string } | undefined;
  if (!workspace || workspace.userId !== userId) {
    throw new OwnershipError(403, "Forbidden");
  }

  return project;
}

export async function assertTaskOwnership(
  fastify: FastifyInstance,
  taskId: string,
  userId: string,
) {
  const task = await fastify.models.Task.findByPk(taskId, {
    include: [
      {
        model: fastify.models.Project,
        as: "project",
        required: true,
        include: [
          {
            model: fastify.models.Workspace,
            as: "workspace",
            required: true,
          },
        ],
      },
    ],
  });

  if (!task) {
    throw new OwnershipError(404, "Task not found");
  }

  const project = task.get("project") as { workspace?: { userId: string } } | undefined;
  if (!project?.workspace || project.workspace.userId !== userId) {
    throw new OwnershipError(403, "Forbidden");
  }

  return task;
}
