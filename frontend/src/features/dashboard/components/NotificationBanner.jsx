import { Box, Typography, IconButton } from '@mui/material'
import { IconX } from '@tabler/icons-react'

/**
 * Banner de notificación tipo "Reporte generado".
 * Aparece en el dashboard cuando se completa una exportación.
 * onClose: dismiss handler (el banner también se cierra automáticamente
 *          a los `autoDismissMs` milisegundos).
 */
export function NotificationBanner({ onClose, autoDismissMs = 6000 }) {
  return (
    <Box
      sx={{
        position: 'relative',
        mx: 'auto',
        maxWidth: 420,
        mt: 2,
        px: 0.75,
        py: 0.75,
        borderRadius: 2,
        // Marco blanco grueso que simula un "outer border" sobre fondo oscuro
        border: '4px solid #ffffff',
        borderColor: 'background.default',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 4,
          borderRadius: 1.5,
          bgcolor: '#E2EEF0',
          border: '2px solid #ffffff',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          px: 2.5,
          py: 2,
        }}
      >
        {/* Status dot — encima del título, en la esquina superior izquierda */}
        <Box
          sx={{
            position: 'absolute',
            top: -2,
            left: 14,
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#2B5B66',
            zIndex: 2,
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: '#2B5B66',
              lineHeight: 1.2,
            }}
          >
            Reporte generado
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontSize: 11.5,
              color: 'rgba(43, 91, 102, 0.65)',
              lineHeight: 1.4,
            }}
          >
            El reporte de producción está listo para descargar
          </Typography>
        </Box>
      </Box>

      {/* Close */}
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          zIndex: 2,
          width: 22,
          height: 22,
          minWidth: 0,
          color: 'text.dim',
          '&:hover': { color: 'text.primary' },
        }}
        aria-label="Cerrar notificación"
      >
        <IconX size={14} />
      </IconButton>
    </Box>
  )
}
