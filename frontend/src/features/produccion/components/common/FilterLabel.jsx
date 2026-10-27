import { Typography } from '@mui/material'

export default function FilterLabel({ children }) {
  return (
    <Typography variant="overline" component="div" sx={{ mb: 0.5 }}>
      {children}
    </Typography>
  )
}
