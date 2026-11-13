import { useState, useRef, useEffect, useCallback, Component } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { IconChevronLeft, IconChevronRight, IconPhoto } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import { useCategorias } from '@features/categorias'

class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box component="section" id="carta" sx={{ bgcolor: '#FAF5EE', py: { xs: 8, md: 12.5 } }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, textAlign: 'center', py: 4 }}>
            <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, color: '#2E1810', fontWeight: 500 }}>
              Error al cargar categorías
            </Typography>
            <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: 'rgba(46,24,16,0.6)', mt: 1 }}>
              {this.state.error?.message}
            </Typography>
          </Box>
        </Box>
      )
    }
    return this.props.children
  }
}

const GAP = 24 // gap: 3 en MUI = 24px
const AUTOPLAY_MS = 5000

function CategoriesInner({ isDark }) {
  const { allCategorias: todas } = useCategorias()

  const categories = todas.filter(
    (c) => c.estado === 'Activa' && (c.tipo === 'Producto' || c.tipo === 'Ambos')
  )

  const [hovered, setHovered] = useState(null)
  const [active, setActive] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef(null)

  const getStep = () => {
    const track = trackRef.current
    return track && track.children[0] ? track.children[0].offsetWidth + GAP : 1
  }

  // Cuántas posiciones de desplazamiento existen según el ancho actual
  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const max = Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / getStep()))
    setMaxIndex(max)
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  const goTo = useCallback(
    (i) => {
      const track = trackRef.current
      if (!track) return
      const target = i > maxIndex ? 0 : i < 0 ? maxIndex : i
      track.scrollTo({ left: target * getStep(), behavior: 'smooth' })
      setActive(target)
    },
    [maxIndex]
  )

  // Mantiene el punto activo sincronizado cuando se desliza con el dedo o el mouse
  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    setActive(Math.min(maxIndex, Math.round(track.scrollLeft / getStep())))
  }

  // Autoplay: se pausa al pasar el mouse / enfocar y se desactiva con "reducir movimiento"
  useEffect(() => {
    if (paused || maxIndex === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => goTo(active + 1), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [paused, active, maxIndex, goTo])

  const arrowSx = {
    position: 'absolute',
    top: { xs: '34%', md: '38%' },
    zIndex: 2,
    width: 44,
    height: 44,
    bgcolor: isDark ? '#2E1810' : '#FFFFFF',
    color: '#C08552',
    border: '1px solid #C08552',
    boxShadow: '0 4px 16px rgba(46,24,16,0.18)',
    '&:hover': { bgcolor: '#C08552', color: '#FAF5EE' },
  }

  if (categories.length === 0) {
    return (
      <Box component="section" id="carta" sx={{ bgcolor: isDark ? '#1A0D07' : '#FAF5EE', py: { xs: 8, md: 12.5 } }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, textAlign: 'center', py: 4 }}>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, color: isDark ? 'rgba(243,233,220,0.5)' : 'rgba(46,24,16,0.55)' }}>
            No hay categorías disponibles en este momento.
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box component="section" id="carta" sx={{ bgcolor: isDark ? '#1A0D07' : '#FAF5EE', py: { xs: 8, md: 12.5 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#C08552',
              display: 'block',
              mb: 2,
            }}
          >
            Lo que preparamos
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: fonts.serif,
              fontSize: { xs: 36, md: 48 },
              fontWeight: 300,
              color: isDark ? '#F3E9DC' : '#2E1810',
              lineHeight: 1.15,
            }}
          >
            Nuestras Categorias de Productos
          </Typography>
        </Box>

        <Box
          sx={{ position: 'relative' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {maxIndex > 0 && (
            <>
              <IconButton aria-label="Anterior" onClick={() => goTo(active - 1)} sx={{ ...arrowSx, left: { xs: 8, md: -22 } }}>
                <IconChevronLeft size={20} stroke={1.5} />
              </IconButton>
              <IconButton aria-label="Siguiente" onClick={() => goTo(active + 1)} sx={{ ...arrowSx, right: { xs: 8, md: -22 } }}>
                <IconChevronRight size={20} stroke={1.5} />
              </IconButton>
            </>
          )}

          <Box
            ref={trackRef}
            onScroll={handleScroll}
            sx={{
              display: 'flex',
              gap: `${GAP}px`,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              pb: 2, // espacio para la sombra de las tarjetas
            }}
          >
            {categories.map((cat, i) => (
              <Box
                key={cat.id}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                sx={{
                  flex: {
                    xs: '0 0 82%',
                    sm: `0 0 calc((100% - ${GAP}px) / 2)`,
                    md: `0 0 calc((100% - ${GAP * 2}px) / 3)`,
                  },
                  scrollSnapAlign: 'start',
                  bgcolor: isDark ? '#2E1810' : '#FFFFFF',
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: hovered === i ? '0 8px 32px rgba(46,24,16,0.14)' : '0 2px 12px rgba(46,24,16,0.06)',
                  borderBottom: hovered === i ? '2px solid #C08552' : '2px solid transparent',
                  transition: 'box-shadow 0.25s, border-color 0.25s',
                }}
              >
                <Box sx={{ aspectRatio: '1/1', overflow: 'hidden', position: 'relative' }}>
                  <Box
                    component="img"
                    src={cat.urlImagen}
                    alt={cat.nombre}
                    draggable={false}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                      transform: hovered === i ? 'scale(1.04)' : 'scale(1)',
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const placeholder = e.currentTarget.parentElement?.querySelector('svg')
                      if (placeholder) placeholder.style.display = 'block'
                    }}
                  />
                  <IconPhoto
                    size={32}
                    color={isDark ? 'rgba(243,233,220,0.3)' : 'rgba(46,24,16,0.3)'}
                    style={{
                      display: 'none',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </Box>
                <Box sx={{ px: 2.5, pt: 2.5, pb: 2.75 }}>
                  <Typography
                    sx={{
                      fontFamily: fonts.serif,
                      fontSize: 20,
                      color: isDark ? '#F3E9DC' : '#2E1810',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {cat.nombre}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {maxIndex > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <Box
                key={i}
                role="button"
                aria-label={`Ir a la posición ${i + 1}`}
                onClick={() => goTo(i)}
                sx={{
                  width: i === active ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  cursor: 'pointer',
                  bgcolor: i === active ? '#C08552' : isDark ? 'rgba(243,233,220,0.25)' : 'rgba(46,24,16,0.2)',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export function Categories({ isDark }) {
  return (
    <ErrorBoundary>
      <CategoriesInner isDark={isDark} />
    </ErrorBoundary>
  )
}
