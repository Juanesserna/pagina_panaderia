// Servicio 100% simulado: no hay backend conectado todavía.
// Mismo patrón que usuariosService.js: un arreglo en memoria (se reinicia
// al recargar la página) + funciones async con un pequeño delay, para que
// el día que exista una API real sólo haya que reemplazar el cuerpo de
// estas funciones sin tocar hooks ni componentes (ya esperan promesas).

export const ESTADOS = ['Activo', 'Inactivo']

// Módulos que se le pueden asignar a un rol. El ORDEN importa: se recorre
// tal cual para pintar la grilla de 2 columnas en los formularios y en el
// detalle de rol (por eso "Roles" no aparece en la lista: un rol no se
// asigna módulos a sí mismo).
export const MODULOS = [
  'Dashboard',
  'Usuarios',
  'Productos',
  'Insumos',
  'Proveedores',
  'Compras',
  'Producción',
  'Ventas',
]

let roles = [
  {
    id: 1,
    codigo: '01R',
    nombre: 'Gerente',
    estado: 'Activo',
    modulos: ['Dashboard', 'Productos', 'Insumos', 'Proveedores', 'Compras', 'Producción', 'Ventas'],
    usuariosAsignados: 2,
  },
  {
    id: 2,
    codigo: '02R',
    nombre: 'Panadero',
    estado: 'Activo',
    modulos: ['Dashboard', 'Insumos', 'Producción'],
    usuariosAsignados: 3,
  },
  {
    id: 3,
    codigo: '03R',
    nombre: 'Cliente',
    estado: 'Activo',
    modulos: ['Dashboard', 'Ventas'],
    usuariosAsignados: 0,
  },
  {
    id: 4,
    codigo: '04R',
    nombre: 'Vendedor',
    estado: 'Activo',
    modulos: ['Dashboard', 'Productos', 'Ventas'],
    usuariosAsignados: 4,
  },
]

let nextId = roles.length + 1
let nextCodigoNum = roles.length + 1

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

function maybeFail(failRate = 0.15) {
  if (Math.random() < failRate) {
    throw new Error('No se pudo completar la acción. Intenta de nuevo.')
  }
}

export function siguienteCodigo() {
  return `${String(nextCodigoNum).padStart(2, '0')}R`
}

// Un rol sólo puede eliminarse si ningún usuario lo tiene asignado
// actualmente (si no, se deja inhabilitar pero no borrar).
export function esEliminable(rol) {
  return (rol.usuariosAsignados ?? 0) === 0
}

export async function fetchRoles() {
  await delay(400)
  return roles.map((r) => ({ ...r }))
}

export async function createRole(data) {
  await delay(600)
  const nuevo = {
    id: nextId++,
    codigo: siguienteCodigo(),
    usuariosAsignados: 0,
    ...data,
  }
  nextCodigoNum++
  roles = [nuevo, ...roles]
  return { ...nuevo }
}

export async function updateRole(id, data) {
  await delay(600)
  roles = roles.map((r) => (r.id === id ? { ...r, ...data } : r))
  return roles.find((r) => r.id === id)
}

export async function toggleEstadoRole(id) {
  await delay(400)
  roles = roles.map((r) =>
    r.id === id ? { ...r, estado: r.estado === 'Activo' ? 'Inactivo' : 'Activo' } : r
  )
  return roles.find((r) => r.id === id)
}

export async function deleteRole(id) {
  await delay(600)
  maybeFail()
  roles = roles.filter((r) => r.id !== id)
  return true
}