export const inputSx = (theme) => ({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
  '&:hover fieldset': {
    borderColor: theme.palette.divider,
  },
  '&.Mui-focused fieldset': {
    borderColor: theme.palette.primary.main,
  },
})

export const imagePreviewSx = (theme) => ({
  width: 72,
  height: 72,
  borderRadius: 2,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.action.hover,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  overflow: 'hidden',
})