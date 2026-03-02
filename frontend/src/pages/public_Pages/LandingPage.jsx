import { Link, Navigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

function LandingPage() {
  const { token } = useAppContext();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <section className="mx-auto max-w-4xl rounded-2xl border bg-card p-8 shadow-sm">
        <p className="mb-3 text-sm font-medium text-primary">No-Code School Website Builder</p>
        <h1 className="text-4xl font-bold tracking-tight">Build school websites visually</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Create and manage school landing pages with drag-and-drop blocks, then publish from one dashboard.
          This landing page is now your default home route.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/auth"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Login / Signup
          </Link>
          <a
            href="https://demo.puckeditor.com/edit"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Puck Inspiration
          </a>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
