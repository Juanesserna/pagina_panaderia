import { Box, Stack, Typography, useTheme } from '@mui/material'
import { IconPhoto } from '@tabler/icons-react'
import { Input, Select } from '@shared/ui'
import { TIPOS_CATEGORIA, ESTADOS_CATEGORIA } from '../comunes/opcionesCategoria'
import { imagePreviewSx } from './estilos'

const aOpciones = (lista) => lista.map((valor) => ({ value: valor, label: valor }))
const OPCIONES_TIPO = aOpciones(TIPOS_CATEGORIA)
const OPCIONES_ESTADO = aOpciones(ESTADOS_CATEGORIA)

function Campo({ etiqueta, helperText, error, children }) {
  const theme = useTheme()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography component="label" variant="overline" sx={{ color: theme.palette.text.secondary }}>
        {etiqueta}
      </Typography>
      {error ? (
        <Typography variant="caption" sx={{ color: theme.palette.error.main, mb: 0.5 }}>
          {error}
        </Typography>
      ) : helperText && (
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
          {helperText}
        </Typography>
      )}
      {children}
    </Box>
  )
}

export default function CamposCategoria({ valores, onCambio, errorUrl, onTocarUrl }) {
  const theme = useTheme()
  return (
    <Stack spacing={3}>
      <Campo etiqueta="NOMBRE">
        <Input
          placeholder="ej. Repostería"
          value={valores.nombre}
          onChange={(e) => onCambio('nombre', e.target.value)}
        />
      </Campo>
      <Campo etiqueta="TIPO DE CATEGORÍA">
        <Select
          options={OPCIONES_TIPO}
          value={valores.tipo}
          onChange={(e) => onCambio('tipo', e.target.value)}
        />
      </Campo>
      <Campo etiqueta="ESTADO">
        <Select
          options={OPCIONES_ESTADO}
          value={valores.estado}
          onChange={(e) => onCambio('estado', e.target.value)}
        />
      </Campo>
      <Campo etiqueta="URL DE IMAGEN" error={errorUrl ? 'Ingrese una URL válida' : undefined}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Input
            placeholder="https://ejemplo.com/imagen.jpg"
            value={valores.urlImagen}
            onChange={(e) => onCambio('urlImagen', e.target.value)}
            onBlur={onTocarUrl}
          />
          <Box sx={imagePreviewSx(theme)}>
            {valores.urlImagen ? (
              <Box
                component="img"
                src={valores.urlImagen}
                alt="preview"
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement.querySelector('svg').style.display = 'block'
                }}
              />
            ) : null}
            <IconPhoto
              size={24}
              color={theme.palette.text.secondary}
              style={{ display: valores.urlImagen ? 'none' : 'block' }}
            />
          </Box>
        </Box>
      </Campo>
    </Stack>
  )
}
