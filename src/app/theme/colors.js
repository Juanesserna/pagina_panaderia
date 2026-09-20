// Tokens de color de la marca "Al Horno".
// Migrados desde las variables CSS (--ah-*) que venían en el export de Figma/Tailwind.
// Se usan de 2 formas en el proyecto:
//   1) Como paleta del tema de Material UI (ver theme.js) -> para el panel administrativo
//   2) Como objeto plano (lightColors / darkColors) -> para los componentes del landing,
//      que manejan su propio estado local "isDark" (igual que en el diseño original de Figma)

export const lightColors = {
  bg: '#FAF5EE',
  sidebar: '#FAF3E9',
  surface: '#FFFFFF',
  surface2: '#F0EBE3',
  accent: '#C97A45',
  accentSoft: 'rgba(201,122,69,0.5)',
  accentDim: 'rgba(201,122,69,0.2)',
  brand: '#5B3023',
  brandHover: '#4a2519',
  text: '#2E1810',
  textMuted: '#8a7a68',
  textDim: 'rgba(74,46,23,0.35)',
  border: '#e4d9c8',
  success: '#6e8b3d',
  warning: '#f2a93c',
  danger: '#c0392b',
  info: '#2e7d8c',
  buttonText: '#FFFFFF',
}

export const darkColors = {
  bg: '#1A0D07',
  sidebar: '#241811',
  surface: '#2E1810',
  surface2: '#32251f',
  accent: '#C97A45',
  accentSoft: 'rgba(201,122,69,0.5)',
  accentDim: 'rgba(201,122,69,0.15)',
  brand: '#241811',
  brandHover: '#8f4e2a',
  text: '#F3E9DC',
  textMuted: '#d4c5b3',
  textDim: 'rgba(242,233,221,0.35)',
  border: '#3d2c21',
  success: '#7fb539',
  warning: '#f2a93c',
  danger: '#d9534f',
  info: '#2e7d8c',
  buttonText: '#FFFFFF',
}

// Helper que usan todos los componentes del landing: recibe el booleano isDark
// y devuelve el set de colores correspondiente.
export function getColors(isDark) {
  return isDark ? darkColors : lightColors
}

export const fonts = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'Inter', sans-serif",
}
