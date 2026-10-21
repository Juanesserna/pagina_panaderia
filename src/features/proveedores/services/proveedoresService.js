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
import { initialProveedores } from '../mocks/proveedoresMockData'

const DELAY_MS = 300

// "Base de datos" en memoria (se pierde al recargar; es solo para maquetar).
let proveedores = [...initialProveedores]

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS))
}

export function fetchProveedores() {
  return delay([...proveedores])
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
  }
  proveedores = [...proveedores, nuevo]
  return delay(nuevo)
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
  )
  return delay(proveedores.find((p) => p.id === id))
}

export function deleteProveedor(id) {
  proveedores = proveedores.filter((p) => p.id !== id)
  return delay(true)
}

export function changeEstadoProveedor(id, nuevoEstado) {
  proveedores = proveedores.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
  return delay(proveedores.find((p) => p.id === id))
}

/* ─── MIGRACIÓN_SQL ────────────────────────────────────────────────────────
   Necesaria para que "descripción" tenga dónde guardarse en tb_proveedor
   (misma decisión que se tomó para tb_insumo). Ejecútala una sola vez:

   ALTER TABLE tb_proveedor ADD COLUMN descripcion TEXT;

   "Código" se deriva de id_proveedor y no requiere columna nueva.
   No se agregó historial ni fechas de creación/actualización porque
   tb_proveedor tampoco las tiene, igual que tb_insumo.
──────────────────────────────────────────────────────────────────────────── */
