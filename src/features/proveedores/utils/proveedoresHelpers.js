// "Código" no es columna real: se deriva de id_proveedor (igual que en Insumos).
export function formatoCodigo(id) {
  return `PRV-${String(id).padStart(3, "0")}`;
}

// "estado" es BOOLEAN real (true = Activo, false = Inactivo), sin niveles
// intermedios como en Insumos (que sí tiene "Stock Bajo").
export function getEstadoVisual(proveedor) {
  return proveedor.estado ? "Activo" : "Inactivo";
}

export const estadoVisualVariant = {
  Activo: "success",
  Inactivo: "danger",
};

export const estadoOpciones = [
  { value: "true", label: "Activo" },
  { value: "false", label: "Inactivo" },
];
