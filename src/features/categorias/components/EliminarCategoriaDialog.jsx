import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Typography,
  Button,
  useTheme,
} from '@mui/material'
import { IconX } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

export default function EliminarCategoriaDialog({
  open,
  onClose,
  onConfirm,
  nombreCategoria,
}) {
  const theme = useTheme()

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
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: fonts.sans,
            fontSize: 18,
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          Eliminar categoría
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

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontSize: 14,
            color: theme.palette.text.primary,
            lineHeight: 1.5,
          }}
        >
          ¿Seguro que deseas eliminar "{nombreCategoria}"? Esta acción no se puede deshacer.
        </Typography>
        <Divider sx={{ my: 2 }} />
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          backgroundColor: 'background.paper',
          justifyContent: 'flex-end',
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
          color="error"
          onClick={onConfirm}
          sx={{
            textTransform: 'none',
            fontSize: 13,
            fontWeight: 500,
            px: 2.5,
            py: 1,
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  )
}