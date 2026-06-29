import type { FastifyReply } from "fastify";
import { env } from "../config/env.js";

const ACCESS_TOKEN_MAX_AGE = 15 * 60;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;
const REFRESH_TOKEN_PATH = "/api/v1/auth/refresh";

type CookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax" | "none";
  path: string;
  maxAge: number;
  domain?: string;
};

function baseCookieOptions(path: string, maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? "none" : "lax",
    path,
    maxAge,
    ...(env.cookieDomain ? { domain: env.cookieDomain } : {}),
  };
}

export function setAuthCookies(
  reply: FastifyReply,
  accessToken: string,
  refreshToken: string,
): void {
  reply.setCookie(
    "access_token",
    accessToken,
    baseCookieOptions("/", ACCESS_TOKEN_MAX_AGE),
  );
  reply.setCookie(
    "refresh_token",
    refreshToken,
    baseCookieOptions(REFRESH_TOKEN_PATH, REFRESH_TOKEN_MAX_AGE),
  );
}

export function clearAuthCookies(reply: FastifyReply): void {
  reply.clearCookie("access_token", baseCookieOptions("/", 0));
  reply.clearCookie(
    "refresh_token",
    baseCookieOptions(REFRESH_TOKEN_PATH, 0),
  );
}

export const tokenTtl = {
  access: "15m",
  refresh: "7d",
} as const;
