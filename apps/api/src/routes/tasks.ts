import type { FastifyInstance } from "fastify";
import { createTaskSchema, updateTaskSchema } from "@orbit/shared";
import { authenticate } from "../lib/authenticate.js";
import {
  assertProjectOwnership,
  assertTaskOwnership,
  OwnershipError,
} from "../lib/ownership.js";
import { serializeTask } from "../lib/serialize-task.js";

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/tasks", async (request) => {
    const tasks = await fastify.models.Task.findAll({
      where: { userId: request.user.id },
      order: [
        ["dueDate", "ASC NULLS LAST"],
        ["sortOrder", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    return tasks.map(serializeTask);
  });

  fastify.get<{ Params: { projectId: string } }>(
    "/projects/:projectId/tasks",
    async (request, reply) => {
      try {
        await assertProjectOwnership(fastify, request.params.projectId, request.user.id);

        const tasks = await fastify.models.Task.findAll({
          where: { projectId: request.params.projectId },
          order: [
            ["sortOrder", "ASC"],
            ["createdAt", "ASC"],
          ],
        });

        return tasks.map(serializeTask);
      } catch (error) {
        if (error instanceof OwnershipError) {
          return reply.status(error.statusCode).send({ error: error.message });
        }
        throw error;
      }
    },
  );

  fastify.post<{ Params: { projectId: string } }>(
    "/projects/:projectId/tasks",
    async (request, reply) => {
      const parsed = createTaskSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }

      try {
        await assertProjectOwnership(fastify, request.params.projectId, request.user.id);

        const maxSortOrder =
          ((await fastify.models.Task.max("sortOrder", {
            where: { projectId: request.params.projectId },
          })) as number | null) ?? 0;

        const task = await fastify.models.Task.create({
          projectId: request.params.projectId,
          userId: request.user.id,
          title: parsed.data.title,
          description: parsed.data.description ?? null,
          status: parsed.data.status ?? "todo",
          priority: parsed.data.priority ?? "medium",
          dueDate: parsed.data.dueDate ?? null,
          sortOrder: parsed.data.sortOrder ?? maxSortOrder + 1,
        });

        return reply.status(201).send(serializeTask(task));
      } catch (error) {
        if (error instanceof OwnershipError) {
          return reply.status(error.statusCode).send({ error: error.message });
        }
        throw error;
      }
    },
  );

  fastify.patch<{ Params: { id: string } }>("/tasks/:id", async (request, reply) => {
    const parsed = updateTaskSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    try {
      const task = await assertTaskOwnership(fastify, request.params.id, request.user.id);

      await task.update({
        ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
        ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
        ...(parsed.data.status !== undefined ? { status: parsed.data.status } : {}),
        ...(parsed.data.priority !== undefined ? { priority: parsed.data.priority } : {}),
        ...(parsed.data.dueDate !== undefined ? { dueDate: parsed.data.dueDate } : {}),
        ...(parsed.data.sortOrder !== undefined ? { sortOrder: parsed.data.sortOrder } : {}),
      });

      return serializeTask(task);
    } catch (error) {
      if (error instanceof OwnershipError) {
        return reply.status(error.statusCode).send({ error: error.message });
      }
      throw error;
    }
  });

  fastify.delete<{ Params: { id: string } }>("/tasks/:id", async (request, reply) => {
    try {
      const task = await assertTaskOwnership(fastify, request.params.id, request.user.id);
      await task.destroy();
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof OwnershipError) {
        return reply.status(error.statusCode).send({ error: error.message });
      }
      throw error;
    }
  });
}
