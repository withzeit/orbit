import type { FastifyInstance } from "fastify";
import { createWorkspaceSchema, updateWorkspaceSchema } from "@orbit/shared";
import { authenticate } from "../lib/authenticate.js";
import { assertWorkspaceOwnership, OwnershipError } from "../lib/ownership.js";
import { serializeWorkspace } from "../lib/serialize-workspace.js";
import { slugify } from "../lib/slugify.js";
import { uniqueWorkspaceSlug } from "../lib/default-workspace.js";

export async function workspaceRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/workspaces", async (request) => {
    const workspaces = await fastify.models.Workspace.findAll({
      where: { userId: request.user.id },
      order: [
        ["type", "ASC"],
        ["name", "ASC"],
      ],
    });

    return workspaces.map(serializeWorkspace);
  });

  fastify.post("/workspaces", async (request, reply) => {
    const parsed = createWorkspaceSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    const baseSlug = parsed.data.slug ?? slugify(parsed.data.name);
    const slug = await uniqueWorkspaceSlug(fastify.models, request.user.id, baseSlug);

    const workspace = await fastify.models.Workspace.create({
      userId: request.user.id,
      name: parsed.data.name,
      slug,
      type: parsed.data.type ?? "custom",
    });

    return reply.status(201).send(serializeWorkspace(workspace));
  });

  fastify.get<{ Params: { id: string } }>("/workspaces/:id", async (request, reply) => {
    try {
      const workspace = await assertWorkspaceOwnership(
        fastify,
        request.params.id,
        request.user.id,
      );
      return serializeWorkspace(workspace);
    } catch (error) {
      if (error instanceof OwnershipError) {
        return reply.status(error.statusCode).send({ error: error.message });
      }
      throw error;
    }
  });

  fastify.patch<{ Params: { id: string } }>("/workspaces/:id", async (request, reply) => {
    const parsed = updateWorkspaceSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    try {
      const workspace = await assertWorkspaceOwnership(
        fastify,
        request.params.id,
        request.user.id,
      );

      let slug = workspace.slug;
      if (parsed.data.slug !== undefined && parsed.data.slug !== workspace.slug) {
        slug = await uniqueWorkspaceSlug(fastify.models, request.user.id, parsed.data.slug);
      } else if (parsed.data.name !== undefined && parsed.data.name !== workspace.name) {
        slug = await uniqueWorkspaceSlug(
          fastify.models,
          request.user.id,
          slugify(parsed.data.name),
        );
      }

      await workspace.update({
        ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
        ...(parsed.data.type !== undefined ? { type: parsed.data.type } : {}),
        slug,
      });

      return serializeWorkspace(workspace);
    } catch (error) {
      if (error instanceof OwnershipError) {
        return reply.status(error.statusCode).send({ error: error.message });
      }
      throw error;
    }
  });

  fastify.delete<{ Params: { id: string } }>("/workspaces/:id", async (request, reply) => {
    try {
      const workspace = await assertWorkspaceOwnership(
        fastify,
        request.params.id,
        request.user.id,
      );
      await workspace.destroy();
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof OwnershipError) {
        return reply.status(error.statusCode).send({ error: error.message });
      }
      throw error;
    }
  });
}
