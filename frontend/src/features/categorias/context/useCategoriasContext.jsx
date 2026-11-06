import { useContext } from 'react'
import { CategoriasContext } from './categoriasContextObject'

export function useCategoriasContext() {
  const ctx = useContext(CategoriasContext)
  if (!ctx) {
    throw new Error('useCategoriasContext debe usarse dentro de <CategoriasProvider>')
  }
  return ctx
}
