import { Typography } from '@mui/material'

// Etiqueta pequeña sobre un campo. Candidato a mover a @shared/ui.
export default function FilterLabel({ children }) {
  return (
    <Typography variant="overline" component="div" sx={{ mb: 0.5 }}>
      {children}
    </Typography>
  )
}
