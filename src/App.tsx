import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Agencies, SocialMedia } from "./pages/streamers";
import AgencyStreamersView from "./pages/agency/agency-streamers/AgencyStreamersView";
import AgencyReportsView from "./pages/agency/reports/AgencyReportsView";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/redes-sociales"
        element={
          <ProtectedRoute>
            <SocialMedia />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agencias"
        element={
          <ProtectedRoute>
            <Agencies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/streamers"
        element={
          <ProtectedRoute>
            <AgencyStreamersView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reportes"
        element={
          <ProtectedRoute>
            <AgencyReportsView />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
