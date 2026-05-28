import { Cpu, Package, DollarSign, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { getAllowedModules, getStoredUser } from "../lib/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const allowedModules = new Set(getAllowedModules(user));

  const modules = [
    {
      id: "tecnologia",
      title: "Tecnologia",
      description: "Gestion de equipos, soportes e historiales",
      icon: Cpu,
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      id: "almacen",
      title: "Almacen",
      description: "Control de inventario y productos",
      icon: Package,
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
    },
    {
      id: "finanzas",
      title: "Finanzas",
      description: "Administracion de ventas y reportes",
      icon: DollarSign,
      color: "bg-gray-800",
      hoverColor: "hover:bg-gray-900",
    },
    {
      id: "rrhh",
      title: "Recursos Humanos",
      description: "Gestion de usuarios y personal",
      icon: Users,
      color: "bg-cyan-600",
      hoverColor: "hover:bg-cyan-700",
    },
  ].filter((module) => allowedModules.has(module.id));

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Panel Principal</h1>
          <p className="text-gray-600">Selecciona un modulo para comenzar</p>
        </div>

        {modules.length === 0 ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
            No tienes modulos disponibles para tu area actual.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Card
                  key={module.id}
                  className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-gray-300"
                  onClick={() => navigate(`/${module.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`${module.color} ${module.hoverColor} rounded-lg p-4 transition-colors`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{module.title}</CardTitle>
                        <CardDescription className="mt-1">{module.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Click para acceder al modulo</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
