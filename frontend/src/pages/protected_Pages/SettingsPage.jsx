import { useAppContext } from "../../context/AppContext";

function SettingsPage() {
  const { user } = useAppContext();

  return (
    <section className="rounded-xl border bg-card p-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This page is ready for account preferences and, later, AI builder
        preferences.
      </p>

      <div className="mt-6 space-y-2 text-sm">
        <p>
          <strong>Email:</strong> {user?.email ?? "-"}
        </p>
        <p>
          <strong>Full Name:</strong> {user?.fullName ?? "Not set"}
        </p>
        <p>
          <strong>School Name:</strong> {user?.schoolName ?? "Not set"}
        </p>
      </div>
    </section>
  );
}

export default SettingsPage;
