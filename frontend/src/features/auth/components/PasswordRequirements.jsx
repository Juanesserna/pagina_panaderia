import { Box, Typography, LinearProgress } from '@mui/material'
import { IconCheck, IconCircle } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import { PASSWORD_RULES } from '../utils/authValidations'

export default function PasswordRequirements({
  password = '',
  isDark = false,
}) {
  const rules = PASSWORD_RULES.map((rule) => ({
    ...rule,
    valid: Boolean(password) && rule.test(password),
  }))

  const completed = rules.filter((rule) => rule.valid).length
  const total = rules.length
  const allValid = completed === total

  const textColor = isDark ? '#F2E9DD' : '#4A2E17'
  const mutedColor = isDark ? '#C4B5A6' : '#796655'
  const successColor = isDark ? '#81C784' : '#2E7D32'

  return (
    <Box
      sx={{
        p: 1.25,
        minWidth: 0,
        borderRadius: 2,
        bgcolor: isDark ? '#34271F' : '#FAF5EE',
        border: '1px solid',
        borderColor: isDark ? '#59483B' : '#E8DCCE',
      }}
    >
      {/* Resumen de requisitos cumplidos */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 0.5,
          mb: 0.75,
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontSize: 12,
            fontWeight: 600,
            color: textColor,
          }}
        >
          Requisitos de contraseña
        </Typography>

        <Typography
          aria-live="polite"
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: allValid ? successColor : mutedColor,
          }}
        >
          {completed}/{total} cumplidos
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={(completed / total) * 100}
        aria-label="Requisitos de contraseña cumplidos"
        sx={{
          height: 4,
          borderRadius: 3,
          mb: 1,
          bgcolor: isDark ? '#59483B' : '#E8DCCE',
          '& .MuiLinearProgress-bar': {
            borderRadius: 3,
            bgcolor: allValid ? successColor : '#C97A43',
            transition: 'transform 250ms ease, background-color 250ms ease',
          },
          '@media (prefers-reduced-motion: reduce)': {
            '& .MuiLinearProgress-bar': {
              transition: 'none',
            },
          },
        }}
      />

      {/* Indicadores de validación en tiempo real */}
      <Box
        component="ul"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            sm: 'repeat(2, minmax(0, 1fr))',
          },
          gap: 0.5,
          p: 0,
          m: 0,
          listStyle: 'none',
        }}
      >
        {rules.map(({ id, label, valid }) => {
          const Icon = valid ? IconCheck : IconCircle

          return (
            <Box
              component="li"
              key={id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                minWidth: 0,
                gap: 0.75,
                color: valid ? successColor : mutedColor,
                transition: 'color 200ms ease',
                '& svg': {
                  flexShrink: 0,
                },
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                },
              }}
            >
              <Icon
                size={14}
                stroke={1.8}
                aria-hidden="true"
              />

              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: 11,
                  lineHeight: 1.4,
                }}
              >
                {id === 'maximum'
                  ? 'Longitud máxima permitida'
                  : label}

                {/* Estado accesible para lectores de pantalla */}
                <Box
                  component="span"
                  sx={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clipPath: 'inset(50%)',
                    whiteSpace: 'nowrap',
                    border: 0,
                  }}
                >
                  {valid ? ', cumplido' : ', pendiente'}
                </Box>
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}