import { StatusBadge } from '@shared/ui'
import { varianteEstadoCategoria } from './comunes/opcionesCategoria'

export default function EstadoBadge({ estado }) {
  return (
    <StatusBadge variant={varianteEstadoCategoria(estado)} dot size="md">
      {estado}
    </StatusBadge>
  )
}