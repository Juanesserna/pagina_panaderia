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

// Etiqueta visible de cada píldora (solo presentación; la categoría real sigue siendo la del dato).
// La data trae "Repostería"; en la landing se muestra como "Pastelería".
const ETIQUETA_PILLA = {
  Repostería: 'Pastelería',
}

// Fotografías cálidas y coherentes por categoría.
// Para usar archivos locales, coloca las imágenes en `src/assets/img/` y reemplaza cada URL por un import:
//   import snacksImg from '@assets/img/snacks.webp'
// y usa `snacksImg` como valor de la clave correspondiente.
const IMAGENES_CATEGORIA = {
  Panadería:
    'https://images.unsplash.com/photo-1587912001191-0cd4f14fd89e?w=900&q=80&fit=crop&auto=format',
  Repostería:
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&q=80&fit=crop&auto=format',
  Snacks:
    'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=900&q=80&fit=crop&auto=format',
  Temporada:
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=80&fit=crop&auto=format',
  'Sin gluten':
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80&fit=crop&auto=format',
}

// Línea secundaria bajo el nombre de la tarjeta (conteo/subtítulo).
const SUBTITULOS_CATEGORIA = {
  Snacks: (n) => `${n} variedades · Ver colección`,
  Temporada: (n) => `${n} especialidades · Colección actual`,
  'Sin gluten': (n) => `${n} opciones disponibles · Bajo pedido`,
}

const imagenDe = (cat) => IMAGENES_CATEGORIA[cat.nombre] || cat.urlImagen

const subtituloDe = (cat) => {
  const n = cat.productosCount ?? 0
  const fn = SUBTITULOS_CATEGORIA[cat.nombre]
  if (fn) return fn(n)
  return n > 0 ? `${n} variedades · Ver colección` : 'Colección actual'
}

const etiquetaDe = (cat) => ETIQUETA_PILLA[cat.nombre] || cat.nombre

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function CategoriesInner({ isDark }) {
  const { allCategorias: todas } = useCategorias()

  const categories = todas.filter(
    (c) => c.estado === 'Activa' && (c.tipo === 'Producto' || c.tipo === 'Ambos')
  )

  const [hovered, setHovered] = useState(null)
  const [active, setActive] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  // Categoría seleccionada desde las píldoras (id). Es independiente del índice del carrusel.
  const [selected, setSelected] = useState(null)
  const trackRef = useRef(null)
  const cardRefs = useRef(new Map())

  // Si la categoría seleccionada ya no existe (carga async o eliminación), cae en la primera.
  const selectedId =
    selected != null && categories.some((c) => c.id === selected) ? selected : categories[0]?.id ?? null

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

  // Selecciona una píldora: resalta la categoría y la trae a la vista sin alterar el paginado del carrusel.
  const seleccionarCategoria = (cat) => {
    setSelected(cat.id)
    const track = trackRef.current
    const el = cardRefs.current.get(cat.id)
    if (!track || !el) return
    const trackRect = track.getBoundingClientRect()
    const cardRect = el.getBoundingClientRect()
    const delta = cardRect.left - trackRect.left - (track.clientWidth - cardRect.width) / 2
    const max = Math.max(0, track.scrollWidth - track.clientWidth)
    const destino = Math.min(Math.max(0, track.scrollLeft + delta), max)
    track.scrollTo({ left: destino, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

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
    top: '48%',
    transform: 'translateY(-50%)',
    zIndex: 3,
    width: 44,
    height: 44,
    borderRadius: '50%',
    bgcolor: isDark ? 'rgba(46,24,16,0.92)' : 'rgba(255,255,255,0.94)',
    color: '#C08552',
    border: '1px solid #C08552',
    boxShadow: '0 6px 20px rgba(46,24,16,0.18)',
    transition: 'background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease',
    '&:hover': { bgcolor: '#C08552', color: '#FAF5EE', boxShadow: '0 8px 24px rgba(46,24,16,0.28)' },
    '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
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
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{ width: 28, height: '1px', bgcolor: '#C08552' }} />
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
              Lo que preparamos
            </Typography>
            <Box sx={{ width: 28, height: '1px', bgcolor: '#C08552' }} />
          </Box>
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
            Nuestras Categorías de Productos
          </Typography>

          {/* Píldoras de navegación rápida */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 },
              mt: { xs: 3, md: 3.5 },
            }}
          >
            {categories.map((cat) => {
              const activo = selectedId === cat.id
              return (
                <Box
                  key={cat.id}
                  component="button"
                  type="button"
                  aria-pressed={activo}
                  onClick={() => seleccionarCategoria(cat)}
                  sx={{
                    appearance: 'none',
                    cursor: 'pointer',
                    borderRadius: '999px',
                    px: { xs: 2.25, sm: 3 },
                    py: { xs: 1, sm: 1.25 },
                    fontFamily: fonts.sans,
                    fontSize: { xs: 12, sm: 12.5 },
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    color: activo ? '#FAF5EE' : isDark ? 'rgba(243,233,220,0.82)' : '#5B3023',
                    bgcolor: activo ? '#A8794A' : 'transparent',
                    border: '1px solid',
                    borderColor: activo ? '#A8794A' : 'rgba(192,133,82,0.45)',
                    boxShadow: activo ? '0 6px 18px rgba(168,121,74,0.28)' : 'none',
                    transition:
                      'background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                    '&:hover': {
                      bgcolor: activo ? '#A8794A' : 'rgba(192,133,82,0.12)',
                      borderColor: '#A8794A',
                    },
                    '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
                  }}
                >
                  {etiquetaDe(cat)}
                </Box>
              )
            })}
          </Box>
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
              <IconButton aria-label="Anterior" onClick={() => goTo(active - 1)} sx={{ ...arrowSx, left: { xs: 8, md: -21 } }}>
                <IconChevronLeft size={20} stroke={1.5} />
              </IconButton>
              <IconButton aria-label="Siguiente" onClick={() => goTo(active + 1)} sx={{ ...arrowSx, right: { xs: 8, md: -21 } }}>
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
              pt: 0.75,
              pb: 2, // espacio para la sombra de las tarjetas
            }}
          >
            {categories.map((cat, i) => (
              <Box
                key={cat.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(cat.id, el)
                  else cardRefs.current.delete(cat.id)
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                sx={{
                  flex: {
                    xs: '0 0 80%',
                    sm: `0 0 calc((100% - ${GAP}px) / 2)`,
                    md: `0 0 calc((100% - ${GAP * 2}px) / 3)`,
                  },
                  aspectRatio: '3/4',
                  position: 'relative',
                  scrollSnapAlign: 'start',
                  bgcolor: '#2E1810',
                  borderRadius: { xs: '18px', md: '20px' },
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor:
                    hovered === i ? 'rgba(192,133,82,0.65)' : selectedId === cat.id ? 'rgba(192,133,82,0.5)' : 'rgba(192,133,82,0.18)',
                  boxShadow: hovered === i ? '0 18px 40px rgba(46,24,16,0.22)' : '0 6px 20px rgba(46,24,16,0.1)',
                  transform: hovered === i ? 'translateY(-4px)' : 'translateY(0)',
                  transition: 'box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease',
                  '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none',
                    transform: 'none',
                  },
                }}
              >
                <Box
                  component="img"
                  src={imagenDe(cat)}
                  alt={cat.nombre}
                  draggable={false}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s ease',
                    transform: hovered === i ? 'scale(1.04)' : 'scale(1)',
                    '@media (prefers-reduced-motion: reduce)': {
                      transition: 'none',
                      transform: 'none',
                    },
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const placeholder = e.currentTarget.parentElement?.querySelector('svg')
                    if (placeholder) placeholder.style.display = 'block'
                  }}
                />
                <IconPhoto
                  size={32}
                  color="rgba(250,245,238,0.35)"
                  style={{
                    display: 'none',
                    position: 'absolute',
                    top: '44%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />

                {/* Degradado inferior para alto contraste del texto */}
                <Box
                  aria-hidden="true"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(20,10,5,0.9) 0%, rgba(20,10,5,0.35) 50%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Nombre + línea secundaria */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    px: { xs: 2.5, md: 3 },
                    pb: { xs: 2.5, md: 3 },
                    pt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fonts.serif,
                      fontSize: { xs: 22, md: 25 },
                      fontWeight: 400,
                      color: '#FAF5EE',
                      letterSpacing: '0.01em',
                      lineHeight: 1.15,
                    }}
                  >
                    {cat.nombre}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: { xs: 11.5, md: 12 },
                      fontWeight: 400,
                      letterSpacing: '0.02em',
                      color: 'rgba(250,245,238,0.72)',
                    }}
                  >
                    {subtituloDe(cat)}
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
                tabIndex={0}
                aria-label={`Ir a la posición ${i + 1}`}
                onClick={() => goTo(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    goTo(i)
                  }
                }}
                sx={{
                  width: i === active ? 28 : 8,
                  height: 5,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  bgcolor: i === active ? '#C08552' : isDark ? 'rgba(243,233,220,0.22)' : 'rgba(192,133,82,0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: '#C08552' },
                  '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
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