import { useState, useCallback } from 'react'

const VALORES_INICIALES = {
  nombre: '',
  categoria: '',
  tipo: 'TERMINADO',
  esVendible: true,
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

const esEnteroNoNegativo = (v) =>
  v !== '' && v !== null && v !== undefined && Number.isInteger(Number(v)) && Number(v) >= 0
const esEnteroPositivo = (v) => esEnteroNoNegativo(v) && Number(v) > 0

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
    // Si el formulario aún no trae tipo (modal sin actualizar), se asume Terminado
    const tipo = valores.tipo ?? 'TERMINADO'
    // Un Terminado siempre es vendible; en un Intermedio depende del toggle
    const esVendible = tipo === 'TERMINADO' ? true : Boolean(valores.esVendible)

    if (!valores.nombre?.trim()) {
      errores.nombre = 'El nombre es obligatorio'
    } else if (valores.nombre.length > 100) {
      errores.nombre = 'El nombre es demasiado largo (máx. 100)'
    }

    if (!valores.categoria?.trim()) {
      errores.categoria = 'Selecciona una categoría'
    }

    if (!['TERMINADO', 'INTERMEDIO'].includes(tipo)) {
      errores.tipo = 'Selecciona el tipo de producto'
    }

    // Precio e imagen solo son obligatorios si el producto es vendible
    if (esVendible) {
      const precioNum = Number(valores.precioVenta)
      if (valores.precioVenta === '' || valores.precioVenta == null || isNaN(precioNum) || precioNum <= 0) {
        errores.precioVenta = 'Ingresa un precio de venta mayor a 0'
      }
    }

    if (!esEnteroNoNegativo(valores.stockActual)) {
      errores.stockActual = 'El stock debe ser un número entero (0 o más)'
    }

    if (valores.stockMinimo !== '' && valores.stockMinimo != null && !esEnteroNoNegativo(valores.stockMinimo)) {
      errores.stockMinimo = 'El stock mínimo debe ser un entero (0 o más)'
    }

    if (!esEnteroPositivo(valores.cantMinimaProduccion)) {
      errores.cantMinimaProduccion = 'Ingresa un entero mayor a 0'
    }
    if (!esEnteroPositivo(valores.cantMaximaProduccion)) {
      errores.cantMaximaProduccion = 'Ingresa un entero mayor a 0'
    }
    if (
      !errores.cantMinimaProduccion &&
      !errores.cantMaximaProduccion &&
      Number(valores.cantMinimaProduccion) > Number(valores.cantMaximaProduccion)
    ) {
      errores.cantMinimaProduccion = 'La cantidad mínima no puede superar la máxima'
    }

    const imagen = valores.imagen?.trim() ?? ''
    if (esVendible && imagen === '') {
      errores.imagen = 'Ingresa la URL de la imagen del producto'
    } else if (imagen !== '' && !esUrlValida(imagen)) {
      errores.imagen = 'Ingrese una URL válida'
    }

    return errores
  }, [valores])

  const esValido = useCallback(() => {
    return Object.keys(validar()).length === 0
  }, [validar])

  const primerCampoInvalido = useCallback(() => {
    const errores = validar()
    const orden = [
      'nombre', 'categoria', 'tipo', 'precioVenta', 'stockActual', 'stockMinimo',
      'cantMinimaProduccion', 'cantMaximaProduccion', 'imagen',
    ]
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
