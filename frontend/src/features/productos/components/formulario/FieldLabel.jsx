import { Box, Typography, FormHelperText, useTheme } from '@mui/material'

export default function FieldLabel({ children, required, helperText }) {
  const theme = useTheme()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
      <Typography
        component="label"
        variant="overline"
        sx={{
          color: required ? theme.palette.secondary.main : theme.palette.text.secondary,
        }}
      >
        {children}
        {required && (
          <Box component="span" sx={{ color: theme.palette.error.main, ml: 0.25 }}>
            *
          </Box>
        )}
      </Typography>
      {helperText && (
        <FormHelperText variant="caption" sx={{ color: theme.palette.text.secondary }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  )
}