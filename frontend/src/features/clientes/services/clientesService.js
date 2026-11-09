// Servicio 100% simulado: todavía no hay backend conectado.
// Un cliente puede existir sin tener una cuenta de acceso.

export const TIPOS_DOCUMENTO = [
  'Cédula de ciudadanía',
  'Tarjeta de identidad',
  'Cédula de extranjería',
  'Pasaporte',
  'NIT',
]

// Datos ficticios para probar búsqueda, filtros y paginación.
let clientes = [
  {
    id: 1,
    nombre: 'Sebastian Martínez',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '1234567890',
    registrado: null,
    id_usuario: null,
  },
  {
    id: 2,
    nombre: 'Carlos Gómez',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '3344556677',
    registrado: null,
    id_usuario: null,
  },
  {
    id: 3,
    nombre: 'María Fuentes',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '2233445566',
    registrado: null,
    id_usuario: null,
  },
  {
    id: 4,
    nombre: 'Andrés Rodríguez',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '4567891230',
    registrado: null,
    id_usuario: null,
  },
  {
    id: 5,
    nombre: 'Laura Gómez',
    tipoDocumento: 'Tarjeta de identidad',
    documento: '1023456789',
    registrado: null,
    id_usuario: null,
  },
  {
    id: 6,
    nombre: 'Santiago Pérez',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '9876543210',
    registrado: null,
    id_usuario: null,
  },
  {
    id: 7,
    nombre: 'Valentina Torres',
    tipoDocumento: 'Cédula de extranjería',
    documento: '876543210',
    registrado: null,
    id_usuario: null,
  },
  {
    id: 8,
    nombre: 'Daniel Herrera',
    tipoDocumento: 'Pasaporte',
    documento: 'AB123456',
    registrado: null,
    id_usuario: null,
  },
  {
    id: 9,
    nombre: 'Camila Ramírez',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '7654321098',
    registrado: null,
    id_usuario: null,
  },
  {
    id: 10,
    nombre: 'Sebastián Castro',
    tipoDocumento: 'NIT',
    documento: '900123456',
    registrado: null,
    id_usuario: null,
  },
  {
    id: 11,
    nombre: 'Isabella Morales',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '6543210987',
    registrado: null,
    id_usuario: null,
  },
  {
    id: 12,
    nombre: 'Mateo Vargas',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '5432109876',
    registrado: null,
    id_usuario: null,
  },
]

let nextId = Math.max(...clientes.map((cliente) => cliente.id)) + 1

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms))

function validarDatos(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Los datos del cliente no son válidos.')
  }

  const nombre = String(data.nombre ?? '').trim().replace(/\s+/g, ' ')
  const tipoDocumento = data.tipoDocumento
  const documento = String(data.documento ?? '').trim()

  if (!nombre) {
    throw new Error('El nombre del cliente es obligatorio.')
  }

  if (nombre.length < 3 || nombre.length > 80) {
    throw new Error('El nombre debe tener entre 3 y 80 caracteres.')
  }

  if (!/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(nombre)) {
    throw new Error('El nombre solo puede contener letras, espacios, apóstrofes y guiones.')
  }

  if (!TIPOS_DOCUMENTO.includes(tipoDocumento)) {
    throw new Error('Selecciona un tipo de documento válido.')
  }

  if (!documento) {
    throw new Error('El número de documento es obligatorio.')
  }

  const esPasaporte = tipoDocumento === 'Pasaporte'

  if (esPasaporte) {
    if (!/^[A-Z0-9]{5,15}$/i.test(documento)) {
      throw new Error('El pasaporte debe tener entre 5 y 15 caracteres alfanuméricos.')
    }
  } else if (!/^\d{5,15}$/.test(documento)) {
    throw new Error('El documento debe tener entre 5 y 15 números.')
  }

  return {
    nombre,
    tipoDocumento,
    documento: esPasaporte ? documento.toUpperCase() : documento,
  }
}

function existeDocumento(tipoDocumento, documento, excluirId = null) {
  return clientes.some(
    (cliente) =>
      cliente.id !== excluirId &&
      cliente.tipoDocumento === tipoDocumento &&
      cliente.documento.toUpperCase() === documento.toUpperCase()
  )
}

export async function fetchClientes() {
  await delay(400)
  return clientes.map((cliente) => ({ ...cliente }))
}

export async function buscarClientePorDocumento(documento, tipoDocumento) {
  await delay(300)

  const numero = String(documento ?? '').trim()

  const cliente = clientes.find(
    (c) =>
      c.documento.toUpperCase() === numero.toUpperCase() &&
      (!tipoDocumento || c.tipoDocumento === tipoDocumento)
  )

  return cliente ? { ...cliente } : null
}

export async function createCliente(data) {
  await delay(600)

  const datos = validarDatos(data)

  if (existeDocumento(datos.tipoDocumento, datos.documento)) {
    throw new Error('Ya existe un cliente con ese tipo y número de documento.')
  }

  const nuevo = {
    id: nextId++,
    ...datos,
    registrado: null,
    id_usuario: null,
  }

  clientes = [nuevo, ...clientes]

  return { ...nuevo }
}

export async function updateCliente(id, data) {
  await delay(600)

  const clienteExistente = clientes.find((c) => c.id === id)

  if (!clienteExistente) {
    throw new Error('No se encontró el cliente que deseas actualizar.')
  }

  const datos = validarDatos(data)

  if (existeDocumento(datos.tipoDocumento, datos.documento, id)) {
    throw new Error('Ya existe otro cliente con ese tipo y número de documento.')
  }

  clientes = clientes.map((cliente) =>
    cliente.id === id
      ? {
          ...cliente,
          ...datos,
        }
      : cliente
  )

  const actualizado = clientes.find((c) => c.id === id)

  return { ...actualizado }
}
