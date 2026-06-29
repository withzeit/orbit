import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "@/pages/RegisterPage";
import { fetchMe } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery({
      queryKey: ["auth", "me"],
      queryFn: fetchMe,
    });

    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RegisterPage,
});
