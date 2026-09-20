import { Chip, useTheme } from '@mui/material'
import { IconCircleFilled } from '@tabler/icons-react'
import { alpha } from '@mui/material/styles'
import { fonts } from '@app/theme/colors'

export default function EstadoBadge({ estado }) {
  const theme = useTheme()
  const isActivo = estado === 'Activa'
  const dotColor = isActivo ? theme.palette.success.main : theme.palette.text.secondary
  const bgColor = isActivo ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.text.secondary, 0.12)

  return (
    <Chip
      icon={<IconCircleFilled size={8} color={dotColor} />}
      label={estado}
      sx={{
        fontFamily: fonts.sans,
        fontSize: 12,
        fontWeight: 500,
        color: dotColor,
        bgcolor: bgColor,
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