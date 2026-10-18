import { IconSearch } from '@tabler/icons-react'
import { Input } from './Input'
import { SEARCH_WIDTH } from './tokens'

/**
 * Buscador estándar de las tablas (mismo alto, ancho, ícono y colores en todos los módulos).
 * Úsalo en vez de armar un Input propio con medidas.
 */
export function SearchInput({ value, onChange, placeholder = 'Buscar…' }) {
  return (
    <Input
      size="sm"
      fullWidth={false}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      leftIcon={<IconSearch size={18} />}
      sx={{ width: SEARCH_WIDTH }}
    />
  )
}
