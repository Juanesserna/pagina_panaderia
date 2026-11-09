import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material'

export default function ConfirmarSalidaDialog({
  open,
  onLeave,
  onStay,
}) {
  return (
    <Dialog
      open={open}
      onClose={() => {}}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle>¿Deseas salir de la edición?</DialogTitle>

      <DialogContent>
        <Typography color="text.secondary">
          Si sales ahora, los cambios realizados no se guardarán.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onStay}
          color="primary"
          variant="contained"
        >
          Seguir editando
        </Button>

        <Button
          onClick={onLeave}
          color="error"
          variant="outlined"
        >
          Salir
        </Button>
      </DialogActions>
    </Dialog>
  )
}
