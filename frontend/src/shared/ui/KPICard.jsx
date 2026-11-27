import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

// Variante → clave de la paleta del tema.
const paletteKey = {
  success: 'success',
  danger: 'error',
  warning: 'warning',
  accent: 'primary',
  info: 'info',
}

/**
 * Tarjeta KPI compartida del proyecto Al Horno.
 *
 * Modo normal:
 * - Conserva el diseño original.
 * - Título e icono arriba.
 * - Valor debajo del título.
 * - Permite un subtítulo opcional.
 *
 * Modo compacto (compact):
 * - Título y valor en la misma fila.
 * - Separación entre título y número.
 * - Icono alineado a la derecha.
 * - Menor altura y espaciado.
 *
 * variant:
 * 'accent' | 'success' | 'warning' | 'danger' | 'info'
 */
export function KPICard({
  title,
  value,
  subtitle,
  icon,
  variant = 'accent',
  compact = false,
}) {
  const key = paletteKey[variant] ?? paletteKey.accent

  const icono = icon && (
    <Box
      sx={{
        width: compact ? 30 : 32,
        height: compact ? 30 : 32,
        flexShrink: 0,
        borderRadius: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: (theme) =>
          alpha(theme.palette[key].main, 0.12),
        color: `${key}.main`,
      }}
    >
      {icon}
    </Box>
  )

  if (compact) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          px: 2,
          py: 1.5,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            minHeight: 36,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              minWidth: 0,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                lineHeight: 1.3,
                fontSize: '0.68rem',
                fontWeight: 600,
                whiteSpace: 'normal',
              }}
            >
              {title}
            </Typography>

            <Typography
              component="span"
              sx={{
                fontSize: '1.35rem',
                fontWeight: 700,
                lineHeight: 1,
                color: 'text.primary',
                flexShrink: 0,
              }}
            >
              {value}
            </Typography>
          </Box>

          {icono}
        </Box>

        {subtitle && (
          <Typography
            variant="caption"
            component="div"
            sx={{
              mt: 0.75,
              color: 'text.secondary',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    )
  }

  // Diseño original: se mantiene para los demás módulos.
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2.2,
        paddingTop: 0.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 50,
        }}
      >
        <Typography variant="overline">
          {title}
        </Typography>

        {icono}
      </Box>

      <Box>
        <Typography
          variant="metric"
          component="div"
          sx={{ color: 'text.primary' }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            component="div"
            sx={{ mt: 0.75 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
