import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Agencies, SocialMedia } from "./pages/streamers";
import AgencyStreamersView from "./pages/agency/agency-streamers/AgencyStreamersView";
import AgencyReportsView from "./pages/agency/reports/AgencyReportsView";
import AdminAgenciesView from "./pages/admin/admin-agencies/AdminAgenciesView";
import AdminUsersView from "./pages/admin/admin-users/AdminUsersView";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/redes-sociales"
        element={
          <ProtectedRoute allowedRoles={["STREAMER"]}>
            <SocialMedia />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agencias"
        element={
          <ProtectedRoute allowedRoles={["STREAMER"]}>
            <Agencies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/streamers"
        element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <AgencyStreamersView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reportes"
        element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <AgencyReportsView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/agencias"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminAgenciesView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminUsersView />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
