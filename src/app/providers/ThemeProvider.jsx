import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { lightTheme, darkTheme } from '@app/theme/theme'

// Valor por defecto del contexto. Se exponen los dos nombres de "toggle"
// (toggleMode y toggleColorMode) para no romper ningún módulo que ya
// dependa de uno u otro.
const ColorModeContext = createContext({
  mode: 'light',
  toggleMode: () => { },
  toggleColorMode: () => { },
})

export function useColorMode() {
  return useContext(ColorModeContext)
}

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('ah-theme-mode') || 'light'
  })

  useEffect(() => {
    localStorage.setItem('ah-theme-mode', mode)
  }, [mode])

  useEffect(() => {
  const favicon = document.querySelector('link[rel="icon"]')

  if (favicon) {
    favicon.href = mode === 'dark' ? '/logo_oscuro.png' : '/logo_claro.png'
  }
  }, [mode])

  const toggle = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))

  const value = useMemo(
    () => ({
      mode,
      toggleMode: toggle,
      toggleColorMode: toggle, // alias de compatibilidad
    }),
    [mode]
  )

  const theme = mode === 'dark' ? darkTheme : lightTheme

  return (
    <ColorModeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  )
}
