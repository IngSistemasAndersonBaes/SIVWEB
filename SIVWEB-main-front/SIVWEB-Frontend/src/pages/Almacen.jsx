import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { DataTable } from "../components/data-table";
import { StatusBadge } from "../components/status-badge";
import { Search, Edit, Trash2, Eye, Plus } from "lucide-react";

export default function Almacen() {
  const [searchTerm, setSearchTerm] = useState("");

  const productosData = [
    {
      codigo: "PROD-001",
      producto: "Laptop Dell Latitude 5420",
      descripcion: "Laptop empresarial i5 11va gen, 16GB RAM",
      precioPublico: "$1,200.00",
      precioProveedor: "$950.00",
      existencias: 15,
      stockLevel: "normal",
    },
    {
      codigo: "PROD-002",
      producto: "Mouse Logitech MX Master 3",
      descripcion: "Mouse inalámbrico ergonómico",
      precioPublico: "$99.99",
      precioProveedor: "$75.00",
      existencias: 45,
      stockLevel: "normal",
    },
    {
      codigo: "PROD-003",
      producto: "Monitor Samsung 27\" 4K",
      descripcion: "Monitor profesional 4K UHD",
      precioPublico: "$450.00",
      precioProveedor: "$320.00",
      existencias: 3,
      stockLevel: "low",
    },
    {
      codigo: "PROD-004",
      producto: "Teclado Mecánico Keychron K8",
      descripcion: "Teclado mecánico inalámbrico",
      precioPublico: "$120.00",
      precioProveedor: "$85.00",
      existencias: 8,
      stockLevel: "low",
    },
    {
      codigo: "PROD-005",
      producto: "Webcam Logitech C920",
      descripcion: "Cámara web Full HD 1080p",
      precioPublico: "$79.99",
      precioProveedor: "$55.00",
      existencias: 22,
      stockLevel: "normal",
    },
  ];

  const columns = [
    { key: "codigo", header: "Código", width: "10%" },
    { key: "producto", header: "Producto", width: "20%" },
    { key: "descripcion", header: "Descripción", width: "25%" },
    { key: "precioPublico", header: "Precio Público", width: "12%" },
    { key: "precioProveedor", header: "Precio Proveedor", width: "12%" },
    {
      key: "existencias",
      header: "Existencias",
      width: "10%",
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <span>{value}</span>
          <StatusBadge variant={row.stockLevel === "low" ? "danger" : "success"}>
            {row.stockLevel === "low" ? "Bajo" : "Normal"}
          </StatusBadge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      width: "11%",
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
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Listado de Productos</h1>
          <p className="text-gray-600">Gestión de inventario y control de stock</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por código, producto o descripción..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nuevo Producto</span>
            </Button>
          </div>
        </div>

        <DataTable columns={columns} data={productosData} />
      </div>
    </div>
  );
}
