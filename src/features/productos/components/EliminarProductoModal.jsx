import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconAlertTriangle, IconTrash, IconX } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

export default function EliminarProductoModal({
  open,
  onClose,
  onConfirm,
  nombreProducto,
}) {
  const theme = useTheme()
  const errorColor = theme.palette.error.main

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          padding: 0,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography
          component="span"
          variant="h6"
          sx={{
            fontFamily: fonts.sans,
            fontSize: 18,
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          Eliminar producto
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': { bgcolor: theme.palette.action.hover },
          }}
          aria-label="Cerrar"
        >
          <IconX size={20} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            px: 3,
            pt: 3,
            pb: 3,
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: alpha(errorColor, 0.12),
            }}
          >
            <IconTrash size={26} color={errorColor} />
          </Box>

          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 18,
              fontWeight: 700,
              lineHeight: 1.3,
              color: theme.palette.text.primary,
            }}
          >
            ¿Eliminar producto?
          </Typography>

          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 14,
              lineHeight: 1.5,
              color: theme.palette.text.secondary,
            }}
          >
            Estás a punto de eliminar{' '}
            <Typography
              component="span"
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {nombreProducto}
            </Typography>
            . Esta acción no se puede deshacer.
          </Typography>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              backgroundColor: alpha(errorColor, 0.08),
              border: 1,
              borderColor: alpha(errorColor, 0.25),
              color: errorColor,
            }}
          >
            <IconAlertTriangle size={18} color={errorColor} />
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: 13,
                lineHeight: 1.5,
                color: errorColor,
              }}
            >
              Este producto será eliminado permanentemente del sistema.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          pt: 2,
          pb: 2.5,
          backgroundColor: 'background.paper',
          justifyContent: 'flex-start',
          gap: 1.5,
        }}
      >
        <Button
          type="button"
          variant="text"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            fontSize: 13,
            fontWeight: 500,
            px: 2.5,
            py: 1,
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: theme.palette.action.hover,
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={onConfirm}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: '#FFFFFF',
            textTransform: 'none',
            fontSize: 13,
            fontWeight: 500,
            px: 2.5,
            py: 1,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              color: '#FFFFFF',
            },
            '&.Mui-focusVisible': {
              color: '#FFFFFF',
            },
          }}
        >
          Sí, eliminar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
