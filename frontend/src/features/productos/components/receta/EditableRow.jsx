// Importa los componentes de MUI que usa la fila editable
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
// Importa los iconos de confirmar y cancelar
import { IconCheck, IconX } from '@tabler/icons-react'
// Importa la fuente definida en el tema de la app
import { fonts } from '@app/theme/colors'
// Importa el estilo compartido de las celdas
import { CELL_SX } from '../comunes/tablaEstilos'

// Fila editable: sirve para agregar un insumo nuevo o editar uno existente
export default function EditableRow({
  fila,
  onChange,
  onConfirm,
  onCancel,
  insumosCatalogo,
  unidadesMedida,
  loading,
  showActions,
  isNew,
}) {
  // Obtiene el tema actual (claro u oscuro)
  const theme = useTheme()

  // Se ejecuta cuando el usuario elige un insumo en el selector
  const handleInsumoChange = (event, value) => {
    // MUI entrega el elemento hijo; si es así, toma su valor real
    const valorReal = value && typeof value === 'object' && 'props' in value
      ? value.props.value
      : value
    // Convierte el valor a texto para compararlo
    const insumoId = String(valorReal)
    // Busca el insumo elegido dentro del catálogo
    const insumoSeleccionado = insumosCatalogo.find((i) => String(i.id) === insumoId)
    // Si el insumo existe en el catálogo
    if (insumoSeleccionado) {
      // Guarda el id del insumo en la fila
      onChange('insumoId', insumoSeleccionado.id)
      // Guarda el nombre del insumo en la fila
      onChange('insumoNombre', insumoSeleccionado.nombre)
      // Si el insumo trae una unidad de medida por defecto
      if (insumoSeleccionado.idUnidadMedida) {
        // Busca esa unidad en la lista de unidades
        const unidad = unidadesMedida.find((u) => u.id === insumoSeleccionado.idUnidadMedida)
        // Si la unidad existe
        if (unidad) {
          // Autocompleta el id de la unidad
          onChange('unidadId', String(unidad.id))
          // Autocompleta la abreviatura de la unidad
          onChange('unidadNombre', unidad.abreviatura)
        }
      }
    } else {
      // Si no hay insumo válido, limpia el id
      onChange('insumoId', '')
      // Y limpia el nombre
      onChange('insumoNombre', '')
    }
  }

  // Se ejecuta cuando el usuario elige una unidad de medida
  const handleUnidadChange = (event, value) => {
    // MUI entrega el elemento hijo; si es así, toma su valor real
    const valorReal = value && typeof value === 'object' && 'props' in value
      ? value.props.value
      : value
    // Convierte el valor a texto para compararlo
    const unidadId = String(valorReal)
    // Busca la unidad elegida en la lista
    const unidad = unidadesMedida.find((u) => String(u.id) === unidadId)
    // Si la unidad existe
    if (unidad) {
      // Guarda el id de la unidad en la fila
      onChange('unidadId', String(unidad.id))
      // Guarda la abreviatura de la unidad en la fila
      onChange('unidadNombre', unidad.abreviatura)
    }
  }

  // Se ejecuta cuando el usuario escribe la cantidad
  const handleCantidadChange = (e) => {
    // Toma el texto escrito
    const value = e.target.value
    // Solo acepta vacío o un número válido
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      // Guarda la cantidad en la fila
      onChange('cantidad', value)
    }
  }

  // La fila es válida si hay insumo elegido y la cantidad es mayor que cero
  const isValid = fila.insumoId && Number(fila.cantidad) > 0

  return (
    // Fila con el color de fondo del papel del tema
    <TableRow sx={{ backgroundColor: theme.palette.background.paper }}>
      {/* Columna: id del producto (o NUEVO si es fila nueva sin id) */}
      <TableCell sx={CELL_SX}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary, fontWeight: 500 }}>
          {isNew ? (fila.idTemp || 'NUEVO') : fila.id}
        </Typography>
      </TableCell>
      {/* Columna: selector de insumo */}
      <TableCell sx={CELL_SX}>
        <FormControl
          fullWidth
          size="small"
          variant="outlined"
          sx={{ minWidth: 200 }}
        >
          <Select
            value={String(fila.insumoId || '')}
            onChange={handleInsumoChange}
            displayEmpty
            disabled={loading}
            sx={{
              '& .MuiInputBase-input': {
                fontFamily: fonts.sans,
                fontSize: 13,
              },
            }}
          >
            {/* Opción vacía que sirve de texto guía */}
            <MenuItem value="" disabled>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.secondary }}>
                Seleccionar insumo
              </Typography>
            </MenuItem>
            {/* Mientras carga muestra "Cargando...", luego la lista de insumos */}
            {loading ? (
              <MenuItem disabled>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.secondary }}>
                  Cargando...
                </Typography>
              </MenuItem>
            ) : (
              insumosCatalogo.map((insumo) => (
                <MenuItem key={insumo.id} value={String(insumo.id)}>
                  {insumo.nombre}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </TableCell>
      {/* Columna: cantidad alineada a la derecha */}
      <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
        <TextField
          size="small"
          type="number"
          value={fila.cantidad || ''}
          onChange={handleCantidadChange}
          variant="outlined"
          inputProps={{ inputMode: 'decimal', min: 0.01, step: '0.01' }}
          sx={{
            width: '100%',
            '& .MuiInputBase-input': {
              fontFamily: fonts.sans,
              fontSize: 13,
              textAlign: 'right',
            },
          }}
        />
      </TableCell>
      {/* Columna: selector de unidad de medida */}
      <TableCell sx={CELL_SX}>
        <FormControl
          fullWidth
          size="small"
          variant="outlined"
          sx={{ minWidth: 120 }}
        >
          <Select
            value={String(fila.unidadId || '')}
            onChange={handleUnidadChange}
            displayEmpty
            disabled={loading}
            sx={{
              '& .MuiInputBase-input': {
                fontFamily: fonts.sans,
                fontSize: 13,
              },
            }}
          >
            {/* Opción vacía que sirve de texto guía */}
            <MenuItem value="" disabled>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.secondary }}>
                Unidad
              </Typography>
            </MenuItem>
            {/* Lista de unidades de medida disponibles */}
            {unidadesMedida.map((unidad) => (
              <MenuItem key={unidad.id} value={String(unidad.id)}>
                {unidad.nombre} ({unidad.abreviatura})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>
      {/* Columna de acciones, solo si showActions es true */}
      {showActions && (
        <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
          {/* Contenedor de los botones de confirmar y cancelar */}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
            {/* Botón confirmar: deshabilitado si la fila no es válida o está cargando */}
            <IconButton
              size="small"
              onClick={onConfirm}
              disabled={!isValid || loading}
              sx={{
                color: theme.palette.success.main,
                '&:hover': { bgcolor: theme.palette.success.light },
              }}
              aria-label={isNew ? 'Agregar' : 'Confirmar'}
            >
              <IconCheck size={18} />
            </IconButton>
            {/* Botón cancelar */}
            <IconButton
              size="small"
              onClick={onCancel}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': { bgcolor: theme.palette.action.hover },
              }}
              aria-label="Cancelar"
            >
              <IconX size={18} />
            </IconButton>
          </Box>
        </TableCell>
      )}
    </TableRow>
  )
}
