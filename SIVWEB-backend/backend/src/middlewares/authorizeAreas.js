function normalizeArea(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function hasGlobalAccess(area) {
  const normalized = normalizeArea(area);
  return normalized === "jefe" || normalized === "gerente";
}

function authorizeAreas(...allowedAreas) {
  const allowedSet = new Set(allowedAreas.map(normalizeArea));

  return (req, res, next) => {
    const area = req.user?.area;
    const normalizedArea = normalizeArea(area);

    if (!normalizedArea) {
      return res.status(403).json({ success: false, message: "No autorizado" });
    }

    if (hasGlobalAccess(area) || allowedSet.has(normalizedArea)) {
      return next();
    }

    return res.status(403).json({ success: false, message: "No autorizado" });
  };
}

module.exports = {
  authorizeAreas,
  normalizeArea,
  hasGlobalAccess,
};
