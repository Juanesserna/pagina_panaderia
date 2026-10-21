import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'

export default function RolesInfoBanner() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1.5,
        my: 0,
        bgcolor: 'background.paper',
        borderLeft: '1px solid',
        borderRight: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
    >
      <TuneOutlinedIcon
        sx={{
          color: 'primary.main',
          flexShrink: 0,
        }}
      />

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        Un rol desactivado deja de aparecer como opción al crear o editar usuarios, pero los
        usuarios que ya lo tienen asignado conservan su rol y sus módulos.
      </Typography>
    </Box>
  )
}
