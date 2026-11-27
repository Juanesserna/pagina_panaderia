import Box from '@mui/material/Box'
import { SearchInput, Button } from '@shared/ui'
import AddIcon from '@mui/icons-material/Add'

export default function RolesToolbar({
  search,
  onSearchChange,
  onNuevoRol,
  submitting = false,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        gap: 1.25,
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: 300 },
          minWidth: 0,
          '& .MuiInputBase-root': {
            height: 36,
            fontSize: 13,
          },
        }}
      >
        <SearchInput
          placeholder="Buscar rol..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </Box>

      <Button
        size="toolbar"
        leftIcon={<AddIcon fontSize="small" />}
        onClick={onNuevoRol}
        disabled={submitting}
        sx={{
          height: 36,
          minHeight: 36,
          fontSize: 13,
          px: 2,
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        Crear rol
      </Button>
    </Box>
  )
}
