// Paleta de colores "de marca" tomada del diseño de Figma (módulo Usuarios).
// Vive en shared/ porque la usan varios features (usuarios, header, y a futuro
// roles, productos, etc.) y shared/ nunca importa de features/, así que es
// un lugar seguro para constantes puramente visuales.

export const BRAND = {
  orange: '#C97A45',
  orangeDark: '#B8693A',
  orangeSoftBg: '#FDECE0',
  cardBorder: '#E4D9C8',
  inputBg: '#F0EBE3',
  textMuted: '#8D7B6D',
  textDark: '#3D2B1F',
  green: '#6E8B3D',
  greenBg: '#E9EEE2',
  neutralBg: '#ECE7E1',
  neutralText: '#6B6459',
}

// Paleta rotativa para los avatares con iniciales (fondo pastel + texto oscuro
// del mismo tono). Se elige una entrada según un hash simple del nombre, así
// el mismo usuario siempre obtiene el mismo color.
export const AVATAR_PALETTE = [
  { bg: '#F0E6DC', color: '#C97A45' }, // durazno
  { bg: '#BFDED4', color: '#3F7D63' }, // verde menta
  { bg: '#CEE0FD', color: '#4472C4' }, // azul
  { bg: '#E3D9F4', color: '#7A5FB0' }, // lavanda
]

export function colorFromName(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length
  return AVATAR_PALETTE[index]
}

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}