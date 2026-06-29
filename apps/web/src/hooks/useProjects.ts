import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateProjectInput, UpdateProjectInput } from "@orbit/shared";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "@/lib/projects";
import { workspaceKeys } from "@/hooks/useWorkspaces";

export const projectKeys = {
  list: (workspaceId: string) => ["projects", workspaceId] as const,
};

export function useProjects(workspaceId: string | undefined) {
  return useQuery({
    queryKey: projectKeys.list(workspaceId ?? ""),
    queryFn: () => fetchProjects(workspaceId!),
    enabled: Boolean(workspaceId),
  });
}

export function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(workspaceId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) });
    },
  });
}

export function useUpdateProject(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectInput }) =>
      updateProject(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) });
    },
  });
}

export function useDeleteProject(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) });
    },
  });
}

export { workspaceKeys };
