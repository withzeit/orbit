import type { FastifyInstance } from "fastify";
import { createProjectSchema, updateProjectSchema } from "@orbit/shared";
import { authenticate } from "../lib/authenticate.js";
import {
  assertProjectOwnership,
  assertWorkspaceOwnership,
  OwnershipError,
} from "../lib/ownership.js";
import { serializeProject } from "../lib/serialize-project.js";

export async function projectRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get<{ Params: { workspaceId: string } }>(
    "/workspaces/:workspaceId/projects",
    async (request, reply) => {
      try {
        await assertWorkspaceOwnership(fastify, request.params.workspaceId, request.user.id);

        const projects = await fastify.models.Project.findAll({
          where: { workspaceId: request.params.workspaceId },
          order: [
            ["sortOrder", "ASC"],
            ["createdAt", "ASC"],
          ],
        });

        return projects.map(serializeProject);
      } catch (error) {
        if (error instanceof OwnershipError) {
          return reply.status(error.statusCode).send({ error: error.message });
        }
        throw error;
      }
    },
  );

  fastify.post<{ Params: { workspaceId: string } }>(
    "/workspaces/:workspaceId/projects",
    async (request, reply) => {
      const parsed = createProjectSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }

      try {
        await assertWorkspaceOwnership(fastify, request.params.workspaceId, request.user.id);

        const maxSortOrder =
          ((await fastify.models.Project.max("sortOrder", {
            where: { workspaceId: request.params.workspaceId },
          })) as number | null) ?? 0;

        const project = await fastify.models.Project.create({
          workspaceId: request.params.workspaceId,
          name: parsed.data.name,
          color: parsed.data.color,
          sortOrder: parsed.data.sortOrder ?? maxSortOrder + 1,
        });

        return reply.status(201).send(serializeProject(project));
      } catch (error) {
        if (error instanceof OwnershipError) {
          return reply.status(error.statusCode).send({ error: error.message });
        }
        throw error;
      }
    },
  );

  fastify.patch<{ Params: { id: string } }>("/projects/:id", async (request, reply) => {
    const parsed = updateProjectSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    try {
      const project = await assertProjectOwnership(fastify, request.params.id, request.user.id);

      await project.update({
        ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
        ...(parsed.data.color !== undefined ? { color: parsed.data.color } : {}),
        ...(parsed.data.sortOrder !== undefined ? { sortOrder: parsed.data.sortOrder } : {}),
      });

      return serializeProject(project);
    } catch (error) {
      if (error instanceof OwnershipError) {
        return reply.status(error.statusCode).send({ error: error.message });
      }
      throw error;
    }
  });

  fastify.delete<{ Params: { id: string } }>("/projects/:id", async (request, reply) => {
    try {
      const project = await assertProjectOwnership(fastify, request.params.id, request.user.id);
      await project.destroy();
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof OwnershipError) {
        return reply.status(error.statusCode).send({ error: error.message });
      }
      throw error;
    }
  });
}
