const STORAGE_KEY = "sivweb_user";

export function normalizeArea(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function hasGlobalAreaAccess(area) {
  const normalizedArea = normalizeArea(area);
  return normalizedArea === "jefe" || normalizedArea === "gerente";
}

export function getStoredUser() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  window.localStorage.removeItem(STORAGE_KEY);
}

const moduleAreaMap = {
  dashboard: null,
  tecnologia: "Tecnologia",
  almacen: "Almacen",
  finanzas: "Finanzas",
  rrhh: "Recursos Humanos",
};

export function canAccessModule(user, moduleId) {
  if (!user) {
    return false;
  }

  if (moduleId === "dashboard") {
    return true;
  }

  if (hasGlobalAreaAccess(user.area)) {
    return true;
  }

  return normalizeArea(user.area) === normalizeArea(moduleAreaMap[moduleId]);
}

export function getAllowedModules(user) {
  return Object.keys(moduleAreaMap).filter((moduleId) => canAccessModule(user, moduleId));
}
