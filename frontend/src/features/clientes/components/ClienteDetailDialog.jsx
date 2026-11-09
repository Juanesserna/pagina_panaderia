
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
import UserAvatar from '@shared/components/UserAvatar'

function DetailItem({ icon, label, value }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ py: 1.2, minWidth: 0 }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'action.hover',
          color: 'text.secondary',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box flex={1} minWidth={0}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: 'text.secondary',
            mb: 0.3,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ overflowWrap: 'anywhere' }}
        >
          {value || 'No registrado'}
        </Typography>
      </Box>
    </Stack>
  )
}

export default function ClienteDetailDialog({
  open,
  cliente,
  onClose,
}) {
  if (!cliente) return null

  const tieneCuenta = cliente.id_usuario != null

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      fullWidth
      maxWidth="xs"
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle sx={{ px: 2.5, pt: 2, pb: 1 }}>
        <Typography fontWeight={700}>
          Detalles del cliente
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Información personal y de acceso del cliente.
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 2.5, py: 1.5 }}>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ py: 0.5 }}
          >
            <UserAvatar name={cliente.nombre} />

            <Box flex={1} minWidth={0}>
              <Typography fontWeight={700}>
                {cliente.nombre}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Cliente #{cliente.id}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2.5,
              px: 1.5,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ pt: 1.5 }}
            >
              Identificación
            </Typography>

            <DetailItem
              icon={<CreditCardOutlinedIcon fontSize="small" />}
              label="Tipo de documento"
              value={cliente.tipoDocumento}
            />

            <Divider />

            <DetailItem
              icon={<CreditCardOutlinedIcon fontSize="small" />}
              label="Número de documento"
              value={cliente.documento}
            />
          </Box>

          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2.5,
              px: 1.5,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ pt: 1.5 }}
            >
              Acceso al sistema
            </Typography>

            <DetailItem
              icon={<LinkOutlinedIcon fontSize="small" />}
              label="Cuenta de acceso"
              value={tieneCuenta ? 'Cuenta vinculada' : 'Sin cuenta vinculada'}
            />

            {tieneCuenta && (
              <>
                <Divider />
                <DetailItem
                  icon={<LinkOutlinedIcon fontSize="small" />}
                  label="Identificador de usuario"
                  value={cliente.id_usuario}
                />
              </>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button onClick={onClose} variant="contained" size="small">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
