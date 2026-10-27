import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { MODULOS } from '../services/rolesService'

export default function ModulosGrid({ value = [], onChange }) {
  const theme = useTheme()
  const esModoOscuro = theme.palette.mode === 'dark'

  const interactive = Boolean(onChange)

  const toggle = (modulo) => {
    if (!interactive) return

    if (value.includes(modulo)) {
      onChange(value.filter((m) => m !== modulo))
    } else {
      onChange([...value, modulo])
    }
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 1.2,
      }}
    >
      {MODULOS.map((modulo) => {
        const checked = value.includes(modulo)

        return (
          <Box
            key={modulo}
            onClick={() => toggle(modulo)}
            role={interactive ? 'checkbox' : undefined}
            aria-checked={interactive ? checked : undefined}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={(event) => {
              if (!interactive || (event.key !== 'Enter' && event.key !== ' ')) {
                return
              }

              event.preventDefault()
              toggle(modulo)
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: checked ? 'primary.main' : 'transparent',
              bgcolor: checked
                ? 'action.selected'
                : 'background.alt',
              cursor: interactive ? 'pointer' : 'default',
              userSelect: 'none',
              transition: 'background-color 0.15s ease, border-color 0.15s ease',
              '&:hover': interactive
                ? {
                    bgcolor: checked ? 'action.selected' : 'action.hover',
                  }
                : undefined,
              '&:focus-visible': interactive
                ? {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 2,
                  }
                : undefined,
            }}
          >
            {checked ? (
              <CheckBoxIcon
                fontSize="small"
                sx={{ color: 'primary.main' }}
              />
            ) : (
              <CheckBoxOutlineBlankIcon
                fontSize="small"
                sx={{ color: 'text.secondary' }}
              />
            )}

            <Typography
              variant="body2"
              sx={{
                color: checked ? 'text.primary' : 'text.secondary',
                fontWeight: checked ? 'bold' : 'normal',
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
