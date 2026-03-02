import { NavLink, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function navClass({ isActive }) {
  return isActive
    ? "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
    : "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted";
}

function ProtectedLayout() {
  const { user, message, isLoading, logout } = useAppContext();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold">LCNC Website Builder</h1>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Working..." : message}
            </p>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/builder" className={navClass}>
              Builder
            </NavLink>
            <NavLink to="/settings" className={navClass}>
              Settings
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-muted-foreground md:block">
              {user?.email}
            </p>
            <button
              type="button"
              className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default ProtectedLayout;
