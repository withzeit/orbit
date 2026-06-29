import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Workspace } from "@orbit/shared";
import { useWorkspaces } from "@/hooks/useWorkspaces";

const STORAGE_KEY = "orbit:activeWorkspaceId";

interface WorkspaceContextValue {
  workspaces: Workspace[];
  activeWorkspace: Workspace | undefined;
  activeWorkspaceId: string | undefined;
  setActiveWorkspaceId: (id: string) => void;
  isLoading: boolean;
  error: Error | null;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { data: workspaces = [], isLoading, error } = useWorkspaces();
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string | undefined>(() =>
    localStorage.getItem(STORAGE_KEY) ?? undefined,
  );

  useEffect(() => {
    if (workspaces.length === 0) {
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const match = workspaces.find((w) => w.id === stored);
    if (!match) {
      const personal = workspaces.find((w) => w.type === "personal") ?? workspaces[0];
      setActiveWorkspaceIdState(personal.id);
      localStorage.setItem(STORAGE_KEY, personal.id);
    }
  }, [workspaces]);

  const setActiveWorkspaceId = (id: string) => {
    setActiveWorkspaceIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const activeWorkspace = useMemo(
    () => workspaces.find((w) => w.id === activeWorkspaceId),
    [workspaces, activeWorkspaceId],
  );

  const value: WorkspaceContextValue = {
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    setActiveWorkspaceId,
    isLoading,
    error: error ?? null,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaceContext must be used within WorkspaceProvider");
  }
  return context;
}
