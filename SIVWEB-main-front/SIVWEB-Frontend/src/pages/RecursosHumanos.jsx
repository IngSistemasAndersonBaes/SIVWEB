import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { DataTable } from "../components/data-table";
import { StatusBadge } from "../components/status-badge";
import { Search, Edit, Trash2, Eye, UserPlus } from "lucide-react";

export default function RecursosHumanos() {
  const [searchTerm, setSearchTerm] = useState("");

  const usuariosData = [
    {
      nombre: "Juan Pérez López",
      usuario: "jperez",
      area: "Administración",
      correo: "jperez@empresa.com",
      estado: "activo",
    },
    {
      nombre: "María García Sánchez",
      usuario: "mgarcia",
      area: "Finanzas",
      correo: "mgarcia@empresa.com",
      estado: "activo",
    },
    {
      nombre: "Carlos Rodríguez Martínez",
      usuario: "crodriguez",
      area: "Tecnología",
      correo: "crodriguez@empresa.com",
      estado: "activo",
    },
    {
      nombre: "Ana Martínez Torres",
      usuario: "amartinez",
      area: "Recursos Humanos",
      correo: "amartinez@empresa.com",
      estado: "activo",
    },
    {
      nombre: "Luis Hernández Gómez",
      usuario: "lhernandez",
      area: "Almacén",
      correo: "lhernandez@empresa.com",
      estado: "inactivo",
    },
    {
      nombre: "Patricia Ramírez Cruz",
      usuario: "pramirez",
      area: "Ventas",
      correo: "pramirez@empresa.com",
      estado: "activo",
    },
  ];

  const columns = [
    { key: "nombre", header: "Nombre", width: "22%" },
    { key: "usuario", header: "Usuario", width: "15%" },
    { key: "area", header: "Área", width: "18%" },
    { key: "correo", header: "Correo", width: "20%" },
    {
      key: "estado",
      header: "Estado",
      width: "12%",
      render: (value) => (
        <StatusBadge variant={value === "activo" ? "active" : "inactive"}>
          {value === "activo" ? "Activo" : "Inactivo"}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      width: "13%",
      render: () => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Listado de Usuarios</h1>
          <p className="text-gray-600">Administración de personal y permisos</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, usuario o área..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-cyan-600 hover:bg-cyan-700 flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </Button>
          </div>
        </div>

        <DataTable columns={columns} data={usuariosData} />
      </div>
    </div>
  );
}
