import { useEffect, useState, useCallback } from 'react'
import { getUsuarioActual, updateUsuario } from '../services/usuariosService'

// Mismo patrón que useUsuarios.js: trae los datos con un servicio async
// y expone { usuario, loading } a la pantalla.
export default function usePerfil() {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getUsuarioActual().then((data) => {
      if (active) {
        setUsuario(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  // Mismo patrón que editarUsuario() en useUsuarios.js: reutiliza el
  // updateUsuario() que ya existe en el servicio (el mismo que usa el
  // formulario de edición de Usuarios). No se crea ninguna función nueva
  // en el servicio. Solo se usa para email y teléfono, los únicos campos
  // editables del perfil.
  const editarPerfil = useCallback(
    async (data) => {
      const actualizado = await updateUsuario(usuario.id, data)
      setUsuario(actualizado)
    },
    [usuario]
  )

  return { usuario, loading, editarPerfil }
}