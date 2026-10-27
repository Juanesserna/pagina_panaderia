import Avatar from '@mui/material/Avatar'
import { alpha } from '@mui/material/styles'
import { colorFromName, getInitials } from '@shared/utils/colors'

/**
 * Avatar circular con las iniciales del nombre. El color de texto se calcula
 * a partir del nombre (mismo hash de siempre, así cada usuario mantiene su
 * color entre renders), pero el FONDO ya no es un pastel fijo: se calcula
 * con alpha() sobre ese mismo color, igual que los chips de estado de
 * Ventas. Así el círculo se ve bien tanto en modo claro como oscuro, en vez
 * de quedar como un parche claro sobre un fondo oscuro.
 */
export default function UserAvatar({ name, size = 40, fontSize = 14 }) {
  const { color } = colorFromName(name)

  return (
    <Avatar
      sx={{
        bgcolor: alpha(color, 0.18),
        color,
        width: size,
        height: size,
        fontSize,
        fontWeight: 600,
      }}
    >
      {getInitials(name)}
    </Avatar>
  )
}