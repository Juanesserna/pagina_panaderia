// Estilos compartidos de la tabla de categorías (conserva los bordes entre filas)
export const TABLE_BORDER_SX = {
  borderBottom: '1px solid',
  borderColor: 'divider',
}

// Celdas del encabezado
export const HEADER_SX = {
  padding: '12px 16px',
  backgroundColor: 'transparent',
  ...TABLE_BORDER_SX,
}

// Celdas del cuerpo
export const CELL_SX = {
  padding: '12px 16px',
  ...TABLE_BORDER_SX,
}

// Celda del mensaje cuando no hay resultados
export const EMPTY_STATE_SX = {
  ...CELL_SX,
  py: 5,
  textAlign: 'center',
}