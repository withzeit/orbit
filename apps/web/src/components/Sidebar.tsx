import { Link, useNavigate } from "@tanstack/react-router";
import { WorkspaceSwitcher } from "@/components/WorkspaceSwitcher";
import { useLogout, useMe } from "@/lib/auth";

export function Sidebar() {
  const navigate = useNavigate();
  const { data: user } = useMe();
  const logout = useLogout();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-5">
        <Link to="/dashboard" className="text-lg font-semibold text-orbit-700">
          Orbit
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-6 p-4">
        <WorkspaceSwitcher />
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase text-slate-500">Navigate</p>
          <Link
            to="/dashboard"
            className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-orbit-50 hover:text-orbit-700"
            activeProps={{ className: "bg-orbit-50 text-orbit-700 font-medium" }}
          >
            Dashboard
          </Link>
        </div>
      </nav>
      <div className="border-t border-slate-200 p-4">
        {user && (
          <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
        )}
        {user && <p className="truncate text-xs text-slate-500">{user.email}</p>}
        <button
          type="button"
          onClick={() =>
            logout.mutate(undefined, {
              onSuccess: () => {
                void navigate({ to: "/login" });
              },
            })
          }
          disabled={logout.isPending}
          className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {logout.isPending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
