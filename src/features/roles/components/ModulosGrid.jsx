import { useTheme } from '@mui/material/styles' // ✅ Detecta automáticamente el tema activo
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { BRAND } from '@shared/utils/colors'
import { MODULOS } from '../services/rolesService'

export default function ModulosGrid({ value = [], onChange }) {
  const theme = useTheme() // ✅ Sabemos si es modo claro u oscuro
  const esModoOscuro = theme.palette.mode === 'dark'

  // 🎨 Colores según el tema activo
  const colores = {
    claro: {
      selectedBg: BRAND.orangeSoftBg,   // ✅ El que ya tenías antes — se ve bien en claro
      unselectedBg: 'action.hover',
      border: BRAND.orange,
      textSelected: BRAND.orangeDark,
      textUnselected: 'text.secondary',
      checkIcon: BRAND.orange,
    },
    oscuro: {
      selectedBg: '#543928',      // ✅ El que ajustamos — se ve bien en oscuro
      unselectedBg: '#2b241f',
      border: '#7a5a42',
      textSelected: '#f8e9da',
      textUnselected: '#b8a99a',
      checkIcon: '#e0a870',
    },
  }

  const c = esModoOscuro ? colores.oscuro : colores.claro

  const interactive = Boolean(onChange)
  const toggle = (modulo) => {
    if (!interactive) return
    if (value.includes(modulo)) onChange(value.filter((m) => m !== modulo))
    else onChange([...value, modulo])
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2 }}>
      {MODULOS.map((modulo) => {
        const checked = value.includes(modulo)
        return (
          <Box
            key={modulo}
            onClick={() => toggle(modulo)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              border: `1px solid ${checked ? c.border : 'transparent'}`,
              bgcolor: checked ? c.selectedBg : c.unselectedBg,
              cursor: interactive ? 'pointer' : 'default',
              userSelect: 'none',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: checked
                  ? (esModoOscuro ? '#5f4230' : '#f9e5d5')
                  : (esModoOscuro ? '#342c24' : 'rgba(0,0,0,0.04)'),
              },
            }}
          >
            {checked ? (
              <CheckBoxIcon fontSize="small" sx={{ color: c.checkIcon }} />
            ) : (
              <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: c.textUnselected }} />
            )}
            <Typography
              sx={{
                fontSize: 13.5,
                fontWeight: checked ? 700 : 500,
                color: checked ? c.textSelected : c.textUnselected,
              }}
            >
              {modulo}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}