import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { DataTable } from "../components/data-table";
import { StatusBadge } from "../components/status-badge";
import { UserModal } from "../components/modals/UserModal";
import { apiRequest } from "../lib/api";
import { Search, Edit, Trash2, Eye, UserPlus } from "lucide-react";

const initialUsuario = {
  nombre: "",
  usuario: "",
  contrasena: "",
  area: "",
  correo: "",
  estado: "activo",
};

export default function RecursosHumanos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(false);
  const [usuariosData, setUsuariosData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState(initialUsuario);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [pageError, setPageError] = useState("");

  const loadUsuarios = async () => {
    setIsLoadingUsuarios(true);
    setPageError("");

    try {
      const data = await apiRequest("/usuarios");
      setUsuariosData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
      setPageError(error.message || "No se pudieron cargar los usuarios");
    } finally {
      setIsLoadingUsuarios(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const updateNuevoUsuario = (field, value) => {
    setNuevoUsuario((current) => ({ ...current, [field]: value }));
  };

  const openCreateModal = () => {
    setEditingUsuario(null);
    setModalError("");
    setNuevoUsuario(initialUsuario);
    setShowModal(true);
  };

  const openEditModal = (usuario) => {
    setEditingUsuario(usuario.usuario);
    setModalError("");
    setNuevoUsuario({
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      contrasena: "",
      area: usuario.area,
      correo: usuario.correo,
      estado: usuario.estado,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUsuario(null);
    setModalError("");
    setNuevoUsuario(initialUsuario);
  };

  const handleGuardarUsuario = async () => {
    setIsSubmitting(true);
    setModalError("");

    const payload = {
      nombre: nuevoUsuario.nombre.trim(),
      usuario: nuevoUsuario.usuario.trim(),
      contrasena: nuevoUsuario.contrasena,
      area: nuevoUsuario.area.trim(),
      correo: nuevoUsuario.correo.trim(),
      estado: nuevoUsuario.estado || "activo",
    };

    try {
      if (editingUsuario) {
        const body = {
          nombre: payload.nombre,
          area: payload.area,
          correo: payload.correo,
          estado: payload.estado,
        };

        if (payload.contrasena) {
          body.contrasena = payload.contrasena;
        }

        await apiRequest(`/usuarios/${editingUsuario}`, {
          method: "PUT",
          body,
        });
      } else {
        await apiRequest("/usuarios", {
          method: "POST",
          body: payload,
        });
      }

      await loadUsuarios();
      closeModal();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      setModalError(error.message || "No se pudo guardar el usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEliminarUsuario = async (usuario) => {
    const confirmed = window.confirm(`¿Deseas eliminar al usuario ${usuario.nombre}?`);
    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/usuarios/${usuario.usuario}`, {
        method: "DELETE",
      });
      await loadUsuarios();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setPageError(error.message || "No se pudo eliminar el usuario");
    }
  };

  const filteredUsuarios = usuariosData.filter((usuario) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      usuario.nombre.toLowerCase().includes(searchLower) ||
      usuario.usuario.toLowerCase().includes(searchLower) ||
      usuario.area.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    { key: "nombre", header: "Nombre", width: "22%" },
    { key: "usuario", header: "Usuario", width: "15%" },
    { key: "area", header: "Area", width: "18%" },
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
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => openEditModal(row)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openEditModal(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEliminarUsuario(row)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">Listado de Usuarios</h1>
          <p className="text-gray-600">Administracion de personal y permisos</p>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Buscar por nombre, usuario o area..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button onClick={openCreateModal} className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700">
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </Button>
          </div>
        </div>

        {pageError ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {pageError}
          </div>
        ) : null}

        <DataTable
          columns={columns}
          data={filteredUsuarios}
          emptyMessage={isLoadingUsuarios ? "Cargando usuarios..." : "No se encontraron usuarios"}
        />

        <UserModal
          open={showModal}
          user={nuevoUsuario}
          onChange={updateNuevoUsuario}
          onClose={closeModal}
          onSubmit={handleGuardarUsuario}
          isEditing={Boolean(editingUsuario)}
          isSubmitting={isSubmitting}
          error={modalError}
        />
      </div>
    </div>
  );
}
