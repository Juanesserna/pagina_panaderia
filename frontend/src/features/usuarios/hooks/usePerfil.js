import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getUsuarioActual,
  updatePerfil,
} from '../services/usuariosService'

export default function usePerfil() {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const enviando = useRef(false)

  // Consulta la información de la cuenta actual.
  useEffect(() => {
    let activo = true

    async function cargarPerfil() {
      try {
        const data = await getUsuarioActual()

        if (!data) {
          throw new Error('No se encontró información del perfil.')
        }

        if (activo) {
          setUsuario(data)
          setError(null)
        }
      } catch (error) {
        if (activo) {
          setError(error.message || 'No se pudo cargar el perfil.')
        }
      } finally {
        if (activo) {
          setLoading(false)
        }
      }
    }

    cargarPerfil()

    return () => {
      activo = false
    }
  }, [])

  // Actualiza exclusivamente los datos de contacto.
  const editarPerfil = useCallback(async (data) => {
    if (!usuario?.id) {
      throw new Error('No hay una cuenta disponible.')
    }

    if (enviando.current) {
      throw new Error('Ya existe una actualización en proceso.')
    }

    enviando.current = true
    setSubmitting(true)

    try {
      const actualizado = await updatePerfil(data)

      setUsuario(actualizado)

      return actualizado
    } finally {
      enviando.current = false
      setSubmitting(false)
    }
  }, [usuario?.id])

  return {
    usuario,
    loading,
    error,
    submitting,
    editarPerfil,
  }
}