import { createContext, useContext, useMemo, useState } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { lightTheme, darkTheme } from '../theme/theme'

// Contexto para que cualquier componente del panel administrativo pueda
// leer el modo actual o cambiarlo (ej: un switch en el Header).
const ColorModeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
})

export function useColorMode() {
  return useContext(ColorModeContext)
}

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light')

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
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
