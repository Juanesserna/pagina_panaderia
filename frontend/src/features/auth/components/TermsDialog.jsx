import { useId } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Box,
  Alert,
} from '@mui/material'
import {
  IconX,
  IconFileDescription,
  IconShieldCheck,
} from '@tabler/icons-react'
import { getColors, fonts } from '@app/theme/colors'

// Contenido provisional sujeto a revisión y aprobación.
const DOCUMENTS = {
  terms: {
    title: 'Términos y condiciones',
    icon: IconFileDescription,
    sections: [
      {
        title: '1. Uso de la plataforma',
        text: 'Al Horno es una plataforma que facilita la consulta de productos y la gestión de pedidos y compras.',
      },
      {
        title: '2. Registro de usuarios',
        text: 'El usuario debe proporcionar información veraz, completa y actualizada durante el registro.',
      },
      {
        title: '3. Seguridad de la cuenta',
        text: 'El usuario es responsable de proteger sus credenciales y comunicar cualquier acceso no autorizado a su cuenta.',
      },
      {
        title: '4. Uso responsable',
        text: 'No está permitido utilizar la plataforma para actividades fraudulentas, accesos no autorizados o acciones que afecten su funcionamiento.',
      },
      {
        title: '5. Pedidos y compras',
        text: 'Las condiciones comerciales, precios y disponibilidad de los productos deberán informarse antes de confirmar cada compra.',
      },
    ],
  },

  privacy: {
    title: 'Tratamiento de datos personales',
    icon: IconShieldCheck,
    sections: [
      {
        title: '1. Información recopilada',
        text: 'La plataforma contempla la recopilación de datos de identificación y contacto necesarios para gestionar las cuentas y los servicios solicitados.',
      },
      {
        title: '2. Finalidad del tratamiento',
        text: 'Los datos podrán utilizarse para gestionar el registro, la autenticación, los pedidos, las compras y la atención al usuario.',
      },
      {
        title: '3. Protección de la información',
        text: 'El responsable del tratamiento deberá implementar medidas de seguridad apropiadas para proteger los datos personales.',
      },
      {
        title: '4. Derechos del titular',
        text: 'El titular tiene derecho a conocer, actualizar y rectificar sus datos personales, solicitar prueba de la autorización y ejercer los demás derechos establecidos por la legislación aplicable.',
      },
      {
        title: '5. Marco normativo',
        text: 'El tratamiento de datos personales deberá ajustarse a la Ley 1581 de 2012 y demás disposiciones aplicables en Colombia.',
      },
    ],
  },
}

export default function TermsDialog({
  open,
  onClose,
  type = 'terms',
  isDark = false,
}) {
  const titleId = useId()
  const c = getColors(isDark)

  const document = DOCUMENTS[type] ?? DOCUMENTS.terms
  const Icon = document.icon

  const paperBg = isDark ? '#2A1D16' : '#FFFCF8'
  const textColor = isDark ? '#F2E9DD' : '#4A2E17'
  const mutedColor = isDark ? '#C4B5A6' : '#796655'

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      aria-labelledby={titleId}
      slotProps={{
        paper: {
          sx: {
            bgcolor: paperBg,
            color: textColor,
            borderRadius: 3,
            borderTop: `4px solid ${c.brand}`,
          },
        },
      }}
    >
      <DialogTitle
        id={titleId}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          fontFamily: fonts.sans,
          fontSize: 18,
          fontWeight: 600,
          pr: 6,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: 2,
            bgcolor: c.accentSoft,
            color: c.accent,
          }}
        >
          <Icon size={22} stroke={1.7} />
        </Box>

        {document.title}

        <IconButton
          onClick={onClose}
          aria-label="Cerrar documento"
          sx={{
            position: 'absolute',
            right: 12,
            top: 14,
            color: mutedColor,
          }}
        >
          <IconX size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Alert
          severity="info"
          sx={{ mb: 2.5, fontSize: 12 }}
        >
          Documento provisional para fines académicos.
          Pendiente de revisión y aprobación.
        </Alert>

        {document.sections.map(({ title, text }) => (
          <Box key={title} sx={{ mb: 2.5 }}>
            <Typography
              component="h3"
              sx={{
                fontFamily: fonts.sans,
                fontSize: 14,
                fontWeight: 600,
                color: textColor,
                mb: 0.75,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: 13,
                lineHeight: 1.8,
                color: mutedColor,
              }}
            >
              {text}
            </Typography>
          </Box>
        ))}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            color: mutedColor,
            borderColor: mutedColor,
            fontFamily: fonts.sans,
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}