import { useState, useCallback } from 'react'

const VALORES_INICIALES = {
  nombre: '',
  categoria: '',
  precioVenta: '',
  stockActual: '',
  stockMinimo: '',
  cantMinimaProduccion: '1',
  cantMaximaProduccion: '100',
  imagen: '',
  activo: true,
}

const esUrlValida = (url) => {
  if (!url || url.trim() === '') return true
  try {
    const parsed = new URL(url.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function useValidacionProducto(valoresInicialesParam = VALORES_INICIALES) {
  const [valores, setValores] = useState({ ...valoresInicialesParam })
  const [touched, setTouched] = useState({})

  const cambiar = useCallback((campo, valor) => {
    setValores((prev) => ({ ...prev, [campo]: valor }))
  }, [])

  const tocar = useCallback((campo) => {
    setTouched((prev) => ({ ...prev, [campo]: true }))
  }, [])

  const tocarTodos = useCallback(() => {
    setTouched(Object.keys(valores).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
  }, [valores])

  const reiniciar = useCallback(() => {
    setValores({ ...valoresInicialesParam })
    setTouched({})
  }, [valoresInicialesParam])

  const validar = useCallback(() => {
    const errores = {}
    if (!valores.nombre?.trim()) {
      errores.nombre = 'El nombre es obligatorio'
    } else if (valores.nombre.length > 100) {
      errores.nombre = 'El nombre es demasiado largo (máx. 100)'
    }

    if (!valores.categoria?.trim()) {
      errores.categoria = 'Selecciona una categoría'
    }

    const precioNum = Number(valores.precioVenta)
    if (valores.precioVenta === '' || valores.precioVenta === null || valores.precioVenta === undefined) {
      errores.precioVenta = 'Ingresa un precio válido (0 o más)'
    } else if (isNaN(precioNum) || precioNum < 0) {
      errores.precioVenta = 'Ingresa un precio válido (0 o más)'
    }

    const stockNum = Number(valores.stockActual)
    if (valores.stockActual === '' || valores.stockActual === null || valores.stockActual === undefined) {
      errores.stockActual = 'El stock debe ser un número entero (0 o más)'
    } else if (!Number.isInteger(stockNum) || stockNum < 0) {
      errores.stockActual = 'El stock debe ser un número entero (0 o más)'
    }

    if (valores.imagen && valores.imagen.trim() !== '' && !esUrlValida(valores.imagen)) {
      errores.imagen = 'Ingrese una URL válida'
    }

    return errores
  }, [valores])

  const esValido = useCallback(() => {
    return Object.keys(validar()).length === 0
  }, [validar])

  const primerCampoInvalido = useCallback(() => {
    const errores = validar()
    const orden = ['nombre', 'categoria', 'precioVenta', 'stockActual', 'imagen']
    for (const campo of orden) {
      if (errores[campo]) return campo
    }
    return null
  }, [validar])

  return {
    valores,
    setValores,
    cambiar,
    touched,
    tocar,
    tocarTodos,
    reiniciar,
    validar,
    esValido,
    primerCampoInvalido,
  }
}
