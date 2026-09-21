import { useState, useMemo, useEffect, createContext, useContext } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// Tokens tal cual vienen de theme.css (Figma), :root = light, .dark = dark.
const TOKENS = {
  light: {
    bg: '#ffffff',
    sidebar: '#faf3e9',
    surface: '#ffffff',
    surface2: '#f0ebe3',
    accent: '#c97a45',
    text: '#4a2e17',
    textMuted: '#8a7a68',
    border: '#e4d9c8',
    success: '#6e8b3d',
    warning: '#f2a93c',
    danger: '#c0392b',
    info: '#2e7d8c',
  },
  dark: {
    bg: '#17110d',
    sidebar: '#241811',
    surface: '#2a1d16',
    surface2: '#32251f',
    accent: '#a85d33',
    text: '#f2e9dd',
    textMuted: '#d4c5b3',
    border: '#3d2c21',
    success: '#7fb539',
    warning: '#f2a93c',
    danger: '#d9534f',
    info: '#2e7d8c',
  },
}

// Contexto para que Header (u otro componente) pueda alternar el modo.
const ColorModeContext = createContext({ mode: 'light', toggleColorMode: () => { } })
export const useColorMode = () => useContext(ColorModeContext)

function buildTheme(mode) {
  const t = TOKENS[mode]

  return createTheme({
    palette: {
      mode,
      primary: { main: t.accent, contrastText: '#ffffff' },
      secondary: { main: t.surface2, contrastText: t.text },
      success: { main: t.success },
      warning: { main: t.warning },
      error: { main: t.danger },
      info: { main: t.info },
      background: { default: t.bg, paper: t.surface },
      text: { primary: t.text, secondary: t.textMuted, dim: t.textMuted },
      divider: t.border,
    },
    shape: { borderRadius: 8 },
    typography: { fontFamily: '"Inter", sans-serif' },
    // Namespace propio con los tokens crudos, para que Sidebar/Header
    // puedan usar theme.alhorno.sidebar, etc, sin reinventar colores.
    alhorno: t,
    components: {
      MuiCard: {
        styleOverrides: {
          root: { backgroundColor: t.surface, borderColor: t.border },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 500, borderRadius: 8 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500 },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: t.surface2,
            borderRadius: 8,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: t.border },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: t.accent },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  })
}

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('ah-theme-mode') || 'light'
  })

  useEffect(() => {
    localStorage.setItem('ah-theme-mode', mode)
  }, [mode])

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    }),
    [mode]
  )

  const theme = useMemo(() => buildTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  )
}
