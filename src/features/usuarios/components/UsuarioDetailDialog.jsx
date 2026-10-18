import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CloseIcon from '@mui/icons-material/Close'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import UserAvatar from '@shared/components/UserAvatar'
import { BRAND } from '@shared/utils/colors'
import StatusChip from './StatusChip'
import { getModulosVisibles } from '../services/usuariosService'

function DetailRow({ icon, label, value }) {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: 13.5 }}>
          {icon}
          <Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>{label}</Typography>
        </Box>
        <Box>{value}</Box>
      </Box>
      <Divider />
    </>
  )
}

export default function UsuarioDetailDialog({ open, usuario, onClose }) {
  if (!usuario) return null
  const modulos = getModulosVisibles(usuario)
  const tieneExtras = modulos.some((m) => m.esExtra)

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <UserAvatar name={usuario.nombre} size={44} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 17, color: 'text.primary' }}>
              {usuario.nombre}
            </Typography>
            <Typography sx={{ fontSize: 13, color: BRAND.orange, fontWeight: 600 }}>
              {usuario.rol}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 2 }}>
        <DetailRow
          icon={<CreditCardOutlinedIcon fontSize="small" />}
          label="NIT / Cédula"
          value={<Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>{usuario.cedula}</Typography>}
        />
        <DetailRow
          icon={<MailOutlinedIcon fontSize="small" />}
          label="Email"
          value={<Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>{usuario.email}</Typography>}
        />
        <DetailRow
          icon={<PhoneOutlinedIcon fontSize="small" />}
          label="Teléfono"
          value={<Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>{usuario.telefono}</Typography>}
        />
        <DetailRow
          icon={<ShieldOutlinedIcon fontSize="small" />}
          label="Rol"
          value={<Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>{usuario.rol}</Typography>}
        />
        <DetailRow
          icon={<LockOutlinedIcon fontSize="small" />}
          label="Estado"
          value={<StatusChip estado={usuario.estado} />}
        />

        <Box sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1.5 }}>
            <AppsOutlinedIcon fontSize="small" />
            <Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>
              Módulos visibles ({modulos.length})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {modulos.map((m) => (
              <Chip
                key={m.nombre}
                size="small"
                label={m.esExtra ? `${m.nombre} +` : m.nombre}
                sx={{
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                  border: '1px solid',
                  borderColor: 'divider',
                  fontWeight: 600,
                }}
              />
            ))}
          </Box>
          {tieneExtras && (
            <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 1.5 }}>
              Los módulos marcados con "+" fueron otorgados directamente al usuario, además de
              los que ya incluye su rol.
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}