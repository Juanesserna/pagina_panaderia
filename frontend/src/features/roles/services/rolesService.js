// Servicio simulado. Las restricciones deberán replicarse en el backend.
export const ESTADOS = ['Activo', 'Inactivo']

export const ROLES_SISTEMA_IDS = [1, 2, 3, 4]

export const MODULOS = [
  'Dashboard', 'Ventas', 'Pedidos', 'Producción', 'Insumos',
  'Compras', 'Proveedores', 'Categorías', 'Productos', 'Usuarios', 'Roles',
]

export const PRIVILEGIOS_POR_MODULO = {
  Dashboard: [
    { id: 'filtrar_fecha', nombre: 'Filtrar por fecha' },
    { id: 'exportar_reportes', nombre: 'Exportar reportes' },
  ],
  Ventas: [
    { id: 'buscar', nombre: 'Buscar' },
    { id: 'crear', nombre: 'Crear venta' },
    { id: 'filtrar', nombre: 'Filtrar' },
    { id: 'registrar_captura_pago', nombre: 'Registrar captura de pago' },
    { id: 'ver_comprobante', nombre: 'Ver comprobante' },
  ],
  Pedidos: [
    { id: 'buscar', nombre: 'Buscar' },
    { id: 'crear', nombre: 'Crear pedido' },
    { id: 'filtrar', nombre: 'Filtrar' },
    { id: 'registrar_abonos', nombre: 'Registrar abonos' },
    { id: 'ver_comprobante', nombre: 'Ver comprobante' },
  ],
  Producción: [
    { id: 'buscar', nombre: 'Buscar' },
    { id: 'crear', nombre: 'Crear' },
    { id: 'editar', nombre: 'Editar' },
    { id: 'eliminar', nombre: 'Eliminar' },
    { id: 'filtrar', nombre: 'Filtrar' },
    { id: 'ver_detalle', nombre: 'Ver detalle' },
    { id: 'cambiar_estado', nombre: 'Cambiar estado' },
  ],
  Insumos: [
    { id: 'buscar', nombre: 'Buscar' },
    { id: 'crear', nombre: 'Crear' },
    { id: 'editar', nombre: 'Editar' },
    { id: 'eliminar', nombre: 'Eliminar' },
    { id: 'ver_detalle', nombre: 'Ver detalle' },
    { id: 'filtrar', nombre: 'Filtrar' },
    { id: 'cambiar_estado', nombre: 'Cambiar estado' },
  ],
  Compras: [
    { id: 'buscar', nombre: 'Buscar' },
    { id: 'crear', nombre: 'Crear' },
    { id: 'editar', nombre: 'Editar' },
    { id: 'eliminar', nombre: 'Eliminar' },
    { id: 'ver_detalle', nombre: 'Ver detalle' },
    { id: 'filtrar', nombre: 'Filtrar' },
    { id: 'cambiar_estado', nombre: 'Cambiar estado' },
  ],
  Proveedores: [
    { id: 'buscar', nombre: 'Buscar' },
    { id: 'crear', nombre: 'Crear' },
    { id: 'editar', nombre: 'Editar' },
    { id: 'eliminar', nombre: 'Eliminar' },
    { id: 'ver_detalle', nombre: 'Ver detalle' },
    { id: 'filtrar', nombre: 'Filtrar' },
    { id: 'cambiar_estado', nombre: 'Cambiar estado' },
  ],
  Categorías: [
    { id: 'buscar', nombre: 'Buscar' },
    { id: 'crear', nombre: 'Crear' },
    { id: 'editar', nombre: 'Editar' },
    { id: 'eliminar', nombre: 'Eliminar' },
    { id: 'ver_detalle', nombre: 'Ver detalle' },
    { id: 'filtrar', nombre: 'Filtrar' },
    { id: 'cambiar_estado', nombre: 'Cambiar estado' },
  ],
  Productos: [
    { id: 'buscar', nombre: 'Buscar' },
    { id: 'crear', nombre: 'Crear' },
    { id: 'editar', nombre: 'Editar' },
    { id: 'eliminar', nombre: 'Eliminar' },
    { id: 'ver_detalle', nombre: 'Ver detalle' },
    { id: 'filtrar', nombre: 'Filtrar' },
    { id: 'cambiar_estado', nombre: 'Cambiar estado' },
  ],
  Usuarios: [
    { id: 'buscar', nombre: 'Buscar' },
    { id: 'crear', nombre: 'Crear' },
    { id: 'editar', nombre: 'Editar' },
    { id: 'ver_detalle', nombre: 'Ver detalle' },
    { id: 'filtrar', nombre: 'Filtrar' },
    { id: 'cambiar_estado', nombre: 'Cambiar estado' },
  ],
  Roles: [
    { id: 'buscar', nombre: 'Buscar' },
    { id: 'crear', nombre: 'Crear' },
    { id: 'editar', nombre: 'Editar' },
    { id: 'eliminar', nombre: 'Eliminar' },
    { id: 'ver_detalle', nombre: 'Ver detalle' },
    { id: 'cambiar_estado', nombre: 'Cambiar estado' },
  ],
}

export const GERENTE_ID = 1

// El Gerente conserva todos los privilegios del sistema.
export const PRIVILEGIOS_PROTEGIDOS_GERENTE = Object.fromEntries(
  MODULOS.map(modulo => [
    modulo,
    PRIVILEGIOS_POR_MODULO[modulo].map(({ id }) => id),
  ])
)

const todosLosPrivilegios = modulos => Object.fromEntries(
  modulos.map(modulo => [
    modulo,
    PRIVILEGIOS_POR_MODULO[modulo].map(({ id }) => id),
  ])
)

// Roles predeterminados del sistema.
let roles = [
  { id: 1, nombre: 'Gerente', modulos: [...MODULOS] },
  { id: 2, nombre: 'Panadero', modulos: ['Dashboard', 'Insumos', 'Producción'] },
  { id: 3, nombre: 'Cliente', modulos: ['Dashboard', 'Ventas'] },
  { id: 4, nombre: 'Vendedor', modulos: ['Dashboard', 'Productos', 'Ventas'] },
].map(rol => ({
  ...rol,
  estado: 'Activo',
  privilegios: todosLosPrivilegios(rol.modulos),
}))

let nextId = 5

export const getNextRoleId = () => nextId

const delay = (ms = 400) =>
  new Promise(resolve => setTimeout(resolve, ms))

// Importación diferida: Usuarios ya depende de este servicio.
async function obtenerConsultaAsignaciones() {
  const { getAsignacionesRol } = await import(
    '../../usuarios/services/usuariosService.js'
  )

  return getAsignacionesRol
}

// Devuelve una copia del rol con sus asignaciones actuales.
function copiarRol(rol, consultar) {
  const { total, activos } = consultar(rol.id)

  return {
    ...rol,
    modulos: [...rol.modulos],
    privilegios: Object.fromEntries(
      Object.entries(rol.privilegios).map(([modulo, ids]) => [
        modulo,
        [...ids],
      ])
    ),
    usuariosAsignados: total,
    usuariosActivos: activos,
  }
}

export function esRolSistema(rol) {
  const id = typeof rol === 'object' ? rol?.id : rol

  return ROLES_SISTEMA_IDS.includes(Number(id))
}

export function esEliminable(rol) {
  return Boolean(rol) &&
    !esRolSistema(rol) &&
    rol.usuariosAsignados === 0
}

// Solo se pueden desactivar roles sin usuarios activos,
// excepto el Gerente, que debe permanecer activo.
export function esDesactivable(rol) {
  return Boolean(rol) &&
    Number(rol.id) !== GERENTE_ID &&
    rol.usuariosActivos === 0
}

export function normalizarNombreRol(nombre) {
  const limpio = String(nombre ?? '')
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('es-CO')

  return limpio
    ? limpio.charAt(0).toLocaleUpperCase('es-CO') + limpio.slice(1)
    : ''
}

// Valida el nombre y evita registros duplicados.
export function validarNombreRol(nombre, idExcluir = null) {
  const limpio = normalizarNombreRol(nombre)

  if (
    limpio.length < 3 ||
    limpio.length > 60 ||
    !/^\p{L}[\p{L}\p{M}]*(?: [\p{L}\p{M}]+)*$/u.test(limpio) ||
    (limpio.match(/\p{L}/gu) ?? []).length < 3
  ) {
    return 'El nombre debe tener entre 3 y 60 caracteres y contener al menos 3 letras. Solo se permiten letras y espacios.'
  }

  if (
    roles.some(rol =>
      rol.id !== Number(idExcluir) &&
      normalizarNombreRol(rol.nombre) === limpio
    )
  ) {
    return 'Ya existe un rol con ese nombre.'
  }

  return ''
}

// Centraliza las validaciones de creación y edición.
function validarDatos(data, anterior, consultar) {
  const nombre = normalizarNombreRol(data.nombre ?? anterior?.nombre)
  const estado = data.estado ?? anterior?.estado ?? 'Activo'

  // Los roles predeterminados conservan su nombre original.
  if (
    esRolSistema(anterior) &&
    nombre !== anterior.nombre
  ) {
    throw new Error(
      'No puedes cambiar el nombre de un rol predeterminado.'
    )
  }

  const error = validarNombreRol(nombre, anterior?.id)

  if (error) throw new Error(error)

  if (!ESTADOS.includes(estado)) {
    throw new Error('Selecciona un estado válido.')
  }

  if (
    anterior &&
    estado === 'Inactivo' &&
    consultar(anterior.id).activos > 0
  ) {
    throw new Error(
      'No puedes desactivar un rol con usuarios activos asignados.'
    )
  }

  const entrada = data.privilegios ?? anterior?.privilegios ?? {}

  // Solo se conservan módulos y privilegios reconocidos.
  const privilegios = Object.fromEntries(
    MODULOS.map(modulo => [
      modulo,
      PRIVILEGIOS_POR_MODULO[modulo]
        .map(({ id }) => id)
        .filter(id =>
          Array.isArray(entrada[modulo]) &&
          entrada[modulo].includes(id)
        ),
    ]).filter(([, ids]) => ids.length > 0)
  )

  const modulos = Object.keys(privilegios)

  if (!modulos.length) {
    throw new Error(
      'Selecciona al menos un privilegio en algún módulo.'
    )
  }

  if (
    anterior?.id === GERENTE_ID &&
    Object.entries(PRIVILEGIOS_PROTEGIDOS_GERENTE).some(
      ([modulo, ids]) =>
        ids.some(id => !privilegios[modulo]?.includes(id))
    )
  ) {
    throw new Error(
      'No puedes retirar los privilegios protegidos del Gerente.'
    )
  }

  return { nombre, estado, modulos, privilegios }
}

function buscarRol(id) {
  const rol = roles.find(item => item.id === Number(id))

  if (!rol) throw new Error('El rol no existe.')

  return rol
}

// Consulta todos los roles.
export async function fetchRoles() {
  await delay()

  const consultar = await obtenerConsultaAsignaciones()

  return roles.map(rol => copiarRol(rol, consultar))
}

// Crea un rol personalizado.
export async function createRole(data) {
  await delay(600)

  const consultar = await obtenerConsultaAsignaciones()

  const nuevo = {
    ...validarDatos(data, null, consultar),
    id: nextId++,
  }

  roles = [...roles, nuevo]

  return copiarRol(nuevo, consultar)
}

// Actualiza un rol respetando sus restricciones.
export async function updateRole(id, data) {
  await delay(600)

  const consultar = await obtenerConsultaAsignaciones()
  const anterior = buscarRol(id)

  if (anterior.id === GERENTE_ID) {
    throw new Error('El rol Gerente no se puede modificar.')
  }

  const actualizado = {
    ...anterior,
    ...validarDatos(data, anterior, consultar),
  }

  roles = roles.map(rol =>
    rol.id === anterior.id ? actualizado : rol
  )

  return copiarRol(actualizado, consultar)
}

// Cambia el estado de un rol respetando sus asignaciones.
export async function toggleEstadoRole(id) {
  await delay()

  const consultar = await obtenerConsultaAsignaciones()
  const rol = buscarRol(id)

  if (rol.id === GERENTE_ID) {
    throw new Error(
      'El rol Gerente debe permanecer activo.'
    )
  }

  if (
    rol.estado === 'Activo' &&
    consultar(rol.id).activos > 0
  ) {
    throw new Error(
      'No puedes desactivar un rol con usuarios activos asignados.'
    )
  }

  const actualizado = {
    ...rol,
    estado: rol.estado === 'Activo' ? 'Inactivo' : 'Activo',
  }

  roles = roles.map(item =>
    item.id === rol.id ? actualizado : item
  )

  return copiarRol(actualizado, consultar)
}

// Elimina únicamente roles personalizados sin usuarios asociados.
export async function deleteRole(id) {
  await delay(600)

  const consultar = await obtenerConsultaAsignaciones()
  const rol = buscarRol(id)

  if (esRolSistema(rol)) {
    throw new Error(
      'Los roles predeterminados no se pueden eliminar.'
    )
  }

  if (consultar(rol.id).total > 0) {
    throw new Error(
      'No puedes eliminar un rol con usuarios asignados.'
    )
  }

  roles = roles.filter(item => item.id !== rol.id)

  return true
}

// Consulta los privilegios mediante el identificador del rol.
export function getPrivilegiosPorId(id) {
  const rol = roles.find(
    item => item.id === Number(id) && item.estado === 'Activo'
  )

  return Object.fromEntries(
    Object.entries(rol?.privilegios ?? {}).map(
      ([modulo, ids]) => [modulo, [...ids]]
    )
  )
}

// Se conserva para compatibilidad con el módulo de Usuarios.
export function getPrivilegiosPorNombre(nombreRol) {
  return getPrivilegiosPorId(
    roles.find(rol => rol.nombre === nombreRol)?.id
  )
}
