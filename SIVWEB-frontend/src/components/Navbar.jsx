import { Home, Package, Users, DollarSign, Cpu } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { clearStoredUser, getAllowedModules, getStoredUser } from "../lib/auth";

export function Navbar({ currentModule, onNavigate }) {
  const navigate = useNavigate();
  const user = getStoredUser();
  const allowedModules = getAllowedModules(user);

  const handleNavigation = (route) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  const handleLogout = async () => {
    try {
      const csrfResponse = await fetch("http://localhost:3000/csrf-token", {
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("No se pudo obtener el token CSRF");
      }

      const { csrfToken } = await csrfResponse.json();

      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || "No se pudo cerrar sesion");
      }

      clearStoredUser();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesion:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="rounded-lg bg-blue-600 p-2">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">SIVWEB</span>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {allowedModules.includes("dashboard") && (
                <Button
                  variant={currentModule === "dashboard" ? "default" : "ghost"}
                  className="flex items-center space-x-2"
                  onClick={() => handleNavigation("dashboard")}
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
              )}

              {allowedModules.includes("tecnologia") && (
                <Button
                  variant={currentModule === "tecnologia" ? "default" : "ghost"}
                  className="flex items-center space-x-2"
                  onClick={() => handleNavigation("tecnologia")}
                >
                  <Cpu className="w-4 h-4" />
                  <span>Tecnologia</span>
                </Button>
              )}

              {allowedModules.includes("almacen") && (
                <Button
                  variant={currentModule === "almacen" ? "default" : "ghost"}
                  className="flex items-center space-x-2"
                  onClick={() => handleNavigation("almacen")}
                >
                  <Package className="w-4 h-4" />
                  <span>Almacen</span>
                </Button>
              )}

              {allowedModules.includes("finanzas") && (
                <Button
                  variant={currentModule === "finanzas" ? "default" : "ghost"}
                  className="flex items-center space-x-2"
                  onClick={() => handleNavigation("finanzas")}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Finanzas</span>
                </Button>
              )}

              {allowedModules.includes("rrhh") && (
                <Button
                  variant={currentModule === "rrhh" ? "default" : "ghost"}
                  className="flex items-center space-x-2"
                  onClick={() => handleNavigation("rrhh")}
                >
                  <Users className="w-4 h-4" />
                  <span>RRHH</span>
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="hidden md:inline">Usuario: </span>
              <span className="font-medium">{user?.nombre || user?.usuario || "Sin sesion"}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
