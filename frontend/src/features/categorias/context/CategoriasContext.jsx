import { useMemo, useState } from 'react'
import { CategoriasContext } from './categoriasContextObject'
import { categorias as categoriasIniciales } from '../services/categorias.service'
import { COLOR_CATEGORIA_NUEVA } from '../constants/coloresCategoria'

let categoriaIdCounter = 0

const crearId = () => {
  const cryptoApi = globalThis.crypto
  if (typeof cryptoApi?.randomUUID === 'function') {
    return cryptoApi.randomUUID()
  }
  categoriaIdCounter += 1
  return `categoria-${Date.now()}-${categoriaIdCounter}`
}

const siguienteCodigo = (categoriasExistentes) => {
  const maxNumero = categoriasExistentes.reduce((maximo, categoria) => {
    const match = String(categoria.codigo || '').match(/CAT-(\d+)/)
    return match ? Math.max(maximo, parseInt(match[1], 10)) : maximo
  }, 0)
  return `CAT-${String(maxNumero + 1).padStart(3, '0')}`
}

export function CategoriasProvider({ children }) {
  const [categorias, setCategorias] = useState(() =>
    categoriasIniciales.map((categoria) => ({ ...categoria }))
  )

  const crear = useMemo(
    () => (nuevaCategoria) => {
      setCategorias((prev) => {
        const codigo = siguienteCodigo(prev)
        const categoria = {
          id: crearId(),
          color: COLOR_CATEGORIA_NUEVA,
          productosCount: 0,
          insumosCount: 0,
          codigo,
          ...nuevaCategoria,
          creada: new Date().toLocaleDateString('es-CO'),
        }
        return [categoria, ...prev]
      })
    },
    []
  )

  const editar = useMemo(
    () => (id, cambios) => {
      setCategorias((prev) =>
        prev.map((categoria) =>
          categoria.id === id ? { ...categoria, ...cambios } : categoria
        )
      )
    },
    []
  )

  const eliminar = useMemo(
    () => (id) => {
      setCategorias((prev) => prev.filter((categoria) => categoria.id !== id))
    },
    []
  )

  const value = useMemo(
    () => ({ categorias, crear, editar, eliminar }),
    [categorias, crear, editar, eliminar]
  )

  return (
    <CategoriasContext.Provider value={value}>{children}</CategoriasContext.Provider>
  )
}
