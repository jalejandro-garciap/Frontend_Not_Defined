import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "@heroui/react";
import { MainNavbar } from "./MainNavbar";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-slate-200">
        <Spinner size="lg" color="primary" />
        <p className="mt-3 text-slate-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    if (user.role === "MANAGER") {
      return <Navigate to="/streamers" replace />;
    } else if (user.role === "STREAMER") {
      return <Navigate to="/redes-sociales" replace />;
    } else if (user.role === "ADMIN") {
      return <Navigate to="/admin/agencias" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-slate-200">
      <MainNavbar />

      <main className="flex flex-col flex-grow p-4 md:p-8 items-center justify-center">
        {children}
      </main>

      <footer className="text-center p-4 text-xs text-slate-500 border-t border-slate-800">
        © {new Date().getFullYear()} StreamerPanel - Todos los derechos
        reservados.
      </footer>
    </div>
  );
};

export default ProtectedRoute;
