// Servicio 100% simulado: todavía no hay backend conectado.
// Los usuarios almacenan credenciales, estado y rol.
// Los datos personales se consultan desde Clientes y Empleados.

import {
  fetchRoles,
  getPrivilegiosPorNombre,
  MODULOS as MODULOS_ROLES,
} from '../../roles/services/rolesService'

import { fetchClientes } from '../../clientes/services/clientesService'
import { fetchEmpleados } from '../../empleados/services/empleadosService'

// Se conservan para compatibilidad con los componentes actuales.
export const ROLES = ['Gerente', 'Panadero', 'Cliente', 'Vendedor']

export const ESTADOS = ['Activo', 'Inactivo']

export const MODULOS = MODULOS_ROLES

// Datos ficticios basados en tb_usuarios.
// Los datos personales pertenecen a Clientes y Empleados.
// passwordhash es únicamente un marcador simulado.
let usuarios = [
  {
    id: 1,
    email: 'ana@alhorno.mx',
    passwordhash: 'SIMULADO',
    estado: 'Activo',
    id_rol: 1,
  },
  {
    id: 2,
    email: 'juan@alhorno.mx',
    passwordhash: 'SIMULADO',
    estado: 'Activo',
    id_rol: 2,
  },
  {
    id: 3,
    email: 'luis@alhorno.mx',
    passwordhash: 'SIMULADO',
    estado: 'Activo',
    id_rol: 3,
  },
  {
    id: 4,
    email: 'maria@alhorno.mx',
    passwordhash: 'SIMULADO',
    estado: 'Activo',
    id_rol: 4,
  },
  {
    id: 5,
    email: 'carlos@alhorno.mx',
    passwordhash: 'SIMULADO',
    estado: 'Activo',
    id_rol: 3,
  },
  {
    id: 6,
    email: 'paula@alhorno.mx',
    passwordhash: 'SIMULADO',
    estado: 'Activo',
    id_rol: 3,
  },
  {
    id: 7,
    email: 'diego@alhorno.mx',
    passwordhash: 'SIMULADO',
    estado: 'Inactivo',
    id_rol: 3,
  },
  {
    id: 8,
    email: 'sofia@alhorno.mx',
    passwordhash: 'SIMULADO',
    estado: 'Inactivo',
    id_rol: 3,
  },
]

let nextId = Math.max(...usuarios.map((usuario) => usuario.id)) + 1

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Caché de roles.
let rolesCache = [
  { id: 1, nombre: 'Gerente', estado: 'Activo' },
  { id: 2, nombre: 'Panadero', estado: 'Activo' },
  { id: 3, nombre: 'Cliente', estado: 'Activo' },
  { id: 4, nombre: 'Vendedor', estado: 'Activo' },
]

async function cargarRoles() {
  const roles = await fetchRoles()
  rolesCache = roles

  return roles
}

function obtenerRol(idRol) {
  return rolesCache.find(
    (rol) => Number(rol.id) === Number(idRol)
  ) ?? null
}

// Resuelve el ID del rol.
// También admite el nombre del rol por compatibilidad.
function resolverIdRol(data, roles) {
  if (data.id_rol !== undefined && data.id_rol !== null) {
    const id = Number(data.id_rol)

    return Number.isFinite(id) ? id : null
  }

  if (data.rol) {
    const rol = roles.find(
      (item) =>
        item.nombre.toLowerCase() ===
        String(data.rol).trim().toLowerCase()
    )

    return rol?.id ?? null
  }

  return null
}

// Normaliza los datos de la cuenta.
function normalizarUsuario(data, roles) {
  return {
    email: String(data.email ?? '').trim().toLowerCase(),
    estado: String(data.estado ?? '').trim(),
    id_rol: resolverIdRol(data, roles),
  }
}

// Valida la información de la cuenta.
function validarUsuario(
  data,
  roles,
  idExcluir = null,
  esCreacion = false
) {
  if (!data || typeof data !== 'object') {
    throw new Error('Los datos del usuario no son válidos.')
  }

  const usuario = normalizarUsuario(data, roles)

  if (!usuario.email || !usuario.estado || !usuario.id_rol) {
    throw new Error('Completa todos los campos obligatorios.')
  }

  if (
    usuario.email.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(usuario.email)
  ) {
    throw new Error('Ingresa un correo electrónico válido.')
  }

  if (!ESTADOS.includes(usuario.estado)) {
    throw new Error('Selecciona un estado válido.')
  }

  const rol = roles.find(
    (item) => Number(item.id) === usuario.id_rol
  )

  if (!rol) {
    throw new Error('Selecciona un rol válido.')
  }

  // Un rol inactivo no puede asignarse a una cuenta nueva
  // ni utilizarse para cambiar el rol de una cuenta existente.
  // Sin embargo, se permite conservar el rol actual al editar.
  const usuarioExistente = usuarios.find(
    (item) => item.id === idExcluir
  )

  const conservaRolActual =
    usuarioExistente?.id_rol === usuario.id_rol

  if (rol.estado !== 'Activo' && !conservaRolActual) {
    throw new Error(
      'No puedes asignar un rol que se encuentra inactivo.'
    )
  }

  const duplicadoEmail = usuarios.some(
    (item) =>
      item.id !== idExcluir &&
      item.email.toLowerCase() === usuario.email
  )

  if (duplicadoEmail) {
    throw new Error(
      'Ya existe una cuenta registrada con ese correo.'
    )
  }

  if (esCreacion) {
    const password = String(data.password ?? '')

    if (!password) {
      throw new Error('La contraseña es obligatoria.')
    }

    if (password.length < 6) {
      throw new Error(
        'La contraseña debe tener al menos 6 caracteres.'
      )
    }
  }

  return usuario
}

// Consulta los perfiles relacionados una sola vez.
async function obtenerDatosRelacionados() {
  const [clientes, empleados] = await Promise.all([
    fetchClientes(),
    fetchEmpleados(),
  ])

  return { clientes, empleados }
}

// Construye el usuario para mostrarlo en la interfaz.
// Las relaciones se consultan exclusivamente mediante id_usuario.
function mapearUsuario(usuario, clientes, empleados) {
  const cliente = clientes.find(
    (item) => item.id_usuario === usuario.id
  ) ?? null

  const empleado = empleados.find(
    (item) => item.id_usuario === usuario.id
  ) ?? null

  const rol = obtenerRol(usuario.id_rol)

  // No se expone el marcador de contraseña a los componentes.
  const { passwordhash, ...datosCuenta } = usuario

  return {
    ...datosCuenta,
    rol: rol?.nombre ?? 'Sin rol',

    cliente,
    empleado,

    id_cliente: cliente?.id ?? null,
    id_empleado: empleado?.id ?? null,

    // Datos derivados para los componentes actuales.
    nombre: cliente?.nombre ?? empleado?.nombre ?? null,
    documento: cliente?.documento ?? empleado?.documento ?? null,
    tipoDocumento:
      cliente?.tipoDocumento ?? empleado?.tipoDocumento ?? null,
    telefono: empleado?.telefono ?? null,
  }
}

// Obtiene los módulos y privilegios heredados del rol.
export function getModulosVisibles(usuario) {
  if (!usuario) return []

  const rol = usuario.id_rol
    ? obtenerRol(usuario.id_rol)
    : rolesCache.find((item) => item.nombre === usuario.rol)

  if (!rol) return []

  const privilegios = getPrivilegiosPorNombre(rol.nombre)

  return MODULOS.filter(
    (modulo) => privilegios[modulo]?.length > 0
  ).map((modulo) => ({
    nombre: modulo,
    acciones: [...privilegios[modulo]],
    esExtra: false,
  }))
}

// Consulta todas las cuentas.
export async function fetchUsuarios() {
  await delay(400)

  await cargarRoles()

  const { clientes, empleados } = await obtenerDatosRelacionados()

  return usuarios.map((usuario) =>
    mapearUsuario(usuario, clientes, empleados)
  )
}

// Consulta la cuenta que aparece como autenticada.
export async function getUsuarioActual() {
  await delay(300)

  await cargarRoles()

  const usuario = usuarios.find((item) => item.id === 1)

  if (!usuario) return null

  const { clientes, empleados } = await obtenerDatosRelacionados()

  return mapearUsuario(usuario, clientes, empleados)
}

// Crea una cuenta de acceso.
export async function createUsuario(data) {
  await delay(600)

  const roles = await cargarRoles()
  const validado = validarUsuario(data, roles, null, true)

  const nuevo = {
    id: nextId++,
    email: validado.email,
    passwordhash: 'SIMULADO',
    estado: validado.estado,
    id_rol: validado.id_rol,
  }

  usuarios = [...usuarios, nuevo]

  const { clientes, empleados } = await obtenerDatosRelacionados()

  return mapearUsuario(nuevo, clientes, empleados)
}

// Actualiza correo, estado y rol.
// No modifica los datos personales de Clientes o Empleados.
export async function updateUsuario(id, data) {
  await delay(600)

  const existente = usuarios.find((item) => item.id === id)

  if (!existente) {
    throw new Error('El usuario que intentas actualizar no existe.')
  }

  const roles = await cargarRoles()
  const validado = validarUsuario(data, roles, id)

  // Protege al único Gerente activo frente a cambios de rol
  // y también frente a cambios de estado.
  if (
    esUnicoGerente(existente) &&
    (
      validado.id_rol !== existente.id_rol ||
      validado.estado !== 'Activo'
    )
  ) {
    throw new Error(
      'No puedes cambiar el rol ni inhabilitar al único Gerente activo del sistema.'
    )
  }

  const actualizado = {
    ...existente,
    ...validado,
  }

  usuarios = usuarios.map((item) =>
    item.id === id ? actualizado : item
  )

  const { clientes, empleados } = await obtenerDatosRelacionados()

  return mapearUsuario(actualizado, clientes, empleados)
}

// Comprueba si una cuenta es el único Gerente activo.
export function esUnicoGerente(usuario) {
  if (!usuario || usuario.estado !== 'Activo') {
    return false
  }

  const rol = usuario.id_rol
    ? obtenerRol(usuario.id_rol)
    : rolesCache.find((item) => item.nombre === usuario.rol)

  if (!rol || rol.nombre !== 'Gerente') {
    return false
  }

  const gerentesActivos = usuarios.filter((item) => {
    const rolUsuario = obtenerRol(item.id_rol)

    return (
      rolUsuario?.nombre === 'Gerente' &&
      item.estado === 'Activo'
    )
  })

  return (
    gerentesActivos.length === 1 &&
    gerentesActivos[0].id === usuario.id
  )
}

// Inhabilita o reactiva una cuenta.
// No elimina registros.
export async function toggleEstadoUsuario(id) {
  await delay(600)

  const existente = usuarios.find((item) => item.id === id)

  if (!existente) {
    throw new Error('El usuario que intentas modificar no existe.')
  }

  if (
    existente.estado === 'Activo' &&
    esUnicoGerente(existente)
  ) {
    throw new Error(
      'No puedes inhabilitar al único Gerente activo del sistema.'
    )
  }

  // No permite reactivar una cuenta cuyo rol está inactivo.
  if (existente.estado === 'Inactivo') {
    const rol = obtenerRol(existente.id_rol)

    if (!rol || rol.estado !== 'Activo') {
      throw new Error(
        'No puedes reactivar esta cuenta porque su rol está inactivo.'
      )
    }
  }

  usuarios = usuarios.map((item) =>
    item.id === id
      ? {
          ...item,
          estado: item.estado === 'Activo' ? 'Inactivo' : 'Activo',
        }
      : item
  )

  const actualizado = usuarios.find((item) => item.id === id)

  const { clientes, empleados } = await obtenerDatosRelacionados()

  return mapearUsuario(actualizado, clientes, empleados)
}

// CU.09.06 — Cambio de contraseña simulado.
// No implementa hashing real ni autenticación.
export async function cambiarPassword(id, datos = {}) {
  await delay(600)

  const existente = usuarios.find((item) => item.id === id)

  if (!existente) {
    throw new Error('El usuario no existe.')
  }

  const { actual, nueva } = datos

  if (!actual || !nueva) {
    throw new Error(
      'Debes completar los campos de contraseña.'
    )
  }

  if (String(nueva).length < 6) {
    throw new Error(
      'La nueva contraseña debe tener al menos 6 caracteres.'
    )
  }

  // En esta simulación no se guarda una contraseña en texto plano.
  // La verificación de la contraseña actual requiere backend.
  existente.passwordhash = 'SIMULADO_ACTUALIZADO'

  return { ok: true }
}