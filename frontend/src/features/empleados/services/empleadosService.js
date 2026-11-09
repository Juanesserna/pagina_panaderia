
 // Servicio 100% simulado: todavía no hay backend conectado.
 // La información laboral pertenece a Empleados.
 // Las credenciales y los roles pertenecen a Usuarios.
 // El horario se registra mediante hora de entrada y salida.

export const TIPOS_DOCUMENTO = [
  'Cédula de ciudadanía',
  'Tarjeta de identidad',
  'Cédula de extranjería',
  'Pasaporte',
]

const empleadosIniciales = [
  {
    id: 1,
    nombre: 'Ana Martínez',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '1023456789',
    telefono: '3001234567',
    horaEntrada: '06:00',
    horaSalida: '14:00',
    id_usuario: 1,
  },
  {
    id: 2,
    nombre: 'María Fernanda López',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '1034567890',
    telefono: '3102345678',
    horaEntrada: '14:00',
    horaSalida: '22:00',
    id_usuario: null,
  },
  {
    id: 3,
    nombre: 'Andrés Felipe Ramírez',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '1045678901',
    telefono: '3203456789',
    horaEntrada: '08:00',
    horaSalida: '17:00',
    id_usuario: null,
  },
  {
    id: 4,
    nombre: 'Laura Camila Torres',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '1056789012',
    telefono: '3014567890',
    horaEntrada: '06:00',
    horaSalida: '14:00',
    id_usuario: null,
  },
  {
    id: 5,
    nombre: 'Juan Sebastián Pérez',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '1067890123',
    telefono: '3155678901',
    horaEntrada: '14:00',
    horaSalida: '22:00',
    id_usuario: null,
  },
  {
    id: 6,
    nombre: 'Daniela Marcela Ruiz',
    tipoDocumento: 'Cédula de ciudadanía',
    documento: '1078901234',
    telefono: '3006789012',
    horaEntrada: '08:00',
    horaSalida: '17:00',
    id_usuario: null,
  },
]

let empleados = [...empleadosIniciales]
let siguienteId = Math.max(...empleados.map(({ id }) => id)) + 1

const esperar = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Convierte una hora de 24 horas a un formato legible.
export function formatearHora(hora) {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(hora ?? ''))) {
    return 'No registrada'
  }

  const [horas, minutos] = hora.split(':').map(Number)
  const periodo = horas >= 12 ? 'p. m.' : 'a. m.'
  const hora12 = horas % 12 || 12

  return `${hora12}:${String(minutos).padStart(2, '0')} ${periodo}`
}

// Útil para mostrar el horario en tablas y detalles.
export function formatearHorario(empleado) {
  if (!empleado?.horaEntrada || !empleado?.horaSalida) {
    return 'No registrado'
  }

  return `${formatearHora(empleado.horaEntrada)} - ${formatearHora(empleado.horaSalida)}`
}

function validarDatos(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Los datos del empleado no son válidos.')
  }

  const nombre = String(data.nombre ?? '')
    .trim()
    .replace(/\s+/g, ' ')

  const tipoDocumento = String(data.tipoDocumento ?? '').trim()
  const documento = String(data.documento ?? '').trim()
  const telefono = String(data.telefono ?? '').trim()
  const horaEntrada = String(data.horaEntrada ?? '').trim()
  const horaSalida = String(data.horaSalida ?? '').trim()

  if (
    !nombre ||
    !tipoDocumento ||
    !documento ||
    !telefono ||
    !horaEntrada ||
    !horaSalida
  ) {
    throw new Error('Completa todos los campos obligatorios.')
  }

  if (nombre.length < 3 || nombre.length > 80) {
    throw new Error('El nombre debe tener entre 3 y 80 caracteres.')
  }

  if (!/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(nombre)) {
    throw new Error('El nombre contiene caracteres no permitidos.')
  }

  if (!TIPOS_DOCUMENTO.includes(tipoDocumento)) {
    throw new Error('Selecciona un tipo de documento válido.')
  }

  const esPasaporte = tipoDocumento === 'Pasaporte'

  if (esPasaporte) {
    if (!/^[A-Z0-9]{5,15}$/i.test(documento)) {
      throw new Error(
        'El pasaporte debe tener entre 5 y 15 caracteres alfanuméricos.'
      )
    }
  } else if (!/^\d{5,15}$/.test(documento)) {
    throw new Error('El documento debe tener entre 5 y 15 números.')
  }

  if (!/^3\d{9}$/.test(telefono)) {
    throw new Error('Ingresa un celular colombiano válido de 10 dígitos.')
  }

  const formatoHora = /^(?:[01]\d|2[0-3]):[0-5]\d$/

  if (!formatoHora.test(horaEntrada)) {
    throw new Error('Selecciona una hora de entrada válida.')
  }

  if (!formatoHora.test(horaSalida)) {
    throw new Error('Selecciona una hora de salida válida.')
  }

  if (horaEntrada === horaSalida) {
    throw new Error(
      'La hora de entrada y la hora de salida deben ser diferentes.'
    )
  }

  return {
    nombre,
    tipoDocumento,
    documento: esPasaporte ? documento.toUpperCase() : documento,
    telefono,
    horaEntrada,
    horaSalida,
  }
}

function existeDocumento(tipoDocumento, documento, excluirId = null) {
  return empleados.some(
    (empleado) =>
      empleado.id !== excluirId &&
      empleado.tipoDocumento === tipoDocumento &&
      empleado.documento.toUpperCase() === documento.toUpperCase()
  )
}

export async function fetchEmpleados() {
  await esperar()

  return empleados.map((empleado) => ({ ...empleado }))
}

export async function buscarEmpleadoPorDocumento(documento, tipoDocumento) {
  await esperar(300)

  const numero = String(documento ?? '').trim()

  const empleado = empleados.find(
    (item) =>
      item.documento.toUpperCase() === numero.toUpperCase() &&
      (!tipoDocumento || item.tipoDocumento === tipoDocumento)
  )

  return empleado ? { ...empleado } : null
}

export async function createEmpleado(data) {
  await esperar(500)

  const datos = validarDatos(data)

  if (existeDocumento(datos.tipoDocumento, datos.documento)) {
    throw new Error(
      'Ya existe un empleado con ese tipo y número de documento.'
    )
  }

  const nuevo = {
    id: siguienteId++,
    ...datos,
    id_usuario: null,
  }

  empleados = [...empleados, nuevo]

  return { ...nuevo }
}

export async function updateEmpleado(id, data) {
  await esperar(500)

  const empleadoExistente = empleados.find((item) => item.id === id)

  if (!empleadoExistente) {
    throw new Error(
      'No se encontró el empleado que deseas actualizar.'
    )
  }

  const datos = validarDatos(data)

  if (existeDocumento(datos.tipoDocumento, datos.documento, id)) {
    throw new Error(
      'Ya existe otro empleado con ese tipo y número de documento.'
    )
  }

  empleados = empleados.map((item) =>
    item.id === id ? { ...item, ...datos } : item
  )

  return { ...empleados.find((item) => item.id === id) }
}
