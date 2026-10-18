import { getCategorias, getUnidadesMedida } from "../services/insumosService";

export function unidadAbrev(id) {
  return getUnidadesMedida().find((u) => u.id === id)?.abreviatura ?? "—";
}

export function nombreCategoria(id) {
  return getCategorias().find((c) => c.id === id)?.nombre ?? "—";
}

export function formatoCodigo(id) {
  return `INS-${String(id).padStart(3, "0")}`;
}

export function formatoMoneda(valor) {
  return valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 2,
  });
}

export function formatoFecha(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function diasParaVencer(fechaVencimiento) {
  if (!fechaVencimiento) return null;
  const hoyMs = new Date().setHours(0, 0, 0, 0);
  const venceMs = new Date(fechaVencimiento).setHours(0, 0, 0, 0);
  return Math.round((venceMs - hoyMs) / (1000 * 60 * 60 * 24));
}

// "Activo" | "Inactivo" | "Stock Bajo" — calculado, nunca persistido.
export function getEstadoVisual(insumo) {
  if (!insumo.estado) return "Inactivo";
  if (insumo.stockActual <= insumo.stockMinimo) return "Stock Bajo";
  return "Activo";
}

export const estadoVisualVariant = {
  Activo: "success",
  "Stock Bajo": "warning",
  Inactivo: "danger",
};
