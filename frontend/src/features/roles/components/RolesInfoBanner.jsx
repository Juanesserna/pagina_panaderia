import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ShieldCheck } from 'lucide-react'
import { alpha } from '@mui/material/styles'

export default function RolesInfoBanner() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: theme =>
          alpha(theme.palette.primary.main, 0.035),
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 1.5,
          color: 'primary.main',
          bgcolor: theme =>
            alpha(theme.palette.primary.main, 0.1),
        }}
      >
        <ShieldCheck size={17} />
      </Box>

      <Typography
        component="div"
        sx={{
          fontSize: 12,
          lineHeight: 1.5,
          color: 'text.secondary',
        }}
      >
        <Box
          component="span"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Roles protegidos:
        </Box>
        {' '}
        Los roles predeterminados no se pueden eliminar
        ni desactivar. Los roles personalizados están
        sujetos a sus usuarios asignados.
      </Typography>
    </Box>
  )
}
