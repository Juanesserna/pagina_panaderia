// Servicio 100% simulado: no hay backend conectado todavía.
// Guarda los usuarios en un arreglo en memoria (se reinicia al recargar la
// página) y expone funciones async con un pequeño delay, para que el día que
// se conecte la API real sólo haya que reemplazar el cuerpo de estas
// funciones sin tocar el resto del feature (hooks/componentes ya esperan
// promesas).

export const ROLES = ['Gerente', 'Panadero', 'Cliente', 'Vendedor']

export const ESTADOS = ['Activo', 'Inactivo']

// Módulos que cada rol ve "de fábrica". Usado sólo para simular la sección
// "Módulos visibles" del detalle de usuario.
export const MODULOS = [
  'Dashboard',
  'Ventas',
  'Productos',
  'Categorías',
  'Compras',
  'Insumos',
  'Producción',
  'Proveedores',
  'Roles',
  'Usuarios',
]

const ROLE_MODULES = {
  Gerente: ['Dashboard', 'Productos', 'Insumos', 'Proveedores', 'Compras', 'Producción', 'Ventas'],
  Panadero: ['Dashboard', 'Insumos', 'Producción'],
  Cliente: ['Dashboard', 'Ventas'],
  Vendedor: ['Dashboard', 'Ventas', 'Productos'],
}
let usuarios = [
  {
    id: 1,
    cedula: '1234567890',
    nombre: 'Ana Martínez',
    email: 'ana@alhorno.mx',
    telefono: '3001234567',
    rol: 'Gerente',
    estado: 'Activo',
    extraModulos: ['Usuarios'],
  },
  {
    id: 2,
    cedula: '0987654321',
    nombre: 'Juan Pérez',
    email: 'juan@alhorno.mx',
    telefono: '3007654321',
    rol: 'Panadero',
    estado: 'Activo',
    extraModulos: [],
  },
  {
    id: 3,
    cedula: '1122334455',
    nombre: 'Luis Ramírez',
    email: 'luis@alhorno.mx',
    telefono: '3011223344',
    rol: 'Cliente',
    estado: 'Activo',
    extraModulos: [],
  },
  {
    id: 4,
    cedula: '2233445566',
    nombre: 'María Fuentes',
    email: 'maria@alhorno.mx',
    telefono: '3022334455',
    rol: 'Vendedor',
    estado: 'Activo',
    extraModulos: [],
  },
  {
    id: 5,
    cedula: '3344556677',
    nombre: 'Carlos Gómez',
    email: 'carlos@alhorno.mx',
    telefono: '3033445566',
    rol: 'Cliente',
    estado: 'Activo',
    extraModulos: [],
  },
  {
    id: 6,
    cedula: '4455667788',
    nombre: 'Paula Rojas',
    email: 'paula@alhorno.mx',
    telefono: '3044556677',
    rol: 'Cliente',
    estado: 'Activo',
    extraModulos: [],
  },
  {
    id: 7,
    cedula: '5566778899',
    nombre: 'Diego Torres',
    email: 'diego@alhorno.mx',
    telefono: '3055667788',
    rol: 'Cliente',
    estado: 'Inactivo',
    extraModulos: [],
  },
  {
    id: 8,
    cedula: '6677889900',
    nombre: 'Sofía Castro',
    email: 'sofia@alhorno.mx',
    telefono: '3066778899',
    rol: 'Cliente',
    estado: 'Inactivo',
    extraModulos: [],
  },
]

let nextId = usuarios.length + 1

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))



export function getModulosVisibles(usuario) {
  const base = ROLE_MODULES[usuario.rol] ?? []
  const extra = usuario.extraModulos ?? []
  const set = new Set([...base, ...extra])
  return MODULOS.filter((m) => set.has(m)).map((m) => ({ nombre: m, esExtra: extra.includes(m) }))
}

export async function fetchUsuarios() {
  await delay(400)
  return usuarios.map((u) => ({ ...u }))
}


// TODO: reemplazar por el usuario real cuando exista autenticación de verdad
// (AuthContext / token / lo que se decida). Por ahora, como no hay sesión
// real en el proyecto, devolvemos el mismo usuario que Header.jsx ya
// muestra como "logueado" (Ana Martínez), para no inventar una persona
// nueva ni datos que no existan en el mock.
export async function getUsuarioActual() {
  await delay(300)
  const usuario = usuarios.find((u) => u.id === 1)
  return { ...usuario }
}

export async function createUsuario(data) {
  await delay(600)
  const nuevo = { id: nextId++, extraModulos: [], ...data }
  usuarios = [nuevo, ...usuarios]
  return { ...nuevo }
}

export async function updateUsuario(id, data) {
  await delay(600)
  usuarios = usuarios.map((u) => (u.id === id ? { ...u, ...data } : u))
  return usuarios.find((u) => u.id === id)
}

// Cuenta cuántos Gerentes hay en el sistema (sin importar el estado),
// tal como lo describe el caso de uso: "si el usuario a eliminar es el
// único Gerente del sistema, se muestra un mensaje de advertencia".
export function esUnicoGerente(usuario) {
  if (usuario.rol !== 'Gerente') return false
  const gerentes = usuarios.filter((u) => u.rol === 'Gerente')
  return gerentes.length === 1 && gerentes[0].id === usuario.id
}

export async function toggleEstadoUsuario(id) {
  await delay(600)
  usuarios = usuarios.map((u) =>
    u.id === id ? { ...u, estado: u.estado === 'Activo' ? 'Inactivo' : 'Activo' } : u
  )
  return usuarios.find((u) => u.id === id)
}


// CU.09.06 — Simulado: como en este proyecto no existe todavía un
// PasswordHash real ni backend conectado, no hay contra qué comparar
// "actual". Por eso no la validamos de verdad; solo simulamos el delay y
// devolvemos éxito, dejando la puerta abierta a que el día que haya API
// real, esta sea la única función que haya que reemplazar (el diálogo y
// MiPerfilPage no cambian).
export async function cambiarPassword(id, { actual, nueva }) {
  await delay(600)
  return { ok: true }
}
