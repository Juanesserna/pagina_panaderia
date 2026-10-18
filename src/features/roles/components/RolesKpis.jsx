import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

import { Shield, ShieldCheck} from 'lucide-react'
import StatCard from '@shared/components/StatCard'
import { BRAND } from '@shared/utils/colors'


export default function RolesKpis({ kpis }) {

  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>

      <StatCard
        label="Total roles"
        value={kpis.total}
        icon={
           <Shield
            size={20}
            color={BRAND.orangeDark}
          />
        }
        iconBg={isDark ? 'rgba(217, 119, 60, 0.18)' : BRAND.orangeSoftBg}
      />

      <StatCard
        label="Roles activos"
        value={kpis.activos}
        icon={
          <ShieldCheck
            size={20}
            color={BRAND.green}
          />
        }
        iconBg={isDark ? 'rgba(139, 195, 74, 0.16)' : BRAND.greenBg}
      />

    </Box>
  )
}