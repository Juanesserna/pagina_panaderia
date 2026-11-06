// Mapeo de estados entre la API (mayúsculas) y el frontend (título case).
// La API devuelve/recibe: 'ACTIVO' | 'INACTIVO' | 'AGOTADO'
// El frontend muestra/usa: 'Activo' | 'Inactivo' | 'Agotado'

export function estadoDesdeApi(estadoApi) {
  const mapa = {
    ACTIVO: 'Activo',
    INACTIVO: 'Inactivo',
    AGOTADO: 'Agotado',
  };
  return mapa[estadoApi] || estadoApi;
}

export function estadoHaciaApi(estado) {
  const mapa = {
    Activo: 'ACTIVO',
    Inactivo: 'INACTIVO',
    Agotado: 'AGOTADO',
  };
  return mapa[estado] || estado;
}
