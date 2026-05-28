import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { BaseModal } from "./BaseModal";

export function UserModal({
  open,
  user,
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
      title={isEditing ? "Editar Usuario" : "Nuevo Usuario"}
      onClose={onClose}
      footer={
        <div className="space-y-3">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Usuario" : "Guardar Usuario"}
            </Button>
          </div>
        </div>
      }
    >
      <Input
        placeholder="Nombre"
        value={user.nombre}
        onChange={(e) => onChange("nombre", e.target.value)}
      />

      <Input
        placeholder="Usuario"
        value={user.usuario}
        onChange={(e) => onChange("usuario", e.target.value)}
        disabled={isEditing}
      />

      <Input
        type="password"
        placeholder={isEditing ? "Nueva contrasena (opcional)" : "Contrasena"}
        value={user.contrasena}
        onChange={(e) => onChange("contrasena", e.target.value)}
      />

      <Input
        placeholder="Area"
        value={user.area}
        onChange={(e) => onChange("area", e.target.value)}
      />

      <Input
        type="email"
        placeholder="Correo"
        value={user.correo}
        onChange={(e) => onChange("correo", e.target.value)}
      />

      <select
        className="w-full rounded-md border border-gray-300 p-2"
        value={user.estado}
        onChange={(e) => onChange("estado", e.target.value)}
      >
        <option value="">Seleccione un estado</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
    </BaseModal>
  );
}
