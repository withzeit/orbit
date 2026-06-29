import {
  loginSchema,
  registerSchema,
  userResponseSchema,
  type LoginInput,
  type RegisterInput,
  type UserResponse,
} from "@orbit/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, apiFetch } from "./api";

export const authQueryKey = ["auth", "me"] as const;

export async function fetchMe(): Promise<UserResponse | null> {
  try {
    const data = await apiFetch<unknown>("/api/v1/auth/me");
    return userResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export function useMe() {
  return useQuery({
    queryKey: authQueryKey,
    queryFn: fetchMe,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      loginSchema.parse(input);
      const data = await apiFetch<unknown>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      });
      return userResponseSchema.parse(data);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKey, user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      registerSchema.parse(input);
      const data = await apiFetch<unknown>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
      });
      return userResponseSchema.parse(data);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKey, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiFetch<{ success: boolean }>("/api/v1/auth/logout", {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.setQueryData(authQueryKey, null);
      queryClient.invalidateQueries({ queryKey: authQueryKey });
    },
  });
}
