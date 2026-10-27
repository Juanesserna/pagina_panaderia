export const lightColors = {
  bg: '#fdfdfd',
  sidebar: '#FAF3E9',
  sidebarBorder: '#e4d9c8',
  textOnSidebar: '#2E1810',
  sidebarAccent: 'rgba(192,133,82,0.15)',
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
  dangerDim: 'rgba(192,57,43,0.12)',
  info: '#2e7d8c',
  buttonText: '#FFFFFF',
}

export const darkColors = {
  bg: '#17110D',
  sidebar: '#241811',
  sidebarBorder: '#3d2c21',
  textOnSidebar: '#F3E9DC',
  sidebarAccent: 'rgba(168,93,51,0.15)',
  surface: '#2A1D16',
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
  dangerDim: 'rgba(217,83,79,0.15)',
  info: '#2e7d8c',
  buttonText: '#FFFFFF',
}

export function getColors(isDark) {
  return isDark ? darkColors : lightColors
}

export const fonts = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'Inter', sans-serif",
}