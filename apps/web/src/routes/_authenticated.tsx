import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { fetchMe } from "@/lib/auth";

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
    <main className="min-h-screen p-6">
      <Outlet />
    </main>
  );
}
