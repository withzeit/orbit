import { apiErrorSchema } from "@orbit/shared";

const apiUrl = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiUrl(path: string): string {
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(getApiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = `API error: ${response.status} ${response.statusText}`;
    let code: string | undefined;

    try {
      const body: unknown = await response.json();
      const parsed = apiErrorSchema.safeParse(body);
      if (parsed.success) {
        message = parsed.data.error.message;
        code = parsed.data.error.code;
      } else if (
        body &&
        typeof body === "object" &&
        "error" in body &&
        typeof (body as { error: unknown }).error === "string"
      ) {
        message = (body as { error: string }).error;
      }
    } catch {
      // ignore parse errors
    }

    throw new ApiError(response.status, message, code);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
