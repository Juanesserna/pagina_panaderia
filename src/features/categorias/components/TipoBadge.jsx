import { Box, Chip, Typography, useTheme } from '@mui/material'
import { fonts } from '@app/theme/colors'

const TIPO_COLORS = {
  Ambos: { bg: '#EDE9FE', text: '#7C3AED' }, // morado/lila
  Producto: { bg: '#DBEAFE', text: '#2563EB' }, // azul
  Insumo: { bg: '#FFEDD5', text: '#EA580C' }, // naranja/durazno
}

export default function TipoBadge({ tipo, productosCount = 0, insumosCount = 0 }) {
  const theme = useTheme()
  const colors = TIPO_COLORS[tipo] || TIPO_COLORS.Producto

  const countParts = []
  if (productosCount > 0) countParts.push(`${productosCount} producto${productosCount !== 1 ? 's' : ''}`)
  if (insumosCount > 0) countParts.push(`${insumosCount} insumo${insumosCount !== 1 ? 's' : ''}`)
  const countText = countParts.join(' · ')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
      <Chip
        label={tipo}
        sx={{
          fontFamily: fonts.sans,
          fontSize: 11,
          fontWeight: 600,
          color: colors.text,
          bgcolor: colors.bg,
          border: 'none',
          height: 22,
          borderRadius: 1,
          px: 1,
          justifyContent: 'flex-start',
        }}
      />
      {countText && (
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontSize: 10,
            color: theme.palette.text.secondary,
            lineHeight: 1.2,
          }}
        >
          {countText}
        </Typography>
      )}
    </Box>
  )
}