import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { DataTable } from "../components/data-table";
import { Eye, FileText, Search } from "lucide-react";
import { Label } from "../components/ui/label";

const API_BASE_URL = "http://localhost:3000";
const ALL_TIME_RANGE = {
  inicio: "2000-01-01",
  fin: "2099-12-31",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);

const mapVenta = (venta) => ({
  idVenta: venta.id_venta,
  totalVenta: Number(venta.total_venta) || 0,
  fechaVenta: venta.fecha_venta,
  vendedor: venta.vendedor,
  productos: venta.productos,
});

export default function Finanzas() {
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [ventasData, setVentasData] = useState([]);
  const [isLoadingVentas, setIsLoadingVentas] = useState(false);
  const [errorVentas, setErrorVentas] = useState("");

  const totalVentas = useMemo(
    () => ventasData.reduce((sum, venta) => sum + venta.totalVenta, 0),
    [ventasData]
  );
  const numeroTransacciones = ventasData.length;
  const ventaPromedio = numeroTransacciones ? totalVentas / numeroTransacciones : 0;

  const loadVentas = async (range = ALL_TIME_RANGE) => {
    setIsLoadingVentas(true);
    setErrorVentas("");

    try {
      const params = new URLSearchParams({
        inicio: range.inicio,
        fin: range.fin,
      });
      const response = await fetch(`${API_BASE_URL}/ventas?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Error al cargar las ventas");
      }

      const data = await response.json();
      setVentasData(Array.isArray(data) ? data.map(mapVenta) : []);
    } catch (error) {
      console.error("Error al cargar las ventas:", error);
      setVentasData([]);
      setErrorVentas(error.message || "No se pudieron cargar las ventas");
    } finally {
      setIsLoadingVentas(false);
    }
  };

  useEffect(() => {
    loadVentas();
  }, []);

  const columns = [
    { key: "idVenta", header: "ID Venta", width: "20%" },
    {
      key: "totalVenta",
      header: "Total Venta",
      width: "20%",
      render: (value) => formatCurrency(value),
    },
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
    if (fechaInicial && fechaFinal) {
      loadVentas({ inicio: fechaInicial, fin: fechaFinal });
      return;
    }

    loadVentas();
  };

  const handleExportarPDF = () => {
    console.log("Exportar ventas a PDF");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">Finanzas - Ventas</h1>
          <p className="text-gray-600">Consulta y gestion de ventas realizadas</p>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Filtros de Busqueda</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
                className="flex w-full items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-900"
                onClick={handleVerVentas}
              >
                <Search className="h-4 w-4" />
                <span>Ver Ventas</span>
              </Button>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="flex w-full items-center justify-center space-x-2"
                onClick={handleExportarPDF}
              >
                <FileText className="h-4 w-4" />
                <span>Exportar a PDF</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600">Total de Ventas</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalVentas)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Numero de Transacciones</p>
              <p className="text-2xl font-semibold text-gray-900">{numeroTransacciones}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Venta Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(ventaPromedio)}</p>
            </div>
          </div>
        </div>

        {errorVentas ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorVentas}
          </div>
        ) : null}

        <DataTable
          columns={columns}
          data={ventasData}
          emptyMessage={isLoadingVentas ? "Cargando ventas..." : "No se encontraron ventas"}
        />
      </div>
    </div>
  );
}
