import { StatusBadge } from '@shared/ui'

export default function StatusChip({ estado }) {
  const activo = estado === 'Activo'

  return (
    <StatusBadge
      variant={activo ? 'success' : 'accent'}
      dot
    >
      {estado}
    </StatusBadge>
  )
}
