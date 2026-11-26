
// Validación en tiempo real del formulario de proveedores.
// validarProveedor devuelve { campo: 'mensaje' } solo con los campos que tienen error.
// Para cambiar qué caracteres o longitudes se aceptan, se edita SOLO este archivo.
import { esEmailValido } from './proveedoresHelpers'

const NOMBRE_INVALIDO = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,&'()\-]/ // S.A.S., Ltda., Cía.
const NIT_INVALIDO = /[^0-9.\-]/ // 900.123.456-7
const CONTACTO_INVALIDO = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'\-]/ // solo nombre de persona
const TELEFONO_INVALIDO = /[^0-9\s+()\-]/ // +57 310 234 5678
const DIRECCION_INVALIDA = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,#°ºª()\-\/]/ // Calle 10 # 43A-55

const NIT_MIN_DIGITOS = 5
const TELEFONO_MIN_DIGITOS = 7

function describirCaracter(c) {
  return /\s/.test(c) ? 'espacio' : c
}

// Devuelve el mensaje de error de un campo de texto, o '' si está bien.
function validarTexto(valor, { vacio, invalido, ayuda = '' }) {
  const texto = String(valor)
  if (!texto.trim()) return vacio
  const mal = texto.match(invalido)
  if (mal) return `Carácter no permitido: ${describirCaracter(mal[0])}${ayuda ? `. ${ayuda}` : ''}`
  return ''
}

const contarDigitos = (valor) => String(valor).replace(/\D/g, '').length

export function validarProveedor(form) {
  const errores = {}
  const poner = (campo, mensaje) => {
    if (mensaje) errores[campo] = mensaje
  }

  poner('nombre', validarTexto(form.nombre, { vacio: 'El nombre de la empresa es obligatorio', invalido: NOMBRE_INVALIDO }))

  let nit = validarTexto(form.nit, {
    vacio: 'El NIT es obligatorio',
    invalido: NIT_INVALIDO,
    ayuda: 'Solo números, puntos y guion',
  })
  if (!nit && contarDigitos(form.nit) < NIT_MIN_DIGITOS) nit = 'El NIT está incompleto'
  poner('nit', nit)

  poner('nombreContacto', validarTexto(form.nombreContacto, { vacio: 'El nombre del contacto es obligatorio', invalido: CONTACTO_INVALIDO }))

  let telefono = validarTexto(form.telefono, {
    vacio: 'El teléfono es obligatorio',
    invalido: TELEFONO_INVALIDO,
    ayuda: 'Solo números, espacios, + - ( )',
  })
  if (!telefono && contarDigitos(form.telefono) < TELEFONO_MIN_DIGITOS) telefono = 'El teléfono está incompleto'
  poner('telefono', telefono)

  const email = String(form.email)
  if (!email.trim()) errores.email = 'El correo electrónico es obligatorio'
  else if (/\s/.test(email.trim())) errores.email = 'Carácter no permitido: espacio'
  else if (!esEmailValido(email)) errores.email = 'Escribe un correo con formato nombre@empresa.com'

  poner('direccion', validarTexto(form.direccion, { vacio: 'La dirección es obligatoria', invalido: DIRECCION_INVALIDA }))

  return errores
}
