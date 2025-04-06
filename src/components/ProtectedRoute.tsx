import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "@heroui/react";
import { MainNavbar } from "./MainNavbar";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-slate-200">
        <Spinner size="lg" color="primary" />
        <p className="mt-3 text-slate-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/login" replace />;
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
