import { Typography } from '@mui/material'

export default function FilterLabel({ children }) {
  return (
    <Typography
      variant="caption"
      sx={{
        fontWeight: 600,
        color: 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        display: 'block',
        mb: 0.5,
      }}
    >
      {children}
    </Typography>
  )
}

