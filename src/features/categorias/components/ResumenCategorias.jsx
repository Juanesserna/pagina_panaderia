import { Stack } from '@mui/material'
import { IconStack, IconTag, IconCheck, IconX } from '@tabler/icons-react'
import StatsCard from '@shared/components/StatsCard'

export default function ResumenCategorias({ categorias }) {
  const total = categorias.length
  const deProducto = categorias.filter((c) => c.tipo === 'Producto' || c.tipo === 'Ambos').length
  const activas = categorias.filter((c) => c.estado === 'Activa').length
  const inactivas = categorias.filter((c) => c.estado === 'Inactiva').length

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
      <StatsCard
        label="TOTAL CATEGORÍAS"
        value={total}
        icon={<IconStack size={20} />}
        iconBgColor="warning"
      />
      <StatsCard
        label="CATEGORÍAS DE PRODUCTO"
        value={deProducto}
        icon={<IconTag size={20} />}
        iconBgColor="warning"
      />
      <StatsCard
        label="ACTIVAS"
        value={activas}
        icon={<IconCheck size={20} />}
        iconBgColor="success"
      />
      <StatsCard
        label="INACTIVAS"
        value={inactivas}
        icon={<IconX size={20} />}
        iconBgColor="error"
      />
    </Stack>
  )
}