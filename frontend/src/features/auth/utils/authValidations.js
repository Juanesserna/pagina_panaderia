// Tipos de documento admitidos en el registro.
export const DOC_TYPES = [
  ['CC', 'Cédula de ciudadanía (C.C.)'],
  ['TI', 'Tarjeta de identidad (T.I.)'],
  ['CE', 'Cédula de extranjería (C.E.)'],
  ['NIT', 'NIT'],
  ['PAS', 'Pasaporte'],
  ['PPT', 'Permiso por Protección Temporal (PPT)'],
]

export const NUMERIC_DOCS = ['CC', 'TI', 'CE', 'PPT']

export const EMAIL_MAX_LENGTH = 120
export const PASSWORD_MAX_LENGTH = 72

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_RE = /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u

const REQUIRED = {
  documentType: 'Selecciona un tipo de documento.',
  documentNumber: 'Ingresa tu número de documento.',
  name: 'Ingresa tu nombre completo.',
  phone: 'Ingresa tu número de celular.',
  email: 'Ingresa tu correo electrónico.',
  password: 'Ingresa tu contraseña.',
  confirmPassword: 'Confirma tu contraseña.',
  code: 'Ingresa el código de verificación.',
}

// Requisitos compartidos entre registro y recuperación.
export const PASSWORD_RULES = [
  {
    id: 'length',
    label: 'Mínimo 15 caracteres',
    test: (value) => value.length >= 15,
  },
  {
    id: 'uppercase',
    label: 'Una letra mayúscula',
    test: (value) => /\p{Lu}/u.test(value),
  },
  {
    id: 'lowercase',
    label: 'Una letra minúscula',
    test: (value) => /\p{Ll}/u.test(value),
  },
  {
    id: 'number',
    label: 'Un número',
    test: (value) => /\d/.test(value),
  },
  {
    id: 'symbol',
    label: 'Un carácter especial',
    test: (value) => /[\p{P}\p{S}]/u.test(value),
  },
  {
    id: 'maximum',
    label: 'Máximo 72 bytes',
    test: (value) =>
      new TextEncoder().encode(value).length <= PASSWORD_MAX_LENGTH,
  },
]

export function normalizarNombre(value) {
  return value.trim().replace(/\s+/g, ' ').normalize('NFC')
}

export function normalizarCorreo(value) {
  return value.trim().toLowerCase()
}

function validarDocumento(value, tipo) {
  if (!tipo) return 'Selecciona primero el tipo de documento.'

  if (NUMERIC_DOCS.includes(tipo)) {
    return /^\d{5,15}$/.test(value)
      ? ''
      : 'El documento debe tener entre 5 y 15 números.'
  }

  if (tipo === 'NIT') {
    return /^\d{5,15}(?:-\d)?$/.test(value)
      ? ''
      : 'Ingresa un NIT válido.'
  }

  if (tipo === 'PAS') {
    return /^[A-Za-z0-9]{5,20}$/.test(value)
      ? ''
      : 'El pasaporte debe tener entre 5 y 20 letras o números.'
  }

  return 'Selecciona un tipo de documento válido.'
}

// Valida según el campo y el flujo de autenticación.
export function validarCampo(name, form, mode = 'login') {
  const raw = String(form[name] ?? '')
  const isPassword = ['password', 'confirmPassword'].includes(name)
  const value = isPassword ? raw : raw.trim()

  if (name === 'acceptTerms') {
    return form.acceptTerms
      ? ''
      : 'Debes aceptar los términos y condiciones.'
  }

  if (name === 'acceptPrivacy') {
    return form.acceptPrivacy
      ? ''
      : 'Debes autorizar el tratamiento de tus datos personales.'
  }

  if (!value) return REQUIRED[name] ?? 'Este campo es obligatorio.'

  switch (name) {
    case 'documentType':
      return DOC_TYPES.some(([id]) => id === value)
        ? ''
        : 'Selecciona un tipo de documento válido.'

    case 'documentNumber':
      return validarDocumento(value, form.documentType)

    case 'name': {
      const nombre = normalizarNombre(value)

      return nombre.length >= 3 &&
        nombre.length <= 80 &&
        NAME_RE.test(nombre)
        ? ''
        : 'Ingresa un nombre válido de 3 a 80 caracteres.'
    }

    case 'phone':
      return /^3\d{9}$/.test(value)
        ? ''
        : 'Ingresa un celular válido de 10 números.'

    case 'email':
      return value.length <= EMAIL_MAX_LENGTH && EMAIL_RE.test(value)
        ? ''
        : 'Ingresa un correo electrónico válido.'

    case 'password': {
      // El login no exige los requisitos de creación
      // a contraseñas de cuentas existentes.
      if (mode === 'login') {
        return value.length <= 128
          ? ''
          : 'La contraseña supera la longitud permitida.'
      }

      const failed = PASSWORD_RULES.find((rule) => !rule.test(value))

      return failed
        ? `Requisito pendiente: ${failed.label.toLowerCase()}.`
        : ''
    }

    case 'confirmPassword':
      return value === form.password
        ? ''
        : 'Las contraseñas no coinciden.'

    case 'code':
      return /^\d{6}$/.test(value)
        ? ''
        : 'El código debe contener exactamente 6 números.'

    default:
      return ''
  }
}

// Restringe caracteres según el tipo de campo.
export function limpiarCampo(name, value, tipo) {
  switch (name) {
    case 'name':
      return value
        .replace(/[^\p{L}\p{M} '\u2019-]/gu, '')
        .slice(0, 80)

    case 'phone':
      return value.replace(/\D/g, '').slice(0, 10)

    case 'code':
      return value.replace(/\D/g, '').slice(0, 6)

    case 'documentNumber':
      if (NUMERIC_DOCS.includes(tipo)) {
        return value.replace(/\D/g, '').slice(0, 15)
      }

      if (tipo === 'NIT') {
        return value
          .replace(/[^\d-]/g, '')
          .match(/^(\d{0,15})(?:-(\d?))?/)?.[0] ?? ''
      }

      if (tipo === 'PAS') {
        return value
          .replace(/[^a-zA-Z0-9]/g, '')
          .toUpperCase()
          .slice(0, 20)
      }

      return ''

    default:
      return value
  }
}