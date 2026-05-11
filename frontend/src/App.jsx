import { Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ProtectedLayout from "./components/ProtectedLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/public_Pages/AuthPage";
import LandingPage from "./pages/public_Pages/LandingPage";
import BuilderPage from "./pages/protected_Pages/BuilderPage";
import BuilderPreviewPage from "./pages/protected_Pages/BuilderPreviewPage";
import SettingsPage from "./pages/protected_Pages/SettingsPage";
import OverviewPage from "./pages/protected_Pages/OverviewPage";
import ProjectsPage from "./pages/protected_Pages/ProjectsPage";
import TemplatesPage from "./pages/protected_Pages/TemplatesPage";
import TeamPage from "./pages/protected_Pages/TeamPage";
import AnalyticsPage from "./pages/protected_Pages/AnalyticsPage";
import PublishedSitePage from "./pages/public_Pages/PublishedSitePage";

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/site/:projectId" element={<PublishedSitePage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/design" element={<BuilderPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            {/* <Route path="/builder" element={<BuilderPage />} /> */}
            {/* <Route
              path="/builder/published"
              element={<BuilderPreviewPage mode="published" />}
            /> */}

            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="/view" element={<BuilderPreviewPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
