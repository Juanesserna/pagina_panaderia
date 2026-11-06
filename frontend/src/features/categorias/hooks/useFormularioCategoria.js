import { useState, useCallback } from 'react'

const VALORES_INICIALES = { nombre: '', tipo: 'Producto', estado: 'Activa', urlImagen: '' }

const validarUrlImagen = (url) => {
  if (!url || url.trim() === '') return false
  try {
    const parsed = new URL(url.trim())
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false
    if (!parsed.hostname.includes('.')) return false
    return true
  } catch {
    return false
  }
}

// Estado del formulario de categoría (compartido por Nueva y Editar).
// Si recibe una categoría, arranca con sus valores.
export function useFormularioCategoria(categoria) {
  const [valores, setValores] = useState(() => ({
    nombre: categoria?.nombre ?? VALORES_INICIALES.nombre,
    tipo: categoria?.tipo ?? VALORES_INICIALES.tipo,
    estado: categoria?.estado ?? VALORES_INICIALES.estado,
    urlImagen: categoria?.urlImagen ?? VALORES_INICIALES.urlImagen,
  }))
  const [urlTocada, setUrlTocada] = useState(false)

  const cambiar = useCallback((campo, valor) => {
    setValores((prev) => ({ ...prev, [campo]: valor }))
  }, [])

  const tocarUrl = useCallback(() => {
    setUrlTocada(true)
  }, [])

  const reiniciar = useCallback(() => {
    setValores({ ...VALORES_INICIALES })
    setUrlTocada(false)
  }, [])

  const validar = useCallback(() => {
    const errorNombre = !valores.nombre?.trim()
    const urlInvalida = !validarUrlImagen(valores.urlImagen)
    const errorUrl = urlTocada && urlInvalida
    return {
      errorNombre,
      errorUrl,
      esValido: !errorNombre && !urlInvalida,
    }
  }, [valores, urlTocada])

  return { valores, cambiar, reiniciar, validar, tocarUrl }
}
