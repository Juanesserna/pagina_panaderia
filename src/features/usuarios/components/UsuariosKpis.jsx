import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { UserCheck ,UserX, Users  } from 'lucide-react';
import StatCard from '@shared/components/StatCard'
import { BRAND } from '@shared/utils/colors'

// Nota: el Figma original mostraba un "+12.5% vs. mes anterior" debajo del
// primer KPI. Se quitó a pedido explícito (ese dato no aplica todavía).

export default function UsuariosKpis({ kpis }) {

  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>

      <StatCard
        label="Usuarios activos"
        value={kpis.activos}
        icon={
           <UserCheck
            size={20}
            color={BRAND.textMuted}
          />
        }
        iconBg={isDark ? 'rgba(139, 195, 74, 0.16)' : BRAND.greenBg}
      />

      <StatCard
        label="Inactivos"
        value={kpis.inactivos}
        icon={
          <UserX
            size={20}
            color={BRAND.textMuted}
          />
        }
        iconBg={isDark ? 'rgba(255, 255, 255, 0.10)' : BRAND.inputBg}
      />

      <StatCard
        label="Total usuarios"
        value={kpis.total}
        icon={
           <Users
            size={20}
            color={BRAND.textMuted}
          />
        }
        iconBg={isDark ? 'rgba(217, 119, 60, 0.18)' : BRAND.cardBorder}
      />

    </Box>
  )
}