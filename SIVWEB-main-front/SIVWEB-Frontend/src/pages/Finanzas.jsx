import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { DataTable } from "../components/data-table";
import { Eye, FileText, Search } from "lucide-react";
import { Label } from "../components/ui/label";

export default function Finanzas() {
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  const ventasData = [
    {
      idVenta: "VNT-2024-001",
      totalVenta: "$1,450.00",
      fechaVenta: "2024-04-15",
      vendedor: "María García",
    },
    {
      idVenta: "VNT-2024-002",
      totalVenta: "$3,200.00",
      fechaVenta: "2024-04-15",
      vendedor: "Carlos Rodríguez",
    },
    {
      idVenta: "VNT-2024-003",
      totalVenta: "$899.99",
      fechaVenta: "2024-04-16",
      vendedor: "Patricia Ramírez",
    },
    {
      idVenta: "VNT-2024-004",
      totalVenta: "$2,100.00",
      fechaVenta: "2024-04-16",
      vendedor: "María García",
    },
    {
      idVenta: "VNT-2024-005",
      totalVenta: "$575.50",
      fechaVenta: "2024-04-17",
      vendedor: "Carlos Rodríguez",
    },
    {
      idVenta: "VNT-2024-006",
      totalVenta: "$4,320.00",
      fechaVenta: "2024-04-18",
      vendedor: "Patricia Ramírez",
    },
  ];

  const columns = [
    { key: "idVenta", header: "ID Venta", width: "20%" },
    { key: "totalVenta", header: "Total Venta", width: "20%" },
    { key: "fechaVenta", header: "Fecha Venta", width: "20%" },
    { key: "vendedor", header: "Vendedor", width: "25%" },
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
            <FileText className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleVerVentas = () => {
    console.log("Ver ventas desde", fechaInicial, "hasta", fechaFinal);
  };

  const handleExportarPDF = () => {
    console.log("Exportar ventas a PDF");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Finanzas - Ventas</h1>
          <p className="text-gray-600">Consulta y gestión de ventas realizadas</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Búsqueda</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicial">Fecha Inicial</Label>
              <Input
                id="fechaInicial"
                type="date"
                value={fechaInicial}
                onChange={(e) => setFechaInicial(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaFinal">Fecha Final</Label>
              <Input
                id="fechaFinal"
                type="date"
                value={fechaFinal}
                onChange={(e) => setFechaFinal(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                className="w-full bg-gray-800 hover:bg-gray-900 flex items-center justify-center space-x-2"
                onClick={handleVerVentas}
              >
                <Search className="w-4 h-4" />
                <span>Ver Ventas</span>
              </Button>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
                onClick={handleExportarPDF}
              >
                <FileText className="w-4 h-4" />
                <span>Exportar a PDF</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Ventas</p>
              <p className="text-2xl font-semibold text-gray-900">$12,545.49</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Número de Transacciones</p>
              <p className="text-2xl font-semibold text-gray-900">6</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Venta Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">$2,090.92</p>
            </div>
          </div>
        </div>

        <DataTable columns={columns} data={ventasData} />
      </div>
    </div>
  );
}
