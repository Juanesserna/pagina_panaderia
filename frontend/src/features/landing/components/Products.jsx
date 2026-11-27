// src/features/landing/components/Products.jsx
import { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { IconCirclePlus } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import { useProductosLanding } from '@features/landing/hooks/useProductosLanding'

/* ───────────── Helpers ───────────── */

export function formatPrice(p) {
  return `$${p.toLocaleString('es-CO')}`
}

const ADDED_FEEDBACK_MS = 900

// Imagen por defecto cuando el producto no tiene imagen en la API
const IMG_POR_DEFECTO =
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=450&fit=crop&auto=format'

// Descripción por defecto cuando el producto no tiene descripción en la API
const DESCRIPCION_POR_DEFECTO = 'Sin descripción disponible'

/* ───────────── Sección: "Lo más pedido" ─────────────
   Props:
   - isDark:      modo oscuro
   - onAddToCart: recibe { id, name, price, img }
   - limit:       (opcional) cantidad máxima de productos a mostrar
*/
export function Products({ isDark, onAddToCart, limit }) {
  const [added, setAdded] = useState(null)
  const { productos: productosApi, cargando, error } = useProductosLanding()

  // Mapear campos de la API al formato que usa ProductCard
  const productos = productosApi.map((p) => ({
    id: p.id,
    name: p.nombre,
    category: p.categoria,
    price: p.precio,
    img: p.imagen || IMG_POR_DEFECTO,
    description: p.descripcion || DESCRIPCION_POR_DEFECTO,
  }))

  const handleAdd = (product) => {
    onAddToCart({ id: product.id, name: product.name, price: product.price, img: product.img })
    setAdded(product.id)
    setTimeout(() => setAdded(null), ADDED_FEEDBACK_MS)
  }

  // Estado de carga o error
  if (cargando) {
    return (
      <Box component="section" sx={{ bgcolor: isDark ? '#150a03' : '#F7F0E6', py: { xs: 8, md: 12.5 } }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, textAlign: 'center', py: 4 }}>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, color: isDark ? 'rgba(243,233,220,0.6)' : 'rgba(46,24,16,0.55)' }}>
            Cargando productos…
          </Typography>
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box component="section" sx={{ bgcolor: isDark ? '#150a03' : '#F7F0E6', py: { xs: 8, md: 12.5 } }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, textAlign: 'center', py: 4 }}>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, color: '#C08552', fontWeight: 500 }}>
            Error al cargar productos
          </Typography>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: isDark ? 'rgba(243,233,220,0.6)' : 'rgba(46,24,16,0.55)', mt: 1 }}>
            {error}
          </Typography>
        </Box>
      </Box>
    )
  }

  // Lista vacía
  if (productos.length === 0) {
    return (
      <Box component="section" sx={{ bgcolor: isDark ? '#150a03' : '#F7F0E6', py: { xs: 8, md: 12.5 } }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, textAlign: 'center', py: 4 }}>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, color: isDark ? 'rgba(243,233,220,0.6)' : 'rgba(46,24,16,0.55)' }}>
            No hay productos disponibles en este momento.
          </Typography>
        </Box>
      </Box>
    )
  }

  const productosAMostrar = limit ? productos.slice(0, limit) : productos

  return (
    <Box component="section" sx={{ bgcolor: isDark ? '#150a03' : '#F7F0E6', py: { xs: 8, md: 12.5 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <SectionHeader isDark={isDark} eyebrow="Nuestros favoritos" title="Lo más pedido" />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {productosAMostrar.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isDark={isDark}
              isAdded={added === p.id}
              onAdd={() => handleAdd(p)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

/* ───────────── Encabezado de sección ───────────── */

function SectionHeader({ isDark, eyebrow, title }) {
  return (
    <Box sx={{ mb: 7 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.75 }}>
        <Box sx={{ width: 32, height: '1px', bgcolor: '#C08552' }} />
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#C08552',
          }}
        >
          {eyebrow}
        </Typography>
      </Box>
      <Typography
        component="h2"
        sx={{ fontFamily: fonts.serif, fontSize: { xs: 36, md: 48 }, fontWeight: 300, lineHeight: 1.12, color: isDark ? '#F3E9DC' : '#2E1810' }}
      >
        {title}
      </Typography>
    </Box>
  )
}

/* ───────────── Tarjeta de producto (reutilizada en el catálogo) ───────────── */

export function ProductCard({ product, isDark, isAdded, onAdd }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        bgcolor: isDark ? '#2E1810' : '#FFFFFF',
        borderRadius: '2px',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: hovered ? 'rgba(192,133,82,0.45)' : 'rgba(192,133,82,0.16)',
        boxShadow: hovered ? '0 12px 32px rgba(46,24,16,0.14)' : '0 2px 12px rgba(46,24,16,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          transform: 'none',
        },
      }}
    >
      {/* Imagen + categoría */}
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
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
              transform: 'none',
            },
          }}
        />
        <Typography
          sx={{
            position: 'absolute',
            top: 14,
            left: 14,
            bgcolor: 'rgba(46,24,16,0.82)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(192,133,82,0.4)',
            color: '#FAF5EE',
            px: 1.4,
            py: 0.45,
            borderRadius: '2px',
            fontFamily: fonts.sans,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          {product.category}
        </Typography>
      </Box>

      {/* Contenido */}
      <Box sx={{ px: 3, pt: 2.75, pb: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontFamily: fonts.serif, fontSize: 23, fontWeight: 400, color: isDark ? '#F3E9DC' : '#2E1810', mb: 0.75, lineHeight: 1.2 }}>
          {product.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontSize: 13.5,
            fontWeight: 300,
            color: isDark ? 'rgba(243,233,220,0.65)' : 'rgba(46,24,16,0.6)',
            mb: 2.5,
            lineHeight: 1.6,
            flex: 1,
          }}
        >
          {product.description}
        </Typography>

        {/* Precio + botón */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 2,
            borderTop: '1px solid rgba(192,133,82,0.16)',
          }}
        >
          <Typography sx={{ fontFamily: fonts.serif, fontSize: 23, fontWeight: 400, color: isDark ? '#C08552' : '#5B3023' }}>
            {formatPrice(product.price)}
          </Typography>
          <Button
            onClick={onAdd}
            startIcon={<IconCirclePlus size={15} stroke={1.5} />}
            sx={{
              bgcolor: isAdded ? '#C08552' : 'transparent',
              color: isAdded ? '#FAF5EE' : '#C08552',
              border: '1px solid #C08552',
              borderRadius: '2px',
              px: 2,
              py: 0.85,
              fontFamily: fonts.sans,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'none',
              transition: 'background-color 0.25s ease, color 0.25s ease',
              '&:hover': { bgcolor: '#C08552', color: '#FAF5EE' },
              '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
            }}
          >
            {isAdded ? 'Añadido' : 'Agregar'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
