import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'

export default function RolesInfoBanner() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 2,
        mb: 2.5,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      <TuneOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>
        Un rol desactivado deja de aparecer como opción al crear o editar usuarios, pero los
        usuarios que ya lo tienen asignado conservan su rol y sus módulos.
      </Typography>
    </Box>
  )
}