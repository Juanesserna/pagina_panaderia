import { Card, CardContent, Box, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { fonts } from '@app/theme/colors'

export default function StatsCard({ icon, label, value, iconBgColor }) {
  const theme = useTheme()
  const colorMain = theme.palette[iconBgColor]?.main || theme.palette.primary.main
  const bgColor = alpha(colorMain, 0.12)

  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: 220,
        flex: 1,
        borderRadius: 3,
        borderColor: theme.palette.divider,
        backgroundColor: 'background.paper',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 1,
          py: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
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
            {label}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 1,
              backgroundColor: bgColor,
              flexShrink: 0,
            }}
          >
            {icon && typeof icon === 'object' ? (
              icon
            ) : (
              <Box
                component="span"
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: colorMain,
                }}
              />
            )}
          </Box>
        </Box>

        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.1,
            color: theme.palette.text.primary,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}