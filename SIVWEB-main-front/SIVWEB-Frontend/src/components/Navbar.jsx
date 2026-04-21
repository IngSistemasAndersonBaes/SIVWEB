import { Home, Package, Users, DollarSign, Cpu } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar({ currentModule, onNavigate }) {
  const handleNavigation = (route) => {
    if (onNavigate) {
      onNavigate(route);
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
              <Button
                variant={currentModule === "dashboard" ? "default" : "ghost"}
                className="flex items-center space-x-2"
                onClick={() => handleNavigation("dashboard")}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>

              <Button
                variant={currentModule === "tecnologia" ? "default" : "ghost"}
                className="flex items-center space-x-2"
                onClick={() => handleNavigation("tecnologia")}
              >
                <Cpu className="w-4 h-4" />
                <span>Tecnología</span>
              </Button>

              <Button
                variant={currentModule === "almacen" ? "default" : "ghost"}
                className="flex items-center space-x-2"
                onClick={() => handleNavigation("almacen")}
              >
                <Package className="w-4 h-4" />
                <span>Almacén</span>
              </Button>

              <Button
                variant={currentModule === "finanzas" ? "default" : "ghost"}
                className="flex items-center space-x-2"
                onClick={() => handleNavigation("finanzas")}
              >
                <DollarSign className="w-4 h-4" />
                <span>Finanzas</span>
              </Button>

              <Button
                variant={currentModule === "rrhh" ? "default" : "ghost"}
                className="flex items-center space-x-2"
                onClick={() => handleNavigation("rrhh")}
              >
                <Users className="w-4 h-4" />
                <span>RRHH</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="hidden md:inline">Usuario: </span>
              <span className="font-medium">Admin</span>
            </div>
            <Button variant="outline" size="sm">
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
