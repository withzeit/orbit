import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { fetchMe } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { WorkspaceProvider } from "@/context/WorkspaceContext";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery({
      queryKey: ["auth", "me"],
      queryFn: fetchMe,
    });

    if (!user) {
      throw redirect({ to: "/login" });
    }

    return { user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <WorkspaceProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </WorkspaceProvider>
  );
}
