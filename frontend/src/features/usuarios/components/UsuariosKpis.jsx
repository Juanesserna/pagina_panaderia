
import { Box } from '@mui/material'
import { UserCheck, UserX, Users } from 'lucide-react'
import { KPIGrid, KPICard } from '@shared/ui'

export default function UsuariosKpis({ kpis }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <KPIGrid compact>
        <KPICard
          title="Usuarios activos"
          value={kpis.activos}
          icon={<UserCheck size={18} />}
          variant="success"
          compact
        />

        <KPICard
          title="Inactivos"
          value={kpis.inactivos}
          icon={<UserX size={18} />}
          variant="danger"
          compact
        />

        <KPICard
          title="Total usuarios"
          value={kpis.total}
          icon={<Users size={18} />}
          variant="accent"
          compact
        />
      </KPIGrid>
    </Box>
  )
}
