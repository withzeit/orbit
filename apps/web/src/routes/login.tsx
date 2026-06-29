import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/pages/LoginPage";
import { fetchMe } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery({
      queryKey: ["auth", "me"],
      queryFn: fetchMe,
    });

    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});
