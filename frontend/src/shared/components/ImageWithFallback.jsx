import { useState } from 'react'

const FALLBACK_SRC =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88"%3E%3Crect width="88" height="88" fill="%23f0ebe3"/%3E%3Ctext x="50%25" y="50%25" font-size="11" fill="%238a7a68" text-anchor="middle" dominant-baseline="middle"%3EImagen%3C/text%3E%3C/svg%3E'

/**
 * Igual que un <img> normal, pero si la imagen falla en cargar (link roto,
 * archivo faltante, etc), muestra un placeholder en vez de romper el layout.
 */
export function ImageWithFallback({ src, alt, style, ...rest }) {
  const [error, setError] = useState(false)

  return (
    <img
      src={error ? FALLBACK_SRC : src}
      alt={alt}
      style={style}
      onError={() => setError(true)}
      {...rest}
    />
  )
}
