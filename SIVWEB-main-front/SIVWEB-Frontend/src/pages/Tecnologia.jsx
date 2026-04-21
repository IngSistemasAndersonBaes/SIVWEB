import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { DataTable } from "../components/data-table";
import { StatusBadge } from "../components/status-badge";
import { Search, Edit, Trash2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function Tecnologia() {
  const [searchEquipos, setSearchEquipos] = useState("");
  const [searchHistoriales, setSearchHistoriales] = useState("");

  const equiposData = [
    {
      numeroSerie: "LAP-2024-001",
      equipo: "Laptop Dell Latitude 5420",
      responsable: "Juan Pérez",
      area: "Administración",
      estado: "activo",
    },
    {
      numeroSerie: "PC-2024-015",
      equipo: "PC HP EliteDesk 800",
      responsable: "María García",
      area: "Finanzas",
      estado: "activo",
    },
    {
      numeroSerie: "LAP-2023-089",
      equipo: "Laptop Lenovo ThinkPad",
      responsable: "Carlos Rodríguez",
      area: "Tecnología",
      estado: "mantenimiento",
    },
    {
      numeroSerie: "MON-2024-032",
      equipo: "Monitor Samsung 24\"",
      responsable: "Ana Martínez",
      area: "Recursos Humanos",
      estado: "activo",
    },
  ];

  const historialesData = [
    {
      idMantenimiento: "MNT-2024-001",
      numeroSerie: "LAP-2023-089",
      falla: "Pantalla con líneas horizontales",
      solucion: "Reemplazo de panel LCD",
      tecnico: "Jorge López",
      fechaReporte: "2024-03-15",
      fechaSolucion: "2024-03-18",
    },
    {
      idMantenimiento: "MNT-2024-002",
      numeroSerie: "PC-2024-015",
      falla: "No enciende",
      solucion: "Reemplazo de fuente de poder",
      tecnico: "Jorge López",
      fechaReporte: "2024-03-20",
      fechaSolucion: "2024-03-21",
    },
  ];

  const equiposColumns = [
    { key: "numeroSerie", header: "N° de Serie", width: "15%" },
    { key: "equipo", header: "Equipo", width: "25%" },
    { key: "responsable", header: "Responsable", width: "15%" },
    { key: "area", header: "Área", width: "15%" },
    {
      key: "estado",
      header: "Estado",
      width: "15%",
      render: (value) => (
        <StatusBadge variant={value === "activo" ? "active" : "maintenance"}>
          {value === "activo" ? "Activo" : "Mantenimiento"}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      width: "15%",
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

  const historialesColumns = [
    { key: "idMantenimiento", header: "ID Mantenimiento", width: "12%" },
    { key: "numeroSerie", header: "N° de Serie", width: "12%" },
    { key: "falla", header: "Falla", width: "18%" },
    { key: "solucion", header: "Solución", width: "18%" },
    { key: "tecnico", header: "Técnico", width: "12%" },
    { key: "fechaReporte", header: "Fecha Reporte", width: "10%" },
    { key: "fechaSolucion", header: "Fecha Solución", width: "10%" },
    {
      key: "actions",
      header: "Acciones",
      width: "8%",
      render: () => (
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Tecnología</h1>
          <p className="text-gray-600">Gestión de equipos y mantenimientos</p>
        </div>

        <Tabs defaultValue="equipos" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="equipos">Equipos</TabsTrigger>
            <TabsTrigger value="soportes">Soportes</TabsTrigger>
            <TabsTrigger value="historiales">Historiales</TabsTrigger>
          </TabsList>

          <TabsContent value="equipos" className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por número de serie, equipo o responsable..."
                    className="pl-10"
                    value={searchEquipos}
                    onChange={(e) => setSearchEquipos(e.target.value)}
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Nuevo Equipo
                </Button>
              </div>
            </div>

            <DataTable columns={equiposColumns} data={equiposData} />
          </TabsContent>

          <TabsContent value="soportes" className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full bg-blue-100 p-4 mb-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Módulo de Soportes
                </h3>
                <p className="text-gray-500 max-w-md">
                  Esta sección está preparada para gestionar tickets y reportes técnicos.
                  Próximamente disponible.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historiales" className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por ID de mantenimiento..."
                  className="pl-10"
                  value={searchHistoriales}
                  onChange={(e) => setSearchHistoriales(e.target.value)}
                />
              </div>
            </div>

            <DataTable columns={historialesColumns} data={historialesData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
