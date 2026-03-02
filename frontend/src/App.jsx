import { Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ProtectedLayout from "./components/ProtectedLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/public_Pages/AuthPage";
import LandingPage from "./pages/public_Pages/LandingPage";
import BuilderPage from "./pages/protected_Pages/BuilderPage";
import BuilderPreviewPage from "./pages/protected_Pages/BuilderPreviewPage";
import DashboardPage from "./pages/protected_Pages/DashboardPage";
import SettingsPage from "./pages/protected_Pages/SettingsPage";

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/builder/view" element={<BuilderPreviewPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
