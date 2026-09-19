import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import { Search } from 'lucide-react'
import AddIcon from '@mui/icons-material/Add'
import { BRAND } from '@shared/utils/colors'

export default function RolesToolbar({ search, onSearchChange, onNuevoRol }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 1.5,
        p: 2.5,
        flexWrap: 'wrap',
      }}
    >
      <TextField
        size="small"
        placeholder="Buscar rol por nombre..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          width: 280,
          '& .MuiOutlinedInput-root': { bgcolor: 'action.hover', borderRadius: 2 },
        }}
        slotProps={{
            input: {
            startAdornment: (
            <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
            <Search size={18} />
            </InputAdornment>
            ),
          },
        }}
      />

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onNuevoRol}
        sx={{ bgcolor: BRAND.orange, '&:hover': { bgcolor: BRAND.orangeDark } }}
      >
        Nuevo rol
      </Button>
    </Box>
  )
}