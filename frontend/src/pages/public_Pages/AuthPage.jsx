import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

function AuthPage() {
  const { token, authenticate, isLoading } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    schoolName: "",
  });

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload =
      mode === "signup"
        ? {
            email: form.email,
            password: form.password,
            fullName: form.fullName,
            schoolName: form.schoolName,
          }
        : { email: form.email, password: form.password };

    const success = await authenticate(mode, payload);

    if (success) {
      const destination = location.state?.from?.pathname ?? "/dashboard";
      navigate(destination, { replace: true });
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <section className="mx-auto max-w-lg rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Account Access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Use login for existing users, or signup to create a new school account.
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-md px-3 py-2 text-sm ${
              mode === "login" ? "bg-primary text-primary-foreground" : "border"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-md px-3 py-2 text-sm ${
              mode === "signup" ? "bg-primary text-primary-foreground" : "border"
            }`}
          >
            Signup
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-md border px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">Password</span>
            <input
              required
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-md border px-3 py-2"
            />
          </label>

          {mode === "signup" && (
            <>
              <label className="block text-sm">
                <span className="mb-1 block text-muted-foreground">Full Name</span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-muted-foreground">School Name</span>
                <input
                  type="text"
                  value={form.schoolName}
                  onChange={(event) => setForm((prev) => ({ ...prev, schoolName: event.target.value }))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {isLoading ? "Please wait..." : mode === "signup" ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Back to{" "}
          <Link to="/" className="font-medium text-primary underline-offset-4 hover:underline">
            Home
          </Link>
        </p>
      </section>
    </main>
  );
}

export default AuthPage;
