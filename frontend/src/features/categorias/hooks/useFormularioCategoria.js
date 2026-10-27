import { useState, useCallback } from 'react'

const VALORES_INICIALES = { nombre: '', tipo: 'Producto', estado: 'Activa' }

// Estado del formulario de categoría (compartido por Nueva y Editar).
// Si recibe una categoría, arranca con sus valores.
export function useFormularioCategoria(categoria) {
  const [valores, setValores] = useState(() => ({
    nombre: categoria?.nombre ?? VALORES_INICIALES.nombre,
    tipo: categoria?.tipo ?? VALORES_INICIALES.tipo,
    estado: categoria?.estado ?? VALORES_INICIALES.estado,
  }))

  const cambiar = useCallback((campo, valor) => {
    setValores((prev) => ({ ...prev, [campo]: valor }))
  }, [])

  const reiniciar = useCallback(() => {
    setValores({ ...VALORES_INICIALES })
  }, [])

  return { valores, cambiar, reiniciar }
}