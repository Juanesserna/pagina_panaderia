import { Typography, useTheme } from '@mui/material'

export default function HeaderLabel({ children }) {
  const theme = useTheme()
  return (
    <Typography
      component="span"
      variant="overline"
      sx={{
        color: theme.palette.text.secondary,
      }}
    >
      {children}
    </Typography>
  )
}