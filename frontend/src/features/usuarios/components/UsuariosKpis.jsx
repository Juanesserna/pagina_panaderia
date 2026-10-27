import { Box } from '@mui/material'
import { UserCheck, UserX, Users } from 'lucide-react'
import { KPIGrid, KPICard } from '@shared/ui'

export default function UsuariosKpis({ kpis }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <KPIGrid>
        <KPICard
          title="Usuarios activos"
          value={kpis.activos}
          icon={<UserCheck size={20} />}
          variant="success"
        />

        <KPICard
          title="Inactivos"
          value={kpis.inactivos}
          icon={<UserX size={20} />}
          variant="danger"
        />

        <KPICard
          title="Total usuarios"
          value={kpis.total}
          icon={<Users size={20} />}
          variant="accent"
        />
      </KPIGrid>
    </Box>
  )
}
