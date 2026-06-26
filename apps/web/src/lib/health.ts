import { healthResponseSchema, type HealthResponse } from "@orbit/shared";
import { apiFetch } from "./api";

export async function fetchHealth(): Promise<HealthResponse> {
  const data = await apiFetch<unknown>("/api/v1/health");
  return healthResponseSchema.parse(data);
}
