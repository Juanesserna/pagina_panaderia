import { Box, Stack, Typography, Divider } from '@mui/material'
import {
  IconBread,
  IconLeaf,
  IconUsers,
} from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

const items = [
  { icon: <IconBread size={17} stroke={1.35} />, label: 'Horneado cada mañana' },
  { icon: <IconLeaf size={17} stroke={1.35} />, label: 'Ingredientes locales' },
  { icon: <IconUsers size={17} stroke={1.35} />, label: 'NUESTRO AROMA EN TU HOGAR' },
]

export function TrustBar() {
  return (
    <Box
      sx={{
        bgcolor: '#5B3023',
        borderTop: '1px solid rgba(192,133,82,0.38)',
        borderBottom: '1px solid rgba(192,133,82,0.38)',
        minHeight: { md: 86 },
        py: { xs: 3, md: 2.5 },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Stack
        direction="row"
        sx={{
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'space-between' },
          rowGap: 2,
          columnGap: { xs: 3.5, md: 2 },
          maxWidth: 1200,
          mx: 'auto',
          px: 3,
          width: '100%',
        }}
      >
        {items.map((item, i) => (
          <Stack
            key={item.label}
            direction="row"
            alignItems="center"
            spacing={{ xs: 1.5, md: 4 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ color: '#C08552', display: 'flex' }}>
                {item.icon}
              </Box>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(250,245,238,0.88)',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </Typography>
            </Stack>

            {i < items.length - 1 && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: { xs: 'none', md: 'block' },
                  borderColor: 'rgba(192,133,82,0.28)',
                  height: 18,
                  my: 'auto',
                }}
              />
            )}
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}