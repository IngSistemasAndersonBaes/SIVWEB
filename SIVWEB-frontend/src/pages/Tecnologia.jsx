import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { DataTable } from "../components/data-table";
import { StatusBadge } from "../components/status-badge";
import { EquipmentModal } from "../components/modals/EquipmentModal";
import { apiRequest } from "../lib/api";
import { Search, Edit, Trash2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const initialEquipo = {
  numeroSerie: "",
  equipo: "",
  responsable: "",
  area: "",
  descripcion: "",
  estado: "activo",
  fechaAdquisicion: "",
  fechaAsignacion: "",
  fechaBaja: "",
};

const mapEquipo = (equipo) => ({
  numeroSerie: equipo.num_serie,
  equipo: equipo.equipo,
  responsable: equipo.responsable || "",
  area: equipo.area || "",
  descripcion: equipo.descripcion || "",
  estado: equipo.estado || "desconocido",
  fechaAdquisicion: equipo.fecha_adquisicion || "",
  fechaAsignacion: equipo.fecha_asignacion || "",
  fechaBaja: equipo.fecha_baja && equipo.fecha_baja !== "1900-01-01" ? equipo.fecha_baja : "",
});

const mapHistorial = (mantenimiento) => ({
  idMantenimiento: mantenimiento.id_historial,
  numeroSerie: mantenimiento.num_serie,
  falla: mantenimiento.falla || "Sin detalle",
  solucion: mantenimiento.solucion || "Pendiente",
  tecnico: mantenimiento.usuario_tecnico || "Sin asignar",
  fechaReporte: mantenimiento.fecha_reporte || "",
  fechaSolucion: mantenimiento.fecha_solucion || "Pendiente",
});

export default function Tecnologia() {
  const [searchEquipos, setSearchEquipos] = useState("");
  const [searchHistoriales, setSearchHistoriales] = useState("");
  const [equiposData, setEquiposData] = useState([]);
  const [historialesData, setHistorialesData] = useState([]);
  const [isLoadingEquipos, setIsLoadingEquipos] = useState(true);
  const [isLoadingHistoriales, setIsLoadingHistoriales] = useState(true);
  const [equiposError, setEquiposError] = useState("");
  const [historialesError, setHistorialesError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState(initialEquipo);
  const [editingEquipo, setEditingEquipo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  const loadEquipos = async () => {
    setIsLoadingEquipos(true);
    setEquiposError("");

    try {
      const equipos = await apiRequest("/equipos");
      setEquiposData(Array.isArray(equipos) ? equipos.map(mapEquipo) : []);
    } catch (error) {
      console.error("Error al cargar los equipos:", error);
      setEquiposError(error.message || "Ocurrio un error al cargar los equipos");
    } finally {
      setIsLoadingEquipos(false);
    }
  };

  const loadHistoriales = async () => {
    setIsLoadingHistoriales(true);
    setHistorialesError("");

    try {
      const mantenimientos = await apiRequest("/equipos/mantenimientos");
      setHistorialesData(Array.isArray(mantenimientos) ? mantenimientos.map(mapHistorial) : []);
    } catch (error) {
      console.error("Error al cargar los mantenimientos:", error);
      setHistorialesError(error.message || "Ocurrio un error al cargar los mantenimientos");
    } finally {
      setIsLoadingHistoriales(false);
    }
  };

  useEffect(() => {
    loadEquipos();
    loadHistoriales();
  }, []);

  const updateNuevoEquipo = (field, value) => {
    setNuevoEquipo((current) => ({ ...current, [field]: value }));
  };

  const openCreateModal = () => {
    setEditingEquipo(null);
    setModalError("");
    setNuevoEquipo(initialEquipo);
    setShowModal(true);
  };

  const openEditModal = (equipo) => {
    setEditingEquipo(equipo.numeroSerie);
    setModalError("");
    setNuevoEquipo({ ...equipo });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEquipo(null);
    setModalError("");
    setNuevoEquipo(initialEquipo);
  };

  const handleGuardarEquipo = async () => {
    setIsSubmitting(true);
    setModalError("");

    const payload = {
      num_serie: nuevoEquipo.numeroSerie.trim(),
      equipo: nuevoEquipo.equipo.trim(),
      responsable: nuevoEquipo.responsable.trim(),
      area: nuevoEquipo.area.trim(),
      descripcion: nuevoEquipo.descripcion.trim(),
      estado: nuevoEquipo.estado,
      fecha_adquisicion: nuevoEquipo.fechaAdquisicion,
      fecha_asignacion: nuevoEquipo.fechaAsignacion,
      fecha_baja: nuevoEquipo.fechaBaja,
    };

    try {
      if (editingEquipo) {
        await apiRequest(`/equipos/${editingEquipo}`, {
          method: "PUT",
          body: {
            equipo: payload.equipo,
            responsable: payload.responsable,
            area: payload.area,
            descripcion: payload.descripcion,
            estado: payload.estado,
            fecha_adquisicion: payload.fecha_adquisicion,
            fecha_asignacion: payload.fecha_asignacion,
            fecha_baja: payload.fecha_baja,
          },
        });
      } else {
        await apiRequest("/equipos", {
          method: "POST",
          body: payload,
        });
      }

      await loadEquipos();
      closeModal();
    } catch (error) {
      console.error("Error al guardar el equipo:", error);
      setModalError(error.message || "No se pudo guardar el equipo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEliminarEquipo = async (equipo) => {
    const confirmed = window.confirm(`¿Deseas eliminar el equipo ${equipo.equipo}?`);
    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/equipos/${equipo.numeroSerie}`, {
        method: "DELETE",
      });
      await loadEquipos();
    } catch (error) {
      console.error("Error al eliminar el equipo:", error);
      setEquiposError(error.message || "No se pudo eliminar el equipo");
    }
  };

  const filteredEquiposData = useMemo(() => {
    const normalizedSearch = searchEquipos.trim().toLowerCase();

    if (!normalizedSearch) {
      return equiposData;
    }

    return equiposData.filter((equipo) =>
      [equipo.numeroSerie, equipo.equipo, equipo.responsable, equipo.area, equipo.estado]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch))
    );
  }, [equiposData, searchEquipos]);

  const filteredHistorialesData = useMemo(() => {
    const normalizedSearch = searchHistoriales.trim().toLowerCase();

    if (!normalizedSearch) {
      return historialesData;
    }

    return historialesData.filter((historial) =>
      [
        historial.idMantenimiento,
        historial.numeroSerie,
        historial.falla,
        historial.solucion,
        historial.tecnico,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch))
    );
  }, [historialesData, searchHistoriales]);

  const equiposColumns = [
    { key: "numeroSerie", header: "No. de Serie", width: "15%" },
    { key: "equipo", header: "Equipo", width: "25%" },
    { key: "responsable", header: "Responsable", width: "15%" },
    { key: "area", header: "Area", width: "15%" },
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
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => openEditModal(row)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openEditModal(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEliminarEquipo(row)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const historialesColumns = [
    { key: "idMantenimiento", header: "ID Mantenimiento", width: "12%" },
    { key: "numeroSerie", header: "No. de Serie", width: "12%" },
    { key: "falla", header: "Falla", width: "18%" },
    { key: "solucion", header: "Solucion", width: "18%" },
    { key: "tecnico", header: "Tecnico", width: "12%" },
    { key: "fechaReporte", header: "Fecha Reporte", width: "10%" },
    { key: "fechaSolucion", header: "Fecha Solucion", width: "10%" },
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">Tecnologia</h1>
          <p className="text-gray-600">Gestion de equipos y mantenimientos</p>
        </div>

        <Tabs defaultValue="equipos" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="equipos">Equipos</TabsTrigger>
            <TabsTrigger value="soportes">Soportes</TabsTrigger>
            <TabsTrigger value="historiales">Historiales</TabsTrigger>
          </TabsList>

          <TabsContent value="equipos" className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Buscar por numero de serie, equipo o responsable..."
                    className="pl-10"
                    value={searchEquipos}
                    onChange={(e) => setSearchEquipos(e.target.value)}
                  />
                </div>

                <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700">
                  Nuevo Equipo
                </Button>
              </div>
            </div>

            {equiposError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {equiposError}
              </div>
            ) : (
              <DataTable
                columns={equiposColumns}
                data={filteredEquiposData}
                emptyMessage={
                  isLoadingEquipos
                    ? "Cargando equipos..."
                    : "No se encontraron equipos para el filtro actual"
                }
              />
            )}

            <EquipmentModal
              open={showModal}
              equipment={nuevoEquipo}
              onChange={updateNuevoEquipo}
              onClose={closeModal}
              onSubmit={handleGuardarEquipo}
              isEditing={Boolean(editingEquipo)}
              isSubmitting={isSubmitting}
              error={modalError}
            />
          </TabsContent>

          <TabsContent value="soportes" className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-4 rounded-full bg-blue-100 p-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>

                <h3 className="mb-2 text-lg font-medium text-gray-900">Modulo de Soportes</h3>

                <p className="max-w-md text-gray-500">
                  Esta seccion esta preparada para gestionar tickets y reportes tecnicos.
                  Proximamente disponible.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historiales" className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Buscar por ID de mantenimiento o numero de serie..."
                  className="pl-10"
                  value={searchHistoriales}
                  onChange={(e) => setSearchHistoriales(e.target.value)}
                />
              </div>
            </div>

            {historialesError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {historialesError}
              </div>
            ) : (
              <DataTable
                columns={historialesColumns}
                data={filteredHistorialesData}
                emptyMessage={
                  isLoadingHistoriales
                    ? "Cargando mantenimientos..."
                    : "No se encontraron mantenimientos para el filtro actual"
                }
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
