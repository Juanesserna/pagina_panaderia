import { Box } from '@mui/material'
import { Shield, ShieldCheck } from 'lucide-react'
import { KPIGrid, KPICard } from '@shared/ui'

export default function RolesKpis({ kpis }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <KPIGrid compact>
        <KPICard
          title="Total roles"
          value={kpis.total}
          icon={<Shield size={18} />}
          variant="accent"
          compact
        />

        <KPICard
          title="Roles activos"
          value={kpis.activos}
          icon={<ShieldCheck size={18} />}
          variant="success"
          compact
        />
      </KPIGrid>
    </Box>
  )
}
