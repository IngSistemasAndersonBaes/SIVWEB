import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { DataTable } from "../components/data-table";
import { StatusBadge } from "../components/status-badge";
import { ProductModal } from "../components/modals/ProductModal";
import { apiRequest } from "../lib/api";
import { Search, Edit, Trash2, Eye, Plus } from "lucide-react";

const initialProducto = {
  codigo: "",
  nom_producto: "",
  desc_producto: "",
  pre_publico: "",
  pre_proveedor: "",
  existencias: "",
};

const mapProducto = (producto) => {
  const existencias = Number(producto.existencias) || 0;

  return {
    codigo: producto.codigo,
    nom_producto: producto.nom_producto,
    desc_producto: producto.desc_producto,
    pre_publico: Number(producto.pre_publico) || 0,
    pre_proveedor: Number(producto.pre_proveedor) || 0,
    existencias,
    stockLevel: existencias <= 15 ? "low" : "normal",
  };
};

export default function Almacen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingProductos, setIsLoadingProductos] = useState(false);
  const [productosData, setProductosData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState(initialProducto);
  const [editingCodigo, setEditingCodigo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [pageError, setPageError] = useState("");

  const loadProductos = async () => {
    setIsLoadingProductos(true);
    setPageError("");

    try {
      const data = await apiRequest("/productos");
      setProductosData(Array.isArray(data) ? data.map(mapProducto) : []);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      setPageError(error.message || "No se pudieron cargar los productos");
    } finally {
      setIsLoadingProductos(false);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const updateNuevoProducto = (field, value) => {
    setNuevoProducto((current) => ({ ...current, [field]: value }));
  };

  const openCreateModal = () => {
    setEditingCodigo(null);
    setModalError("");
    setNuevoProducto(initialProducto);
    setShowModal(true);
  };

  const openEditModal = (producto) => {
    setEditingCodigo(producto.codigo);
    setModalError("");
    setNuevoProducto({
      codigo: producto.codigo,
      nom_producto: producto.nom_producto,
      desc_producto: producto.desc_producto,
      pre_publico: String(producto.pre_publico),
      pre_proveedor: String(producto.pre_proveedor),
      existencias: String(producto.existencias),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCodigo(null);
    setModalError("");
    setNuevoProducto(initialProducto);
  };

  const handleGuardarProducto = async () => {
    setIsSubmitting(true);
    setModalError("");

    const payload = {
      codigo: nuevoProducto.codigo.trim(),
      nom_producto: nuevoProducto.nom_producto.trim(),
      desc_producto: nuevoProducto.desc_producto.trim(),
      pre_publico: Number(nuevoProducto.pre_publico),
      pre_proveedor: Number(nuevoProducto.pre_proveedor),
      existencias: Number(nuevoProducto.existencias),
    };

    try {
      if (editingCodigo) {
        await apiRequest(`/productos/${editingCodigo}`, {
          method: "PUT",
          body: {
            nom_producto: payload.nom_producto,
            desc_producto: payload.desc_producto,
            pre_publico: payload.pre_publico,
            pre_proveedor: payload.pre_proveedor,
            existencias: payload.existencias,
          },
        });
      } else {
        await apiRequest("/productos", {
          method: "POST",
          body: payload,
        });
      }

      await loadProductos();
      closeModal();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      setModalError(error.message || "No se pudo guardar el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEliminarProducto = async (producto) => {
    const confirmed = window.confirm(`¿Deseas eliminar el producto ${producto.nom_producto}?`);
    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/productos/${producto.codigo}`, {
        method: "DELETE",
      });
      await loadProductos();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      setPageError(error.message || "No se pudo eliminar el producto");
    }
  };

  const filteredProductos = productosData.filter((producto) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      producto.codigo.toLowerCase().includes(searchLower) ||
      producto.nom_producto.toLowerCase().includes(searchLower) ||
      producto.desc_producto.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    { key: "codigo", header: "Codigo", width: "10%" },
    { key: "nom_producto", header: "Producto", width: "20%" },
    { key: "desc_producto", header: "Descripcion", width: "25%" },
    { key: "pre_publico", header: "Precio Publico", width: "12%" },
    { key: "pre_proveedor", header: "Precio Proveedor", width: "12%" },
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
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => openEditModal(row)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openEditModal(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEliminarProducto(row)}>
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
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">Listado de Productos</h1>
          <p className="text-gray-600">Gestion de inventario y control de stock</p>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Buscar por codigo, producto o descripcion..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button onClick={openCreateModal} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4" />
              <span>Nuevo Producto</span>
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
          data={filteredProductos}
          emptyMessage={isLoadingProductos ? "Cargando productos..." : "No se encontraron productos"}
        />

        <ProductModal
          open={showModal}
          product={nuevoProducto}
          onChange={updateNuevoProducto}
          onClose={closeModal}
          onSubmit={handleGuardarProducto}
          isEditing={Boolean(editingCodigo)}
          isSubmitting={isSubmitting}
          error={modalError}
        />
      </div>
    </div>
  );
}
