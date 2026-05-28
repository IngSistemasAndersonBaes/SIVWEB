import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { LoginForm } from "../components/login-form";
import Dashboard from "../pages/Dashboard";
import Tecnologia from "../pages/Tecnologia";
import RecursosHumanos from "../pages/RecursosHumanos";
import Almacen from "../pages/Almacen";
import Finanzas from "../pages/Finanzas";
import { canAccessModule, getStoredUser } from "../lib/auth";

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentModuleByPath = {
    "/dashboard": "dashboard",
    "/tecnologia": "tecnologia",
    "/almacen": "almacen",
    "/finanzas": "finanzas",
    "/rrhh": "rrhh",
  };

  const currentModule = currentModuleByPath[location.pathname] ?? "dashboard";

  const handleNavigate = (route) => {
    if (route === "dashboard") {
      navigate("/dashboard");
      return;
    }

    navigate(`/${route}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentModule={currentModule} onNavigate={handleNavigate} />
      <Outlet />
    </div>
  );
}

function RequireAccess({ moduleId, children }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (moduleId && !canAccessModule(user, moduleId)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRouter() {
  const user = getStoredUser();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
              <LoginForm />
            </div>
          )
        }
      />
      <Route element={<RequireAccess><AppLayout /></RequireAccess>}>
        <Route path="/dashboard" element={<RequireAccess moduleId="dashboard"><Dashboard /></RequireAccess>} />
        <Route path="/tecnologia" element={<RequireAccess moduleId="tecnologia"><Tecnologia /></RequireAccess>} />
        <Route path="/rrhh" element={<RequireAccess moduleId="rrhh"><RecursosHumanos /></RequireAccess>} />
        <Route path="/almacen" element={<RequireAccess moduleId="almacen"><Almacen /></RequireAccess>} />
        <Route path="/finanzas" element={<RequireAccess moduleId="finanzas"><Finanzas /></RequireAccess>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
