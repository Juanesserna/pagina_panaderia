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

function normalizarModulos(modulos = []) {
  if (!Array.isArray(modulos)) return []
  return [...new Set(modulos)].filter((modulo) => MODULOS.includes(modulo))
}

function normalizarPrivilegios(privilegios = {}, modulos = []) {
  return Object.fromEntries(
    modulos.map((modulo) => {
      const acciones = privilegios?.[modulo] ?? []
      const permitidas = PRIVILEGIOS_POR_MODULO[modulo] ?? []

      return [
        modulo,
        Array.isArray(acciones)
          ? [...new Set(acciones)].filter((accion) =>
              permitidas.some((item) => item.id === accion)
            )
          : [],
      ]
    })
  )
}

function crearPrivilegiosIniciales(modulos) {
  return Object.fromEntries(
    modulos.map((modulo) => [
      modulo,
      (PRIVILEGIOS_POR_MODULO[modulo] ?? []).map((item) => item.id),
    ])
  )
}

function copiarRol(rol) {
  return {
    ...rol,
    modulos: [...(rol.modulos ?? [])],
    privilegios: Object.fromEntries(
      Object.entries(rol.privilegios ?? {}).map(([modulo, acciones]) => [
        modulo,
        [...acciones],
      ])
    ),
  }
}

let roles = [
  {
    id: 1, nombre: 'Gerente', estado: 'Activo',
    modulos: ['Dashboard', 'Productos', 'Insumos', 'Proveedores', 'Compras', 'Producción', 'Ventas'],
    usuariosAsignados: 2,
  },
  {
    id: 2, nombre: 'Panadero', estado: 'Activo',
    modulos: ['Dashboard', 'Insumos', 'Producción'],
    usuariosAsignados: 3,
  },
  {
    id: 3, nombre: 'Cliente', estado: 'Activo',
    modulos: ['Dashboard', 'Ventas'],
    usuariosAsignados: 0,
  },
  {
    id: 4, nombre: 'Vendedor', estado: 'Activo',
    modulos: ['Dashboard', 'Productos', 'Ventas'],
    usuariosAsignados: 4,
  },
].map((rol) => ({
  ...rol,
  privilegios: crearPrivilegiosIniciales(rol.modulos),
}))

let nextId = roles.length + 1

export function getNextRoleId() {
  return nextId
}

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

function maybeFail(failRate = 0.15) {
  if (Math.random() < failRate) {
    throw new Error('No se pudo completar la acción. Intenta de nuevo.')
  }
}

export function esRolSistema(rol) {
  const id = typeof rol === 'object' ? rol?.id : rol
  return ROLES_SISTEMA_IDS.includes(Number(id))
}

export function esEliminable(rol) {
  return Boolean(rol) && !esRolSistema(rol) && (rol.usuariosAsignados ?? 0) === 0
}

function validarNombre(nombre) {
  return typeof nombre === 'string' &&
    nombre.trim().length >= 3 &&
    /^[\p{L}\s]+$/u.test(nombre.trim())
}

export async function fetchRoles() {
  await delay(400)
  return roles.map(copiarRol)
}

export async function createRole(data) {
  const nombre = data.nombre?.trim() ?? ''
  if (!validarNombre(nombre)) {
    throw new Error('El nombre debe tener mínimo 3 letras y solo puede contener letras y espacios.')
  }

  const modulos = normalizarModulos(data.modulos ?? Object.keys(data.privilegios ?? {}))
  const privilegios = normalizarPrivilegios(data.privilegios ?? {}, modulos)

  if (!modulos.length) {
    throw new Error('Debes agregar al menos un módulo.')
  }

  const sinPrivilegios = modulos.find((modulo) => !privilegios[modulo]?.length)
  if (sinPrivilegios) {
    throw new Error(`Debes seleccionar al menos un privilegio para ${sinPrivilegios}.`)
  }

  await delay(600)

  const nuevo = {
    ...data,
    nombre,
    id: nextId++,
    usuariosAsignados: 0,
    modulos,
    privilegios,
  }

  roles = [...roles, nuevo ]
  return copiarRol(nuevo)
}

export async function updateRole(id, data) {
  const nombre = data.nombre?.trim() ?? ''
  if (!validarNombre(nombre)) {
    throw new Error('El nombre debe tener mínimo 3 letras y solo puede contener letras y espacios.')
  }

  await delay(600)

  roles = roles.map((rol) => {
    if (rol.id !== id) return rol

    const modulos = normalizarModulos(data.modulos ?? rol.modulos)
    const permisosBase = data.privilegios ?? Object.fromEntries(
      modulos.map((modulo) => [modulo, rol.privilegios?.[modulo] ?? []])
    )

    return {
      ...rol,
      ...data,
      nombre,
      modulos,
      privilegios: normalizarPrivilegios(permisosBase, modulos),
    }
  })

  const actualizado = roles.find((rol) => rol.id === id)
  return actualizado ? copiarRol(actualizado) : undefined
}

export async function toggleEstadoRole(id) {
  await delay(400)

  roles = roles.map((rol) =>
    rol.id === id
      ? { ...rol, estado: rol.estado === 'Activo' ? 'Inactivo' : 'Activo' }
      : rol
  )

  const actualizado = roles.find((rol) => rol.id === id)
  return actualizado ? copiarRol(actualizado) : undefined
}

export async function deleteRole(id) {
  const rol = roles.find((item) => item.id === id)

  if (!rol) throw new Error('El rol que intentas eliminar no existe.')
  if (esRolSistema(rol)) throw new Error('Los roles iniciales del sistema no se pueden eliminar.')
  if (!esEliminable(rol)) throw new Error('No se puede eliminar un rol que tiene usuarios asignados.')

  await delay(600)
  maybeFail()

  roles = roles.filter((item) => item.id !== id)
  return true
}

export function getPrivilegiosPorNombre(nombreRol) {
  const rol = roles.find((item) => item.nombre === nombreRol)
  return rol ? copiarRol(rol).privilegios : {}
}
