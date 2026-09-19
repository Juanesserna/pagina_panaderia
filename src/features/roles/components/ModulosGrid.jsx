import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { BRAND } from '@shared/utils/colors'
import { MODULOS } from '../services/rolesService'

export default function ModulosGrid({ value = [], onChange }) {
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
              border: `1px solid ${checked ? BRAND.orange : 'transparent'}`,
              bgcolor: checked ? BRAND.orangeSoftBg : 'action.hover',
              cursor: interactive ? 'pointer' : 'default',
              userSelect: 'none',
              transition: 'border-color 0.15s, background-color 0.15s',
            }}
          >
            {checked ? (
              <CheckBoxIcon fontSize="small" sx={{ color: BRAND.orange }} />
            ) : (
              <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            )}
            <Typography
              sx={{
                fontSize: 13.5,
                fontWeight: checked ? 700 : 500,
                color: checked ? BRAND.orangeDark : 'text.secondary',
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