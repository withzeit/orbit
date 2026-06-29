import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { loginSchema, registerSchema } from "@orbit/shared";
import { authenticate } from "../lib/authenticate.js";
import { createDefaultPersonalWorkspace } from "../lib/default-workspace.js";
import { setAuthCookies, clearAuthCookies, tokenTtl } from "../lib/cookies.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { sendError, sendValidationError } from "../lib/errors.js";
import type { JwtPayload } from "../plugins/auth.js";

function signTokens(
  fastify: FastifyInstance,
  userId: string,
): { accessToken: string; refreshToken: string } {
  const accessToken = fastify.jwt.sign(
    { sub: userId, type: "access" } satisfies JwtPayload,
    { expiresIn: tokenTtl.access },
  );
  const refreshToken = fastify.jwt.sign(
    { sub: userId, type: "refresh" } satisfies JwtPayload,
    { expiresIn: tokenTtl.refresh },
  );

  return { accessToken, refreshToken };
}

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body);

    if (!parsed.success) {
      return sendValidationError(reply, parsed.error);
    }

    const { email, password, name } = parsed.data;

    const existing = await fastify.models.User.findOne({ where: { email } });
    if (existing) {
      return sendError(
        reply,
        409,
        "CONFLICT",
        "An account with this email already exists",
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await fastify.models.User.create({
      email,
      passwordHash,
      name,
    });

    await createDefaultPersonalWorkspace(fastify.models, user.id);

    const { accessToken, refreshToken } = signTokens(fastify, user.id);
    setAuthCookies(reply, accessToken, refreshToken);

    return reply.status(201).send(user.toResponse());
  });

  fastify.post("/login", async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);

    if (!parsed.success) {
      return sendValidationError(reply, parsed.error);
    }

    const { email, password } = parsed.data;
    const user = await fastify.models.User.findOne({ where: { email } });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return sendError(reply, 401, "UNAUTHORIZED", "Invalid email or password");
    }

    const { accessToken, refreshToken } = signTokens(fastify, user.id);
    setAuthCookies(reply, accessToken, refreshToken);

    return user.toResponse();
  });

  fastify.post("/refresh", async (request, reply) => {
    const refreshToken = request.cookies.refresh_token;

    if (!refreshToken) {
      return sendError(reply, 401, "UNAUTHORIZED", "Refresh token missing");
    }

    try {
      const payload = fastify.jwt.verify<JwtPayload>(refreshToken);

      if (payload.type !== "refresh") {
        return sendError(reply, 401, "UNAUTHORIZED", "Invalid refresh token");
      }

      const user = await fastify.models.User.findByPk(payload.sub);
      if (!user) {
        return sendError(reply, 401, "UNAUTHORIZED", "User not found");
      }

      const tokens = signTokens(fastify, user.id);
      setAuthCookies(reply, tokens.accessToken, tokens.refreshToken);

      return user.toResponse();
    } catch {
      return sendError(reply, 401, "UNAUTHORIZED", "Invalid refresh token");
    }
  });

  fastify.post("/logout", async (_request, reply) => {
    clearAuthCookies(reply);
    return { success: true };
  });

  fastify.get(
    "/me",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = await fastify.models.User.findByPk(request.user.id);

      if (!user) {
        return sendError(reply, 404, "NOT_FOUND", "User not found");
      }

      return user.toResponse();
    },
  );
}
