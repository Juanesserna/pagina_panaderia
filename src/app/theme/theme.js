import { createTheme } from '@mui/material/styles'
import { lightColors, darkColors, fonts } from './colors'

function buildTheme(mode) {
  const c = mode === 'dark' ? darkColors : lightColors

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: c.accent, contrastText: c.buttonText },
      secondary: { main: c.brand, contrastText: c.buttonText },
      background: { default: c.bg, paper: c.surface },
      text: { primary: c.text, secondary: c.textMuted, disabled: c.textDim },
      success: { main: c.success },
      warning: { main: c.warning },
      error: { main: c.danger, dim: c.dangerDim },
      info: { main: c.info },
      divider: c.border,
      ahSidebar: {
        main: c.sidebar,
        border: c.sidebarBorder,
        contrastText: c.textOnSidebar,
        hover: c.sidebarAccent,
      },
      ahSurface2: c.surface2,
      accentDim: c.accentDim,
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: fonts.sans,
      fontSize: 13,
      h1: { fontFamily: fonts.serif, fontWeight: 300 },
      h2: { fontFamily: fonts.serif, fontWeight: 300 },
      h3: { fontFamily: fonts.serif, fontWeight: 400 },
      h4: { fontFamily: fonts.serif, fontWeight: 400, fontSize: '1.75rem' },
      h5: { fontSize: '1.15rem' },
      h6: { fontSize: '1rem' },
      body1: { fontSize: '0.8125rem' },
      body2: { fontSize: '0.8125rem' },
      caption: { fontSize: '0.6875rem' },
      button: { textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem' },
    },
    // NOTA: antes existían dos claves `components` separadas en este mismo
    // objeto. En un literal de JS la segunda pisa completamente a la
    // primera, así que `MuiTextField` se estaba perdiendo en silencio.
    // Quedan fusionadas en un solo bloque; donde un componente estaba
    // definido en ambos bloques originales, gana la versión más específica
    // (la que venía en el segundo bloque).
    components: {
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiOutlinedInput: {
        defaultProps: {
          notched: false,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: '#F0EBE3',
            fontSize: '0.8125rem',
          },
          input: {
            borderRadius: 8,
            padding: '7.5px 10px',
          },
          notchedOutline: {
            borderRadius: 8,
            borderColor: c.border,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: { fontSize: '0.8125rem' },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: '#F0EBE3',
          },
          select: {
            borderRadius: 8,
            overflow: 'hidden',
            fontSize: '0.8125rem',
          },
          outlined: {
            borderRadius: 8,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: { fontSize: '0.8125rem', minHeight: 32 },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, textTransform: 'none', fontWeight: 600, boxShadow: 'none' },
          contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
          sizeSmall: { padding: '4px 12px', fontSize: '0.75rem', minHeight: 30 },
          sizeMedium: { padding: '6px 16px', fontSize: '0.8125rem' },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          sizeSmall: { padding: 5 },
        },
      },
MuiChip: {
        styleOverrides: {
          root: { borderRadius: 999, fontWeight: 600 },
          sizeSmall: { height: 22, fontSize: '0.6875rem' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 14 },
        },
      },
MuiPaper: {
        styleOverrides: {
          root: { borderRadius: 14 },
        },
      },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 16 } },
      },
      MuiDialogTitle: {
        styleOverrides: { root: { padding: '16px 20px' } },
      },
      MuiDialogContent: {
        styleOverrides: { root: { padding: '4px 20px 20px' } },
      },
      MuiDialogActions: {
        styleOverrides: { root: { padding: '12px 20px 20px' } },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: c.border, padding: '9px 16px', fontSize: '0.8125rem' },
          head: { padding: '10px 16px' },
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: { fontSize: '0.6875rem' },
        },
      },
    },
  })

  // Capa de compatibilidad: algunos módulos (el de theming original) leen
  // los tokens crudos como `theme.alhorno.*` en vez de `theme.palette.ah*`.
  // Se expone el mismo shape que tenía el TOKENS/buildTheme viejo, tomado
  // de los mismos colores (`c`) que ya alimentan el resto del theme, para
  // que ambas convenciones convivan sin duplicar la fuente de verdad.
  theme.alhorno = {
    bg: c.bg,
    sidebar: c.sidebar,
    surface: c.surface,
    surface2: c.surface2,
    accent: c.accent,
    text: c.text,
    textMuted: c.textMuted,
    border: c.border,
    success: c.success,
    warning: c.warning,
    danger: c.danger,
    info: c.info,
  }

  return theme
}

export const lightTheme = buildTheme('light')
export const darkTheme = buildTheme('dark')