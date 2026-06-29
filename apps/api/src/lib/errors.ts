import type { FastifyReply } from "fastify";
import type { ZodError } from "zod";

type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export function sendError(
  reply: FastifyReply,
  statusCode: number,
  code: ErrorCode,
  message: string,
  details?: unknown,
) {
  return reply.status(statusCode).send({
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  });
}

export function sendValidationError(reply: FastifyReply, error: ZodError) {
  return sendError(reply, 400, "VALIDATION_ERROR", "Invalid request body", {
    issues: error.flatten().fieldErrors,
  });
}
