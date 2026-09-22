import { createTheme } from '@mui/material/styles'
import { lightColors, darkColors, fonts } from './colors'

function buildTheme(mode) {
  const c = mode === 'dark' ? darkColors : lightColors

  return createTheme({
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
    components: {
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
      MuiCard: { styleOverrides: { root: { borderRadius: 14 } } },
      MuiPaper: { styleOverrides: { root: { borderRadius: 14 } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: 16 } } },
      MuiDialogTitle: { styleOverrides: { root: { padding: '16px 20px' } } },
      MuiDialogContent: { styleOverrides: { root: { padding: '4px 20px 20px' } } },
      MuiDialogActions: { styleOverrides: { root: { padding: '12px 20px 20px' } } },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 999, fontWeight: 600 },
          sizeSmall: { height: 22, fontSize: '0.6875rem' },
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
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: { fontSize: '0.8125rem' },
        },
      },
      MuiSelect: {
        defaultProps: {
          notched: false,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: '#F0EBE3',
            overflow: 'hidden',
          },
          select: {
            fontSize: '0.8125rem',
            backgroundColor: '#F0EBE3',
            borderRadius: 8,
            overflow: 'hidden',
          },
          outlined: {
            backgroundColor: '#F0EBE3',
            borderRadius: 8,
            overflow: 'hidden',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: { fontSize: '0.8125rem', minHeight: 32 },
        },
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
}

export const lightTheme = buildTheme('light')
export const darkTheme = buildTheme('dark')