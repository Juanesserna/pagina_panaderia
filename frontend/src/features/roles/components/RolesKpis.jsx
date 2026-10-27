import { Box } from '@mui/material'
import { Shield, ShieldCheck } from 'lucide-react'
import { KPIGrid, KPICard } from '@shared/ui'

export default function RolesKpis({ kpis }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <KPIGrid>
        <KPICard
          title="Total roles"
          value={kpis.total}
          icon={<Shield size={20} />}
          variant="accent"
        />

        <KPICard
          title="Roles activos"
          value={kpis.activos}
          icon={<ShieldCheck size={20} />}
          variant="success"
        />
      </KPIGrid>
    </Box>
  )
}
