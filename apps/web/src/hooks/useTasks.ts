import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from "@orbit/shared";
import {
  createTask,
  deleteTask,
  fetchProjectTasks,
  fetchUserTasks,
  projectTasksQueryKey,
  updateTask,
  userTasksQueryKey,
} from "@/lib/tasks";

export function useProjectTasks(projectId: string | undefined) {
  return useQuery({
    queryKey: projectTasksQueryKey(projectId ?? ""),
    queryFn: () => fetchProjectTasks(projectId!),
    enabled: Boolean(projectId),
  });
}

export function useUserTasks() {
  return useQuery({
    queryKey: userTasksQueryKey,
    queryFn: fetchUserTasks,
  });
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ input }: { input: CreateTaskInput }) => createTask(projectId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectTasksQueryKey(projectId) });
      void queryClient.invalidateQueries({ queryKey: userTasksQueryKey });
    },
  });
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: UpdateTaskInput }) =>
      updateTask(taskId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectTasksQueryKey(projectId) });
      void queryClient.invalidateQueries({ queryKey: userTasksQueryKey });
    },
  });
}

export function useUpdateTaskStatus(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      updateTask(taskId, { status }),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: projectTasksQueryKey(projectId) });
      const previous = queryClient.getQueryData<Task[]>(projectTasksQueryKey(projectId));
      queryClient.setQueryData<Task[]>(projectTasksQueryKey(projectId), (old) =>
        old?.map((task) => (task.id === taskId ? { ...task, status } : task)),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(projectTasksQueryKey(projectId), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: projectTasksQueryKey(projectId) });
      void queryClient.invalidateQueries({ queryKey: userTasksQueryKey });
    },
  });
}

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectTasksQueryKey(projectId) });
      void queryClient.invalidateQueries({ queryKey: userTasksQueryKey });
    },
  });
}
