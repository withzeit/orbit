import type { FastifyReply, FastifyRequest } from "fastify";
import type { JwtPayload } from "../plugins/auth.js";
import { sendError } from "./errors.js";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const payload = await request.jwtVerify<JwtPayload>();

    if (payload.type !== "access") {
      return sendError(reply, 401, "UNAUTHORIZED", "Invalid access token");
    }

    request.user = { id: payload.sub };
  } catch {
    return sendError(reply, 401, "UNAUTHORIZED", "Not authenticated");
  }
}
