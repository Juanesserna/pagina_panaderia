// Servicio simulado: todavía no hay backend conectado.
// Los usuarios almacenan credenciales, estado y rol.
// Los datos personales pertenecen a Clientes y Empleados.

import {
  fetchRoles,
  getPrivilegiosPorId,
  GERENTE_ID,
  MODULOS as MODULOS_ROLES,
} from '../../roles/services/rolesService'

import {
  fetchClientes,
  vincularUsuarioCliente,
} from '../../clientes/services/clientesService'

import {
  fetchEmpleados,
  vincularUsuarioEmpleado,
  updateEmpleado,
} from '../../empleados/services/empleadosService'

export const ROLES = ['Gerente', 'Panadero', 'Cliente', 'Vendedor']
export const ESTADOS = ['Activo', 'Inactivo']
export const MODULOS = MODULOS_ROLES

const CLIENTE_ROL_ID = 3

// Datos ficticios basados en tb_usuarios.
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
    email: 'andres@alhorno.mx',
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
    email: 'valentina@alhorno.mx',
    passwordhash: 'SIMULADO',
    estado: 'Activo',
    id_rol: 3,
  },
  {
    id: 7,
    email: 'daniel@alhorno.mx',
    passwordhash: 'SIMULADO',
    estado: 'Inactivo',
    id_rol: 3,
  },
  {
    id: 8,
    email: 'isabella@alhorno.mx',
    passwordhash: 'SIMULADO',
    estado: 'Inactivo',
    id_rol: 3,
  },
]

let nextId = Math.max(...usuarios.map((usuario) => usuario.id)) + 1

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Caché de roles para consultar nombres y estados.
let rolesCache = [
  { id: 1, nombre: 'Gerente', estado: 'Activo' },
  { id: 2, nombre: 'Panadero', estado: 'Activo' },
  { id: 3, nombre: 'Cliente', estado: 'Activo' },
  { id: 4, nombre: 'Vendedor', estado: 'Activo' },
]

// Consulta las asignaciones actuales de un rol.
export function getAsignacionesRol(idRol) {
  const asignados = usuarios.filter(
    (usuario) => Number(usuario.id_rol) === Number(idRol)
  )

  const activos = asignados.filter(
    (usuario) => usuario.estado === 'Activo'
  ).length

  return {
    total: asignados.length,
    activos,
    inactivos: asignados.length - activos,
  }
}

// Los clientes reciben únicamente el rol Cliente.
// Los empleados reciben roles internos y personalizados.
export function esRolCompatible(idRol, tipoPerfil) {
  const id = Number(idRol)

  if (!Number.isSafeInteger(id) || id <= 0) return false

  if (tipoPerfil === 'Cliente') return id === CLIENTE_ROL_ID
  if (tipoPerfil === 'Empleado') return id !== CLIENTE_ROL_ID

  return false
}

async function cargarRoles() {
  rolesCache = await fetchRoles()
  return rolesCache
}

function obtenerRol(idRol) {
  return rolesCache.find(
    (rol) => Number(rol.id) === Number(idRol)
  ) ?? null
}

function buscarUsuario(id) {
  return usuarios.find(
    (usuario) => usuario.id === Number(id)
  ) ?? null
}

// Admite el ID o el nombre del rol por compatibilidad.
function resolverIdRol(data, roles) {
  if (data.id_rol != null) {
    const id = Number(data.id_rol)
    return Number.isSafeInteger(id) && id > 0 ? id : null
  }

  if (data.rol) {
    return roles.find(
      (rol) =>
        rol.nombre.toLowerCase() ===
        String(data.rol).trim().toLowerCase()
    )?.id ?? null
  }

  return null
}

function normalizarUsuario(data, roles) {
  return {
    email: String(data.email ?? '').trim().toLowerCase(),
    estado: String(data.estado ?? '').trim(),
    id_rol: resolverIdRol(data, roles),
  }
}

// Valida exclusivamente los datos de la cuenta.
function validarUsuario(data, roles, idExcluir = null) {
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

  const existente = buscarUsuario(idExcluir)
  const conservaRolActual = existente?.id_rol === usuario.id_rol

  // Un rol inactivo solo puede conservarse en una cuenta inactiva.
  if (rol.estado !== 'Activo') {
    if (!conservaRolActual) {
      throw new Error(
        'No puedes asignar un rol que se encuentra inactivo.'
      )
    }

    if (usuario.estado === 'Activo') {
      throw new Error(
        'No puedes activar esta cuenta mientras su rol esté inactivo.'
      )
    }
  }

  const duplicadoEmail = usuarios.some(
    (item) =>
      item.id !== Number(idExcluir) &&
      item.email.toLowerCase() === usuario.email
  )

  if (duplicadoEmail) {
    throw new Error('Ya existe una cuenta registrada con ese correo.')
  }

  return usuario
}

// Consulta los perfiles relacionados.
async function obtenerDatosRelacionados() {
  const [clientes, empleados] = await Promise.all([
    fetchClientes(),
    fetchEmpleados(),
  ])

  return { clientes, empleados }
}

// Consulta los perfiles que todavía no tienen cuenta.
export async function fetchPerfilesDisponibles() {
  const { clientes, empleados } = await obtenerDatosRelacionados()

  return {
    clientes: clientes.filter(
      (cliente) => cliente.id_usuario == null
    ),

    empleados: empleados.filter(
      (empleado) => empleado.id_usuario == null
    ),
  }
}

// Obtiene los perfiles asociados mediante id_usuario.
function obtenerPerfiles(idUsuario, clientes, empleados) {
  return {
    cliente: clientes.find(
      (item) => item.id_usuario === idUsuario
    ) ?? null,

    empleado: empleados.find(
      (item) => item.id_usuario === idUsuario
    ) ?? null,
  }
}

// Valida el perfil seleccionado durante la creación.
function validarPerfil(data, clientes, empleados) {
  const tieneCliente =
    data.id_cliente != null && data.id_cliente !== ''

  const tieneEmpleado =
    data.id_empleado != null && data.id_empleado !== ''

  if (tieneCliente === tieneEmpleado) {
    throw new Error(
      'Selecciona un cliente o empleado para vincular la cuenta.'
    )
  }

  const tipoPerfil = tieneCliente ? 'Cliente' : 'Empleado'

  const perfil = tieneCliente
    ? clientes.find((item) => item.id === Number(data.id_cliente))
    : empleados.find((item) => item.id === Number(data.id_empleado))

  if (!perfil) {
    throw new Error('El perfil seleccionado no existe.')
  }

  if (perfil.id_usuario != null) {
    throw new Error('El perfil seleccionado ya tiene una cuenta de acceso.')
  }

  return { perfil, tipoPerfil }
}

function validarCompatibilidadRol(idRol, tipoPerfil) {
  if (!esRolCompatible(idRol, tipoPerfil)) {
    throw new Error('El rol seleccionado no es compatible con el perfil.')
  }
}

// Construye el usuario para mostrarlo en la interfaz.
function mapearUsuario(usuario, clientes, empleados) {
  const { cliente, empleado } = obtenerPerfiles(
    usuario.id,
    clientes,
    empleados
  )

  const rol = obtenerRol(usuario.id_rol)
  const perfil = cliente ?? empleado

  // No se exponen credenciales a los componentes.
  const { passwordhash, ...datosCuenta } = usuario

  return {
    ...datosCuenta,

    rol: rol?.nombre ?? 'Sin rol',
    estadoRol: rol?.estado ?? null,

    cliente,
    empleado,

    id_cliente: cliente?.id ?? null,
    id_empleado: empleado?.id ?? null,

    tipoPerfil: cliente
      ? 'Cliente'
      : empleado
        ? 'Empleado'
        : null,

    nombre: perfil?.nombre ?? null,
    documento: perfil?.documento ?? null,
    tipoDocumento: perfil?.tipoDocumento ?? null,
    telefono: empleado?.telefono ?? null,
  }
}

// Obtiene los privilegios efectivos mediante el ID del rol.
export function getModulosVisibles(usuario) {
  if (!usuario || usuario.estado !== 'Activo') return []
  if (!usuario.id_rol) return []

  const privilegios = getPrivilegiosPorId(usuario.id_rol)

  return MODULOS.filter(
    (modulo) => privilegios[modulo]?.length > 0
  ).map((modulo) => ({
    nombre: modulo,
    acciones: [...privilegios[modulo]],
    esExtra: false,
  }))
}

// Consulta todas las cuentas con sus datos relacionados.
export async function fetchUsuarios() {
  await delay(400)
  await cargarRoles()

  const { clientes, empleados } = await obtenerDatosRelacionados()

  return usuarios.map((usuario) =>
    mapearUsuario(usuario, clientes, empleados)
  )
}

// Consulta la cuenta autenticada de forma simulada.
export async function getUsuarioActual() {
  await delay(300)
  await cargarRoles()

  const usuario = buscarUsuario(1)

  if (!usuario) return null

  const { clientes, empleados } = await obtenerDatosRelacionados()

  return mapearUsuario(usuario, clientes, empleados)
}

// Crea una cuenta vinculada con un perfil existente.
// El administrador no establece la contraseña del usuario.
export async function createUsuario(data) {
  await delay(600)

  const { clientes, empleados } = await obtenerDatosRelacionados()
  const roles = await cargarRoles()
  const validado = validarUsuario(data, roles)

  const { perfil, tipoPerfil } = validarPerfil(
    data,
    clientes,
    empleados
  )

  validarCompatibilidadRol(validado.id_rol, tipoPerfil)

  const nuevo = {
    id: nextId,
    ...validado,
    passwordhash: 'SIMULADO',
  }

  // Vincula primero el perfil para evitar cuentas sin asociación.
  // En el backend estas operaciones requerirán una transacción.
  if (tipoPerfil === 'Cliente') {
    vincularUsuarioCliente(perfil.id, nuevo.id)
  } else {
    vincularUsuarioEmpleado(perfil.id, nuevo.id)
  }

  usuarios = [...usuarios, nuevo]
  nextId++

  const relacionados = await obtenerDatosRelacionados()

  return mapearUsuario(
    nuevo,
    relacionados.clientes,
    relacionados.empleados
  )
}

// Actualiza correo, estado y rol sin modificar el perfil asociado.
export async function updateUsuario(id, data) {
  await delay(600)

  const { clientes, empleados } = await obtenerDatosRelacionados()
  const roles = await cargarRoles()
  const existente = buscarUsuario(id)

  if (!existente) {
    throw new Error('El usuario que intentas actualizar no existe.')
  }

  const validado = validarUsuario(data, roles, existente.id)

  const { cliente, empleado } = obtenerPerfiles(
    existente.id,
    clientes,
    empleados
  )

  if (Boolean(cliente) === Boolean(empleado)) {
    throw new Error('La cuenta no tiene un perfil asociado válido.')
  }

  validarCompatibilidadRol(
    validado.id_rol,
    cliente ? 'Cliente' : 'Empleado'
  )

  // Protege al último Gerente activo del sistema.
  if (
    esUnicoGerente(existente) &&
    (
      validado.id_rol !== existente.id_rol ||
      validado.estado !== 'Activo'
    )
  ) {
    throw new Error(
      'No puedes cambiar el rol ni desactivar al único Gerente activo del sistema.'
    )
  }

  const actualizado = {
    ...existente,
    ...validado,
  }

  usuarios = usuarios.map((item) =>
    item.id === existente.id ? actualizado : item
  )

  return mapearUsuario(actualizado, clientes, empleados)
}

// Actualiza únicamente los datos de contacto de Mi Perfil.
export async function updatePerfil(data) {
  await delay(300)

  const roles = await cargarRoles()
  const { clientes, empleados } = await obtenerDatosRelacionados()

  // Cuenta actual simulada. Se reemplazará por la sesión real.
  const existente = buscarUsuario(1)

  if (!existente || existente.estado !== 'Activo') {
    throw new Error('La cuenta actual no está disponible.')
  }

  const { cliente, empleado } = obtenerPerfiles(
    existente.id,
    clientes,
    empleados
  )

  if (Boolean(cliente) === Boolean(empleado)) {
    throw new Error('La cuenta no tiene un perfil asociado válido.')
  }

  // Valida el correo conservando el rol y estado actuales.
  const { email } = validarUsuario(
    {
      email: data?.email,
      estado: existente.estado,
      id_rol: existente.id_rol,
    },
    roles,
    existente.id
  )

  let perfilesActualizados = empleados

  // El teléfono pertenece al empleado, no a la cuenta.
  if (empleado) {
    const telefono = String(data?.telefono ?? '').trim()

    if (!/^3\d{9}$/.test(telefono)) {
      throw new Error('Ingresa un celular colombiano válido.')
    }

    if (telefono !== empleado.telefono) {
      const actualizado = await updateEmpleado(
        empleado.id,
        {
          ...empleado,
          telefono,
        }
      )

      perfilesActualizados = empleados.map((item) =>
        item.id === actualizado.id ? actualizado : item
      )
    }
  }

  // En el backend ambos cambios deberán ser transaccionales.
  usuarios = usuarios.map((item) =>
    item.id === existente.id
      ? { ...item, email }
      : item
  )

  return mapearUsuario(
    buscarUsuario(existente.id),
    clientes,
    perfilesActualizados
  )
}

// Determina si la cuenta es el último Gerente activo.
export function esUnicoGerente(usuario) {
  if (
    !usuario ||
    usuario.estado !== 'Activo' ||
    Number(usuario.id_rol) !== GERENTE_ID
  ) {
    return false
  }

  const gerentesActivos = usuarios.filter(
    (item) =>
      Number(item.id_rol) === GERENTE_ID &&
      item.estado === 'Activo'
  )

  return (
    gerentesActivos.length === 1 &&
    gerentesActivos[0].id === usuario.id
  )
}

// Desactiva o reactiva una cuenta sin eliminar sus registros.
export async function toggleEstadoUsuario(id) {
  await delay(600)
  await cargarRoles()

  const existente = buscarUsuario(id)

  if (!existente) {
    throw new Error('El usuario que intentas modificar no existe.')
  }

  if (esUnicoGerente(existente)) {
    throw new Error(
      'No puedes desactivar al único Gerente activo del sistema.'
    )
  }

  if (existente.estado === 'Inactivo') {
    const rol = obtenerRol(existente.id_rol)

    if (!rol || rol.estado !== 'Activo') {
      throw new Error(
        'No puedes reactivar esta cuenta porque su rol está inactivo o no está disponible.'
      )
    }
  }

  const actualizado = {
    ...existente,
    estado: existente.estado === 'Activo' ? 'Inactivo' : 'Activo',
  }

  usuarios = usuarios.map((item) =>
    item.id === existente.id ? actualizado : item
  )

  const { clientes, empleados } = await obtenerDatosRelacionados()

  return mapearUsuario(actualizado, clientes, empleados)
}


// CU.09.06 — Cambio de contraseña simulado.
// La verificación real de credenciales requiere backend.
export async function cambiarPassword(id, datos = {}) {
  await delay(600)

  const existente = buscarUsuario(id)

  if (!existente || existente.id !== 1 || existente.estado !== 'Activo') {
    throw new Error('La cuenta actual no está disponible.')
  }

  const { actual, nueva } = datos

  if (
    typeof actual !== 'string' ||
    typeof nueva !== 'string' ||
    !actual.trim() ||
    !nueva.trim()
  ) {
    throw new Error('Debes completar los campos de contraseña.')
  }

  if (actual === nueva) {
    throw new Error('La nueva contraseña debe ser diferente a la actual.')
  }

  const cumpleRequisitos =
    [...nueva].length >= 15 &&
    new TextEncoder().encode(nueva).length <= 72 &&
    /\p{Lu}/u.test(nueva) &&
    /\p{Ll}/u.test(nueva) &&
    /\d/.test(nueva) &&
    /[\p{P}\p{S}]/u.test(nueva)

  if (!cumpleRequisitos) {
    throw new Error('La contraseña no cumple los requisitos de seguridad.')
  }

  // No se almacenan contraseñas reales durante la simulación.
  existente.passwordhash = 'SIMULADO_ACTUALIZADO'

  return { ok: true }
}