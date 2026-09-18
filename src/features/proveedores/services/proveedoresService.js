// Llamadas a "API" del feature Proveedores.
// Por ahora son mocks en memoria con delay simulado; cuando exista el
// backend real, solo hay que cambiar el cuerpo de cada función (misma firma).
//
// Refleja tb_proveedor real:
//   id_proveedor, nombre, email, estado (BOOLEAN), nit, direccion,
//   telefono, nombre_contacto
// "descripcion" requiere columna nueva (ver MIGRACIÓN_SQL abajo), igual
// decisión que se tomó para tb_insumo. "Código" se deriva de id_proveedor,
// no es columna real.

const DELAY_MS = 300;

// "Base de datos" en memoria (se pierde al recargar; es solo para maquetar).
let proveedores = [
  {
    id: 1,
    nombre: "Molinos El Trigal S.A.",
    nit: "900.123.456-7",
    descripcion:
      "Proveedor líder de harinas y cereales para panaderías industriales",
    nombreContacto: "Roberto Jiménez",
    telefono: "+57 310 234 5678",
    email: "rjimenez@eltrigal.com",
    direccion: "Av. El Dorado 68-50",
    estado: true,
  },
  {
    id: 2,
    nombre: "Lácteos La Pradera Ltda.",
    nit: "800.654.321-2",
    descripcion: "Distribuidora de productos lácteos frescos y UHT",
    nombreContacto: "Marcela Ospina",
    telefono: "+57 315 876 4321",
    email: "marcela.ospina@lapradera.com.co",
    direccion: "Calle 10 # 43A-55, Laureles",
    estado: true,
  },
  {
    id: 3,
    nombre: "Dulces del Caribe S.A.S.",
    nit: "901.555.888-0",
    descripcion: "Importadora de azúcares refinados y panela",
    nombreContacto: "Luis Hernández",
    telefono: "+57 301 999 0011",
    email: "luis.h@dulcescaribe.co",
    direccion: "Carrera 44 # 70-30",
    estado: false,
  },
  {
    id: 4,
    nombre: "Grasas y Aceites Premium CIA.",
    nit: "700.200.100-5",
    descripcion: "Especialistas en grasas vegetales y mantequillas importadas",
    nombreContacto: "Andrea Castillo",
    telefono: "+57 320 555 7777",
    email: "a.castillo@gasprm.com",
    direccion: "Cra 5 # 16-34, San Nicolás",
    estado: true,
  },
  {
    id: 5,
    nombre: "BioLevaduras Internacional",
    nit: "860.400.200-3",
    descripcion: "Proveedor de levaduras activas y mejorantes para pan",
    nombreContacto: "Felipe Mora",
    telefono: "+57 311 100 2020",
    email: "fmora@biolev.com",
    direccion: "Zona Industrial Puente Aranda, Bod. 12",
    estado: true,
  },
];

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));
}

export function fetchProveedores() {
  return delay([...proveedores]);
}

export function createProveedor(data) {
  const nuevo = {
    id: proveedores.length ? Math.max(...proveedores.map((p) => p.id)) + 1 : 1,
    nombre: data.nombre,
    nit: data.nit,
    descripcion: data.descripcion,
    nombreContacto: data.nombreContacto,
    telefono: data.telefono,
    email: data.email,
    direccion: data.direccion,
    estado: data.estado,
  };
  proveedores = [...proveedores, nuevo];
  return delay(nuevo);
}

export function updateProveedor(id, data) {
  proveedores = proveedores.map((p) =>
    p.id === id
      ? {
          ...p,
          nombre: data.nombre,
          nit: data.nit,
          descripcion: data.descripcion,
          nombreContacto: data.nombreContacto,
          telefono: data.telefono,
          email: data.email,
          direccion: data.direccion,
          estado: data.estado,
        }
      : p
  );
  return delay(proveedores.find((p) => p.id === id));
}

export function deleteProveedor(id) {
  proveedores = proveedores.filter((p) => p.id !== id);
  return delay(true);
}

export function changeEstadoProveedor(id, nuevoEstado) {
  proveedores = proveedores.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p));
  return delay(proveedores.find((p) => p.id === id));
}

/* ─── MIGRACIÓN_SQL ────────────────────────────────────────────────────────
   Necesaria para que "descripción" tenga dónde guardarse en tb_proveedor
   (misma decisión que se tomó para tb_insumo). Ejecútala una sola vez:

   ALTER TABLE tb_proveedor ADD COLUMN descripcion TEXT;

   "Código" se deriva de id_proveedor y no requiere columna nueva.
   No se agregó historial ni fechas de creación/actualización porque
   tb_proveedor tampoco las tiene, igual que tb_insumo.
──────────────────────────────────────────────────────────────────────────── */
