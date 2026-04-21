import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { LoginForm } from "../components/login-form";
import Dashboard from "../pages/Dashboard";
import Tecnologia from "../pages/Tecnologia";
import RecursosHumanos from "../pages/RecursosHumanos";
import Almacen from "../pages/Almacen";
import Finanzas from "../pages/Finanzas";

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
export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <LoginForm />
          </div>
        }
      />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tecnologia" element={<Tecnologia />} />
        <Route path="/rrhh" element={<RecursosHumanos />} />
        <Route path="/almacen" element={<Almacen />} />
        <Route path="/finanzas" element={<Finanzas />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
