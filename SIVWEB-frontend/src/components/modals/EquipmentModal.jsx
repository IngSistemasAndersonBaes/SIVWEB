import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { BaseModal } from "./BaseModal";

export function EquipmentModal({
  open,
  equipment,
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
      title={isEditing ? "Editar Equipo" : "Nuevo Equipo"}
      onClose={onClose}
      maxWidth="max-w-2xl"
      footer={
        <div className="space-y-3">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Equipo" : "Guardar Equipo"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          placeholder="No. de Serie"
          value={equipment.numeroSerie}
          onChange={(e) => onChange("numeroSerie", e.target.value)}
          disabled={isEditing}
        />

        <Input
          placeholder="Equipo"
          value={equipment.equipo}
          onChange={(e) => onChange("equipo", e.target.value)}
        />

        <Input
          placeholder="Responsable"
          value={equipment.responsable}
          onChange={(e) => onChange("responsable", e.target.value)}
        />

        <Input
          placeholder="Area"
          value={equipment.area}
          onChange={(e) => onChange("area", e.target.value)}
        />

        <Input
          type="date"
          placeholder="Fecha de adquisicion"
          value={equipment.fechaAdquisicion}
          onChange={(e) => onChange("fechaAdquisicion", e.target.value)}
        />

        <Input
          type="date"
          placeholder="Fecha de asignacion"
          value={equipment.fechaAsignacion}
          onChange={(e) => onChange("fechaAsignacion", e.target.value)}
        />

        <Input
          type="date"
          placeholder="Fecha de baja"
          value={equipment.fechaBaja}
          onChange={(e) => onChange("fechaBaja", e.target.value)}
        />

        <select
          className="w-full rounded-md border border-gray-300 p-2"
          value={equipment.estado}
          onChange={(e) => onChange("estado", e.target.value)}
        >
          <option value="">Seleccione un estado</option>
          <option value="activo">Activo</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="reservado">Reservado</option>
          <option value="inactivo">Inactivo</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      <textarea
        placeholder="Descripcion"
        className="min-h-[110px] w-full rounded-md border border-gray-300 p-2"
        value={equipment.descripcion}
        onChange={(e) => onChange("descripcion", e.target.value)}
      />
    </BaseModal>
  );
}
