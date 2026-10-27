import Box from '@mui/material/Box'
import { SearchInput, Button } from '@shared/ui'
import AddIcon from '@mui/icons-material/Add'

export default function RolesToolbar({ search, onSearchChange, onNuevoRol }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 2,
        p: 2.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        flexWrap: 'wrap',
      }}
    >
      <SearchInput
        placeholder="Buscar rol por nombre..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <Button
        size="toolbar"
        leftIcon={<AddIcon />}
        onClick={onNuevoRol}
      >
        Crear rol
      </Button>
    </Box>
  )
}
