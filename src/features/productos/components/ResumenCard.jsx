import { Card, CardContent, Box, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconArrowUpRight } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

export default function ResumenCard({ titulo, valor, variacion, icono, iconoColor = 'success' }) {
  const theme = useTheme()
  const colorMain = theme.palette[iconoColor].main
  const iconoBg = alpha(colorMain, 0.12)

  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: 280,
        borderRadius: 3,
        borderColor: theme.palette.divider,
        backgroundColor: 'background.paper',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="caption"
            sx={{
              fontFamily: fonts.sans,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontSize: 11,
              fontWeight: 500,
              color: theme.palette.text.secondary,
            }}
          >
            {titulo}
          </Typography>

          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 40,
              fontWeight: 400,
              lineHeight: 1.1,
              color: theme.palette.text.primary,
              mt: 0.75,
            }}
          >
            {valor}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <IconArrowUpRight size={14} color={theme.palette.success.main} />
            <Typography
              variant="caption"
              sx={{
                fontFamily: fonts.sans,
                fontSize: 12,
                fontWeight: 500,
                color: theme.palette.success.main,
              }}
            >
              {variacion}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: iconoBg,
            flexShrink: 0,
            '& svg': {
              color: colorMain,
            },
          }}
        >
          {icono}
        </Box>
      </CardContent>
    </Card>
  )
}
