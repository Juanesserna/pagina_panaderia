// Llamadas a "API" del feature Insumos.
// Por ahora son mocks en memoria con delay simulado; cuando exista el
// backend real, solo hay que cambiar el cuerpo de cada función (misma firma).

const DELAY_MS = 300;

const categorias = [
  { id: 1, nombre: "Harinas y Cereales", tipo: "Insumo" },
  { id: 2, nombre: "Lácteos y Grasas", tipo: "Insumo" },
  { id: 3, nombre: "Endulzantes y Azúcares", tipo: "Insumo" },
  { id: 4, nombre: "Levaduras y Leudantes", tipo: "Insumo" },
  { id: 5, nombre: "Esencias y Especias", tipo: "Insumo" },
];

const unidadesMedida = [
  { id: 1, nombre: "Kilogramo", abreviatura: "kg" },
  { id: 2, nombre: "Gramo", abreviatura: "g" },
  { id: 3, nombre: "Litro", abreviatura: "L" },
  { id: 4, nombre: "Mililitro", abreviatura: "ml" },
  { id: 5, nombre: "Unidad", abreviatura: "und" },
];

// "Base de datos" en memoria (se pierde al recargar; es solo para maquetar).
let insumos = [
  {
    id: 1,
    nombre: "Harina de Trigo Fortificada Multipropósito",
    descripcion: "Harina de trigo de alta calidad para pan artesanal",
    idCategoria: 1,
    idUnidadMedida: 1,
    stockActual: 8,
    stockMinimo: 50,
    costoPromedio: 2.35,
    estado: true,
    lotes: [
      {
        id: 14,
        idCompra: 41,
        codigoLote: "LT-20260530-00014",
        cantidadRecibida: 5,
        cantidadDisponible: 3,
        fechaRecepcion: "2026-05-30",
        fechaVencimiento: "2026-07-20",
      },
      {
        id: 12,
        idCompra: 45,
        codigoLote: "LT-20260622-00012",
        cantidadRecibida: 5,
        cantidadDisponible: 5,
        fechaRecepcion: "2026-06-22",
        fechaVencimiento: "2026-08-15",
      },
    ],
  },
  {
    id: 2,
    nombre: "Mantequilla Sin Sal 80% Grasa",
    descripcion: "Mantequilla sin sal para repostería fina",
    idCategoria: 2,
    idUnidadMedida: 1,
    stockActual: 65,
    stockMinimo: 20,
    costoPromedio: 6.4,
    estado: true,
    lotes: [
      {
        id: 31,
        idCompra: 46,
        codigoLote: "LT-20260618-00031",
        cantidadRecibida: 25,
        cantidadDisponible: 25,
        fechaRecepcion: "2026-06-18",
        fechaVencimiento: "2026-07-15",
      },
    ],
  },
  {
    id: 3,
    nombre: "Azúcar Refinada Blanco Especial",
    descripcion: "Azúcar blanca refinada de caña",
    idCategoria: 3,
    idUnidadMedida: 1,
    stockActual: 180,
    stockMinimo: 30,
    costoPromedio: 1.8,
    estado: true,
    lotes: [],
  },
  {
    id: 4,
    nombre: "Levadura Fresca en Pasta",
    descripcion: "Levadura fresca para fermentación de panes",
    idCategoria: 4,
    idUnidadMedida: 1,
    stockActual: 0,
    stockMinimo: 5,
    costoPromedio: 0,
    estado: false,
    lotes: [],
  },
  {
    id: 5,
    nombre: "Esencia de Vainilla Negra",
    descripcion: "Extracto puro de vainilla",
    idCategoria: 5,
    idUnidadMedida: 4,
    stockActual: 890,
    stockMinimo: 200,
    costoPromedio: 0.35,
    estado: true,
    lotes: [],
  },
];

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));
}

export function getCategorias() {
  return categorias;
}

export function getUnidadesMedida() {
  return unidadesMedida;
}

export function fetchInsumos() {
  return delay([...insumos]);
}

export function createInsumo(data) {
  const nuevo = {
    id: insumos.length ? Math.max(...insumos.map((i) => i.id)) + 1 : 1,
    nombre: data.nombre,
    descripcion: data.descripcion,
    idCategoria: Number(data.idCategoria),
    idUnidadMedida: Number(data.idUnidadMedida),
    stockActual: 0,
    stockMinimo: Number(data.stockMinimo) || 0,
    costoPromedio: 0,
    estado: data.estado,
    lotes: [],
  };
  insumos = [...insumos, nuevo];
  return delay(nuevo);
}

export function updateInsumo(id, data) {
  insumos = insumos.map((i) =>
    i.id === id
      ? {
          ...i,
          nombre: data.nombre,
          descripcion: data.descripcion,
          idCategoria: Number(data.idCategoria),
          idUnidadMedida: Number(data.idUnidadMedida),
          stockMinimo: Number(data.stockMinimo),
          estado: data.estado,
        }
      : i
  );
  return delay(insumos.find((i) => i.id === id));
}

export function deleteInsumo(id) {
  insumos = insumos.filter((i) => i.id !== id);
  return delay(true);
}

export function changeEstadoInsumo(id, nuevoEstado) {
  insumos = insumos.map((i) => (i.id === id ? { ...i, estado: nuevoEstado } : i));
  return delay(insumos.find((i) => i.id === id));
}
