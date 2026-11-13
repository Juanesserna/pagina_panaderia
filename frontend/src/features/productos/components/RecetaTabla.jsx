import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import { IconPlus } from '@tabler/icons-react'
// Botón estándar del panel
import { Button } from '@shared/ui'
// Hook con la lógica de la tabla de receta
import useRecetaTabla from './receta/useRecetaTabla'
// Estilos compartidos de las celdas
import { HEADER_SX, CELL_SX } from './comunes/tablaEstilos'
// Etiqueta del encabezado de la tabla
import HeaderLabel from './comunes/HeaderLabel'
// Fila de solo lectura de un insumo
import InsumoRow from './receta/InsumoRow'
// Fila editable para agregar o editar un insumo
import EditableRow from './receta/EditableRow'

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
  // Toda la lógica (estados, catálogos y handlers) vive en el hook
  const {
    agregandoFila,
    editandoFilaId,
    nuevaFila,
    filaEditando,
    insumosCatalogo,
    unidadesMedida,
    insumosUsados,
    loading,
    handleAgregarClick,
    handleEditarClick,
    handleChange,
    handleConfirmar,
    handleCancelar,
  } = useRecetaTabla({ insumos, onAgregarInsumo, onEditInsumo, codigoProducto })

  // Props comunes de la fila editable (sea nueva o de edición)
  const propsFilaEditable = {
    onChange: handleChange,
    onConfirm: handleConfirmar,
    onCancel: handleCancelar,
    insumosCatalogo,
    unidadesMedida,
    insumosUsados,
    loading,
    showActions,
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
            <Typography variant="h5" component="p" sx={{ mb: 0.5 }}>
              Receta del Producto
            </Typography>
            <Typography variant="body1" component="p" sx={{ color: theme.palette.text.secondary }}>
              Insumos necesarios para la elaboración de este producto
            </Typography>
          </Box>
          <Button leftIcon={<IconPlus size={16} />} onClick={handleAgregarClick}>
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
              <TableCell sx={HEADER_SX} style={{ width: 140 }}>
                <HeaderLabel>UNIDAD DE MEDIDA</HeaderLabel>
              </TableCell>
              <TableCell sx={{ ...HEADER_SX, textAlign: 'right' }} style={{ width: 100 }}>
                <HeaderLabel>CANTIDAD</HeaderLabel>
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
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                    Aún no se han agregado insumos a la receta.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {insumos.map((i) =>
                  editandoFilaId === i.id ? (
                    <EditableRow key={i.id} fila={filaEditando} isNew={false} {...propsFilaEditable} />
                  ) : (
                    <InsumoRow
                      key={i.id}
                      insumo={i}
                      onEdit={handleEditarClick}
                      onDelete={onDeleteInsumo}
                      showActions={showActions}
                    />
                  )
                )}
                {agregandoFila && <EditableRow fila={nuevaFila} isNew {...propsFilaEditable} />}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
