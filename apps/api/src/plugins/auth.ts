import fp from "fastify-plugin";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import type { FastifyInstance } from "fastify";
import { env } from "../config/env.js";

export interface JwtPayload {
  sub: string;
  type: "access" | "refresh";
}

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(cookie);
  await fastify.register(jwt, {
    secret: env.jwtSecret,
    cookie: {
      cookieName: "access_token",
      signed: false,
    },
  });
});
