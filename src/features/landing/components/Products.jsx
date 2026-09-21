import { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { IconCirclePlus } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

const products = [
  {
    id: 1,
    category: 'Pan Artesanal',
    name: 'Sourdough Campesino',
    description: 'Masa madre 72h, corteza crujiente, miga abierta',
    price: 18500,
    img: 'https://images.unsplash.com/photo-1725297952102-ab28892a31ab?w=600&h=450&fit=crop&auto=format',
  },
  {
    id: 2,
    category: 'Pastelería',
    name: 'Croissant de Mantequilla',
    description: 'Hojaldrado con mantequilla importada, 27 capas',
    price: 8900,
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=450&fit=crop&auto=format',
  },
  {
    id: 3,
    category: 'Pastelería',
    name: 'Pain au Chocolat',
    description: 'Chocolate 70% Tumaco, masa hojaldrada artesanal',
    price: 9500,
    img: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600&h=450&fit=crop&auto=format',
  },
  {
    id: 4,
    category: 'Pan Artesanal',
    name: 'Ciabatta al Romero',
    description: 'Aceite de oliva extra virgen, romero fresco',
    price: 14000,
    img: 'https://images.unsplash.com/photo-1587912001191-0cd4f14fd89e?w=600&h=450&fit=crop&auto=format',
  },
  {
    id: 5,
    category: 'Bebidas',
    name: 'Café de Origen',
    description: 'Selección de finca, método filtrado con precisión',
    price: 7500,
    img: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&h=450&fit=crop&auto=format',
  },
  {
    id: 6,
    category: 'Tortas',
    name: 'Torta de Temporada',
    description: 'Frutos de estación, crema diplomática, bizcocho húmedo',
    price: 89000,
    img: 'https://images.unsplash.com/photo-1604413191066-4dd20bedf486?w=600&h=450&fit=crop&auto=format',
  },
]

function formatPrice(p) {
  return `$${p.toLocaleString('es-CO')}`
}

export function Products({ isDark, onAddToCart }) {
  const [added, setAdded] = useState(null)

  const handleAdd = (product) => {
    onAddToCart({ id: product.id, name: product.name, price: product.price, img: product.img })
    setAdded(product.id)
    setTimeout(() => setAdded(null), 900)
  }

  return (
    <Box component="section" sx={{ bgcolor: isDark ? '#150a03' : '#F7F0E6', py: { xs: 8, md: 12.5 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Box sx={{ mb: 7 }}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#C08552',
              display: 'block',
              mb: 1.5,
            }}
          >
            Nuestros favoritos
          </Typography>
          <Typography
            component="h2"
            sx={{ fontFamily: fonts.serif, fontSize: { xs: 36, md: 48 }, fontWeight: 300, color: isDark ? '#F3E9DC' : '#2E1810' }}
          >
            Lo más pedido
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} isDark={isDark} isAdded={added === p.id} onAdd={() => handleAdd(p)} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

function ProductCard({ product, isDark, isAdded, onAdd }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        bgcolor: isDark ? '#2E1810' : '#FFFFFF',
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: hovered ? '0 8px 32px rgba(46,24,16,0.14)' : '0 2px 12px rgba(46,24,16,0.06)',
        transition: 'box-shadow 0.25s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
        <Box
          component="img"
          src={product.img}
          alt={product.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />
        <Typography
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: '#C08552',
            color: '#FAF5EE',
            px: 1.25,
            py: 0.4,
            borderRadius: 0.5,
            fontFamily: fonts.sans,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {product.category}
        </Typography>
      </Box>

      <Box sx={{ px: 2.5, pt: 2.5, pb: 2.75, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontFamily: fonts.serif, fontSize: 22, color: isDark ? '#F3E9DC' : '#2E1810', mb: 0.75, lineHeight: 1.2 }}>
          {product.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontSize: 13,
            fontWeight: 300,
            color: isDark ? 'rgba(243,233,220,0.6)' : 'rgba(46,24,16,0.55)',
            mb: 2,
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {product.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: fonts.serif, fontSize: 22, color: '#5B3023' }}>{formatPrice(product.price)}</Typography>
          <Button
            onClick={onAdd}
            startIcon={<IconCirclePlus size={15} stroke={1.5} />}
            sx={{
              bgcolor: isAdded ? '#C08552' : 'transparent',
              color: isAdded ? '#FAF5EE' : '#C08552',
              border: '1px solid #C08552',
              px: 1.75,
              py: 0.85,
              fontSize: 12,
              letterSpacing: '0.04em',
              textTransform: 'none',
              '&:hover': { bgcolor: '#C08552', color: '#FAF5EE' },
            }}
          >
            {isAdded ? 'Añadido' : 'Agregar'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export { formatPrice }
