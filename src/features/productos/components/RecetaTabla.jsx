import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  IconButton,
  useTheme,
} from '@mui/material'
import { IconCirclePlus, IconCheck, IconX, IconPencil, IconTrash } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import { fetchInsumos, getUnidadesMedida } from '@features/insumos'

const HEADER_SX = {
  padding: '12px 16px',
  backgroundColor: 'transparent',
  borderBottom: 'none',
}

const CELL_SX = {
  padding: '12px 16px',
}

function HeaderLabel({ children }) {
  const theme = useTheme()
  return (
    <Typography
      component="span"
      sx={{
        fontFamily: fonts.sans,
        fontSize: 11,
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: theme.palette.text.secondary,
      }}
    >
      {children}
    </Typography>
  )
}

function InsumoRow({ insumo, onEdit, onDelete, showActions }) {
  const theme = useTheme()
  return (
    <TableRow sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}>
      <TableCell sx={CELL_SX}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary }}>
          {insumo.idProducto}
        </Typography>
      </TableCell>
      <TableCell sx={CELL_SX}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary }}>
          {`${insumo.idInsumo} / ${insumo.insumo}`}
        </Typography>
      </TableCell>
      <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary }}>
          {insumo.cantidad}
        </Typography>
      </TableCell>
      <TableCell sx={CELL_SX}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary }}>
          {insumo.unidad}
        </Typography>
      </TableCell>
      {showActions && (
        <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
            <Button
              size="small"
              onClick={() => onEdit?.(insumo)}
              sx={{
                color: theme.palette.text.secondary,
                width: 28,
                height: 28,
                minWidth: 28,
              }}
            >
              <IconPencil size={15} />
            </Button>
            <Button
              size="small"
              onClick={() => onDelete?.(insumo.id)}
              sx={{
                color: theme.palette.error.main,
                width: 28,
                height: 28,
                minWidth: 28,
              }}
            >
              <IconTrash size={15} />
            </Button>
          </Box>
        </TableCell>
      )}
    </TableRow>
  )
}

function EditableRow({
  fila,
  onChange,
  onConfirm,
  onCancel,
  insumosCatalogo,
  unidadesMedida,
  codigoProducto,
  loading,
  showActions,
  isNew,
}) {
  const theme = useTheme()

  const handleInsumoChange = (event, value) => {
    const valorReal = value && typeof value === 'object' && 'props' in value
      ? value.props.value
      : value
    const insumoId = String(valorReal)
    const insumoSeleccionado = insumosCatalogo.find((i) => String(i.id) === insumoId)
    if (insumoSeleccionado) {
      onChange('insumoId', insumoSeleccionado.id)
      onChange('insumoNombre', insumoSeleccionado.nombre)
      if (insumoSeleccionado.idUnidadMedida) {
        const unidad = unidadesMedida.find((u) => u.id === insumoSeleccionado.idUnidadMedida)
        if (unidad) {
          onChange('unidadId', String(unidad.id))
          onChange('unidadNombre', unidad.abreviatura)
        }
      }
    } else {
      onChange('insumoId', '')
      onChange('insumoNombre', '')
    }
  }

  const handleUnidadChange = (event, value) => {
    const valorReal = value && typeof value === 'object' && 'props' in value
      ? value.props.value
      : value
    const unidadId = String(valorReal)
    const unidad = unidadesMedida.find((u) => String(u.id) === unidadId)
    if (unidad) {
      onChange('unidadId', String(unidad.id))
      onChange('unidadNombre', unidad.abreviatura)
    }
  }

  const handleCantidadChange = (e) => {
    const value = e.target.value
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      onChange('cantidad', value)
    }
  }

  const isValid = fila.insumoId && Number(fila.cantidad) > 0

  return (
    <TableRow sx={{ backgroundColor: theme.palette.background.paper }}>
      <TableCell sx={CELL_SX}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary, fontWeight: 500 }}>
          {isNew ? (fila.idTemp || 'NUEVO') : fila.id}
        </Typography>
      </TableCell>
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
            <MenuItem value="" disabled>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.secondary }}>
                Seleccionar insumo
              </Typography>
            </MenuItem>
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
            <MenuItem value="" disabled>
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.secondary }}>
                Unidad
              </Typography>
            </MenuItem>
            {unidadesMedida.map((unidad) => (
              <MenuItem key={unidad.id} value={String(unidad.id)}>
                {unidad.nombre} ({unidad.abreviatura})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>
      {showActions && (
        <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
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

export default function RecetaTabla({
  insumos = [],
  onAgregarInsumo,
  onEditInsumo,
  onDeleteInsumo,
  mostrarEncabezado = true,
  showActions = true,
  codigoProducto,
}) {
  const theme = useTheme()
  const [agregandoFila, setAgregandoFila] = useState(false)
  const [editandoFilaId, setEditandoFilaId] = useState(null)
  const [nuevaFila, setNuevaFila] = useState({
    idTemp: null,
    insumoId: '',
    insumoNombre: '',
    cantidad: 0,
    unidadId: '',
    unidadNombre: '',
  })
  const [filaEditando, setFilaEditando] = useState(null)
  const [insumosCatalogo, setInsumosCatalogo] = useState([])
  const [unidadesMedida, setUnidadesMedida] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [insumosData, unidadesData] = await Promise.all([
          fetchInsumos(),
          Promise.resolve(getUnidadesMedida()),
        ])
        setInsumosCatalogo(insumosData)
        setUnidadesMedida(unidadesData)
      } catch (error) {
        console.error('Error cargando catálogos:', error)
      } finally {
        setLoading(false)
      }
    }
    cargarCatalogos()
  }, [])

  const handleAgregarClick = () => {
    setNuevaFila({
      idTemp: Date.now(),
      insumoId: '',
      insumoNombre: '',
      cantidad: 0,
      unidadId: '',
      unidadNombre: '',
    })
    setAgregandoFila(true)
  }

  const handleEditarClick = (insumo) => {
    const insumoSeleccionado = insumosCatalogo.find((i) => i.id === insumo.idInsumo)
    const unidad = insumoSeleccionado ? unidadesMedida.find((u) => u.abreviatura === insumo.unidad) : null

    setFilaEditando({
      id: insumo.id,
      idTemp: insumo.id,
      insumoId: insumo.idInsumo,
      insumoNombre: insumo.insumo,
      cantidad: insumo.cantidad,
      unidadId: unidad?.id || '',
      unidadNombre: insumo.unidad,
    })
    setEditandoFilaId(insumo.id)
  }

  const handleChange = (campo, valor) => {
    if (editandoFilaId !== null) {
      setFilaEditando((prev) => ({ ...prev, [campo]: valor }))
    } else {
      setNuevaFila((prev) => ({ ...prev, [campo]: valor }))
    }
  }

  const handleConfirmar = () => {
    const fila = editandoFilaId !== null ? filaEditando : nuevaFila

    if (!fila.insumoId || Number(fila.cantidad) <= 0) return

    if (editandoFilaId !== null) {
      const datosActualizados = {
        idInsumo: fila.insumoId,
        insumo: fila.insumoNombre,
        cantidad: Number(fila.cantidad),
        unidad: fila.unidadNombre,
      }
      if (onEditInsumo) {
        onEditInsumo(editandoFilaId, datosActualizados)
      }
      setEditandoFilaId(null)
      setFilaEditando(null)
    } else {
      const filaFinal = {
        id: fila.idTemp,
        idProducto: codigoProducto,
        idInsumo: fila.insumoId,
        insumo: fila.insumoNombre,
        cantidad: Number(fila.cantidad),
        unidad: fila.unidadNombre,
      }

      if (onAgregarInsumo) {
        onAgregarInsumo(filaFinal)
      }
      setAgregandoFila(false)
    }
  }

  const handleCancelar = () => {
    if (editandoFilaId !== null) {
      setEditandoFilaId(null)
      setFilaEditando(null)
    } else {
      setAgregandoFila(false)
    }
  }

  return (
    <>
      {mostrarEncabezado && (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 20,
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            Receta del Producto
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 13,
              color: theme.palette.text.secondary,
            }}
          >
            Insumos necesarios para la elaboración de este producto
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<IconCirclePlus size={16} />}
          onClick={handleAgregarClick}
          sx={{
            textTransform: 'none',
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 2,
            px: 2.5,
            py: 1,
            flexShrink: 0,
          }}
        >
          Agregar insumo
        </Button>
      </Box>
      )}

      <TableContainer
        sx={{
          borderRadius: 2,
          '& .MuiTableCell-root': {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.ahSurface2 }}>
              <TableCell sx={HEADER_SX} style={{ width: 120 }}>
                <HeaderLabel>ID PRODUCTO</HeaderLabel>
              </TableCell>
              <TableCell sx={HEADER_SX} style={{ width: 160 }}>
                <HeaderLabel>ID INSUMO / INSUMO</HeaderLabel>
              </TableCell>
              <TableCell sx={{ ...HEADER_SX, textAlign: 'right' }} style={{ width: 100 }}>
                <HeaderLabel>CANTIDAD</HeaderLabel>
              </TableCell>
              <TableCell sx={HEADER_SX} style={{ width: 140 }}>
                <HeaderLabel>UNIDAD DE MEDIDA</HeaderLabel>
              </TableCell>
              {showActions && (
                <TableCell sx={{ ...HEADER_SX, textAlign: 'right' }} style={{ width: 100 }}>
                  <HeaderLabel>ACCIONES</HeaderLabel>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {insumos.length === 0 && !agregandoFila && editandoFilaId === null ? (
              <TableRow>
                <TableCell colSpan={showActions ? 5 : 4} align="center" sx={{ ...CELL_SX, py: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: 13,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Aún no se han agregado insumos a la receta.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {insumos.map((i) => (
                  editandoFilaId === i.id ? (
                    <EditableRow
                      key={i.id}
                      fila={filaEditando}
                      onChange={handleChange}
                      onConfirm={handleConfirmar}
                      onCancel={handleCancelar}
                      insumosCatalogo={insumosCatalogo}
                      unidadesMedida={unidadesMedida}
                      codigoProducto={codigoProducto}
                      loading={loading}
                      showActions={showActions}
                      isNew={false}
                    />
                  ) : (
                    <InsumoRow
                      key={i.id}
                      insumo={i}
                      onEdit={handleEditarClick}
                      onDelete={onDeleteInsumo}
                      showActions={showActions}
                    />
                  )
                ))}
                {agregandoFila && (
                  <EditableRow
                    fila={nuevaFila}
                    onChange={handleChange}
                    onConfirm={handleConfirmar}
                    onCancel={handleCancelar}
                    insumosCatalogo={insumosCatalogo}
                    unidadesMedida={unidadesMedida}
                    codigoProducto={codigoProducto}
                    loading={loading}
                    showActions={showActions}
                    isNew={true}
                  />
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}