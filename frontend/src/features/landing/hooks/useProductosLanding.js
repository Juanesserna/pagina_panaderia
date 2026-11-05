import { useState, useEffect } from 'react'
import { productosApi } from '@features/productos/api/productosApi'

// Límite 50 (máximo permitido por el backend en paginación).
const LIMITE_ALTO = 50

// Hook de lectura de productos para el Landing (consulta la API al montarse).
// Devuelve solo productos con estado ACTIVO.
export function useProductosLanding() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false

    async function cargar() {
      setCargando(true)
      setError(null)
      try {
        const respuesta = await productosApi.obtenerProductos({
          estado: 'ACTIVO',
          pagina: 1,
          limite: LIMITE_ALTO,
        })
        if (cancelado) return
        const lista = respuesta.datos || respuesta || []
        setProductos(lista)
      } catch (err) {
        if (cancelado) return
        setError(err.message || 'Error al cargar los productos')
        setProductos([])
      } finally {
        if (!cancelado) setCargando(false)
      }
    }

    cargar()

    return () => {
      cancelado = true
    }
  }, [])

  return { productos, cargando, error }
}
