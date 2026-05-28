import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { BaseModal } from "./BaseModal";

export function ProductModal({
  open,
  product,
  onChange,
  onClose,
  onSubmit,
  isEditing = false,
  isSubmitting = false,
  error = "",
}) {
  if (!open) {
    return null;
  }

  return (
    <BaseModal
      title={isEditing ? "Editar Producto" : "Nuevo Producto"}
      onClose={onClose}
      footer={
        <div className="space-y-3">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Producto" : "Guardar Producto"}
            </Button>
          </div>
        </div>
      }
    >
      <Input
        placeholder="Codigo"
        value={product.codigo}
        onChange={(e) => onChange("codigo", e.target.value)}
        disabled={isEditing}
      />

      <Input
        placeholder="Producto"
        value={product.nom_producto}
        onChange={(e) => onChange("nom_producto", e.target.value)}
      />

      <textarea
        placeholder="Descripcion"
        className="min-h-[100px] w-full rounded-md border border-gray-300 p-2"
        value={product.desc_producto}
        onChange={(e) => onChange("desc_producto", e.target.value)}
      />

      <Input
        type="number"
        placeholder="Precio Publico"
        value={product.pre_publico}
        onChange={(e) => onChange("pre_publico", e.target.value)}
      />

      <Input
        type="number"
        placeholder="Precio Proveedor"
        value={product.pre_proveedor}
        onChange={(e) => onChange("pre_proveedor", e.target.value)}
      />

      <Input
        type="number"
        placeholder="Existencias"
        value={product.existencias}
        onChange={(e) => onChange("existencias", e.target.value)}
      />
    </BaseModal>
  );
}
