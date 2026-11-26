import { useRef, useState } from 'react'
import {
  validarCampo,
  limpiarCampo,
  normalizarNombre,
  normalizarCorreo,
} from '../utils/authValidations'

// Valores iniciales compartidos por los formularios de acceso.
export const EMPTY_FORM = {
  documentType: '',
  documentNumber: '',
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  code: '',
  acceptTerms: false,
  acceptPrivacy: false,
}

export const LOGIN_FIELDS = ['email', 'password']

export const REGISTER_FIELDS = [
  'documentType',
  'documentNumber',
  'name',
  'phone',
  'email',
  'password',
  'confirmPassword',
  'acceptTerms',
  'acceptPrivacy',
]

export default function useAuthForm({
  fields = LOGIN_FIELDS,
  mode = 'login',
} = {}) {
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [touched, setTouched] = useState({})
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Bloqueo inmediato para prevenir envíos simultáneos.
  const submittingRef = useRef(false)

  const errors = Object.fromEntries(
    fields.map((name) => [
      name,
      validarCampo(name, form, mode),
    ])
  )

  const isValid = fields.every((name) => !errors[name])

  const isDirty = Object.keys(EMPTY_FORM).some(
    (name) => form[name] !== EMPTY_FORM[name]
  )

  const updateField = (name, value) => {
    if (submittingRef.current) return

    if (name === 'documentType') {
      setForm((prev) => ({
        ...prev,
        documentType: value,
        documentNumber: '',
      }))

      setTouched((prev) => ({
        ...prev,
        documentNumber: false,
      }))

      return
    }

    setForm((prev) => ({
      ...prev,
      [name]: typeof value === 'boolean'
        ? value
        : limpiarCampo(name, value, prev.documentType),
    }))
  }

  const touch = (name) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }

  // Impide avanzar con TAB o Shift + TAB
  // cuando el campo contiene información inválida.
  const handleFieldKeyDown = (event, name) => {
    if (event.key !== 'Tab' || submittingRef.current) return

    touch(name)

    if (validarCampo(name, form, mode)) {
      event.preventDefault()
    }
  }

  const touchAll = () => {
    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(
        fields.map((name) => [name, true])
      ),
    }))
  }

  const resetValidation = () => {
    setTouched({})
    setNotice('')
  }

  const resetForm = (values = {}) => {
    if (submittingRef.current) return

    setForm({
      ...EMPTY_FORM,
      ...values,
    })

    resetValidation()
  }

  // Limpia los datos antes de cambiar de flujo.
  // Las contraseñas nunca se conservan entre formularios.
  const clearSensitiveFields = () => {
    setForm((prev) => ({
      ...prev,
      password: '',
      confirmPassword: '',
      code: '',
    }))

    resetValidation()
  }

  const getPayload = () => {
    const payload = Object.fromEntries(
      fields.map((name) => [name, form[name]])
    )

    if ('name' in payload) {
      payload.name = normalizarNombre(payload.name)
    }

    if ('email' in payload) {
      payload.email = normalizarCorreo(payload.email)
    }

    return payload
  }

  const handleSubmit = async (event, action) => {
    event.preventDefault()

    if (submittingRef.current) return false

    touchAll()
    setNotice('')

    if (!isValid) {
      setNotice(
        'Completa los campos obligatorios y corrige los datos inválidos.'
      )

      return false
    }

    try {
      submittingRef.current = true
      setSubmitting(true)

      await action(getPayload())

      return true
    } catch {
      setNotice(
        'No se pudo completar la operación. Inténtalo nuevamente.'
      )

      return false
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  return {
    form,
    errors,
    touched,
    notice,
    submitting,
    isValid,
    isDirty,
    setNotice,
    updateField,
    touch,
    handleFieldKeyDown,
    handleSubmit,
    resetForm,
    resetValidation,
    clearSensitiveFields,
  }
}