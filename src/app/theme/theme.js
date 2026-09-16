import { createTheme } from '@mui/material/styles'
import { lightColors, darkColors, fonts } from './colors'

// Este theme.js es el que usa Material UI para el PANEL ADMINISTRATIVO
// (dashboard, ventas, productos, etc). El landing usa los colores "planos"
// de colors.js directamente, para no tener que reescribir toda su lógica de isDark.

function buildTheme(mode) {
  const c = mode === 'dark' ? darkColors : lightColors

  return createTheme({
    palette: {
      mode,
      primary: {
        main: c.accent,
        contrastText: c.buttonText,
      },
      secondary: {
        main: c.brand,
        contrastText: c.buttonText,
      },
      background: {
        default: c.bg,
        paper: c.surface,
      },
      text: {
        primary: c.text,
        secondary: c.textMuted,
      },
      success: { main: c.success },
      warning: { main: c.warning },
      error: { main: c.danger },
      info: { main: c.info },
      divider: c.border,
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontFamily: fonts.sans,
      h1: { fontFamily: fonts.serif, fontWeight: 300 },
      h2: { fontFamily: fonts.serif, fontWeight: 300 },
      h3: { fontFamily: fonts.serif, fontWeight: 400 },
      h4: { fontFamily: fonts.serif, fontWeight: 400 },
      button: { textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 },
    },
  })
}

export const lightTheme = buildTheme('light')
export const darkTheme = buildTheme('dark')
