import { Chip, useTheme } from '@mui/material'
import { IconCircleFilled } from '@tabler/icons-react'
import { alpha } from '@mui/material/styles'
import { fonts } from '@app/theme/colors'

export default function EstadoBadge({ estado }) {
  const theme = useTheme()
  const isActivo = estado === 'Activo'
  const dotColor = isActivo ? theme.palette.success.main : theme.palette.error.main

  return (
    <Chip
      icon={<IconCircleFilled size={8} color={dotColor} />}
      label={estado}
      sx={{
        fontFamily: fonts.sans,
        fontSize: 12,
        fontWeight: 500,
        color: dotColor,
        bgcolor: alpha(dotColor, 0.12),
        border: 'none',
        height: 24,
        borderRadius: 1,
        px: 0.75,
        '& .MuiChip-icon': {
          pl: 0,
          pr: 0.25,
        },
      }}
    />
  )
}
