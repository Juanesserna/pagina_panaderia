// src/features/landing/pages/CatalogoPage.jsx
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'
import { fonts } from '@app/theme/colors'
import { products } from '../data/products'
import { ProductCard } from '../components/Products'
import { useCart } from '../context/CartContext'

const categories = ['Todos', ...new Set(products.map((p) => p.category))]

export default function CatalogoPage() {
  const { isDark } = useOutletContext()
  const { addItem } = useCart()
  const [category, setCategory] = useState('Todos')
  const [added, setAdded] = useState(null)

  const visible = category === 'Todos' ? products : products.filter((p) => p.category === category)

  const handleAdd = (p) => {
    addItem({ id: p.id, name: p.name, price: p.price, img: p.img })
    setAdded(p.id)
    setTimeout(() => setAdded(null), 900)
  }

  return (
    <Box component="section" sx={{ bgcolor: isDark ? '#150a03' : '#F7F0E6', pt: { xs: 14, md: 16 }, pb: { xs: 8, md: 12.5 }, minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C08552', mb: 1.5 }}>
          Horneado cada día
        </Typography>
        <Typography component="h1" sx={{ fontFamily: fonts.serif, fontSize: { xs: 36, md: 48 }, fontWeight: 300, color: isDark ? '#F3E9DC' : '#2E1810', mb: 4 }}>
          Catálogo de productos
        </Typography>

        {/* Filtros */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 5 }}>
          {categories.map((cat) => {
            const active = category === cat
            return (
              <Button
                key={cat}
                onClick={() => setCategory(cat)}
                sx={{
                  px: 2, py: 0.75, fontSize: 12, textTransform: 'none',
                  border: '1px solid #C08552',
                  bgcolor: active ? '#C08552' : 'transparent',
                  color: active ? '#FAF5EE' : '#C08552',
                  '&:hover': { bgcolor: '#C08552', color: '#FAF5EE' },
                }}
              >
                {cat}
              </Button>
            )
          })}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} isDark={isDark} isAdded={added === p.id} onAdd={() => handleAdd(p)} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}