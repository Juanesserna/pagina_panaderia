import { Stack } from '@mui/material'
import { Button } from '@shared/ui'
import CamposCategoria from './CamposCategoria'

export default function FormularioCategoria({ valores, onCambio, onSubmit, onCancelar, textoGuardar }) {
  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3}>
        <CamposCategoria valores={valores} onCambio={onCambio} />
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="secondary" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={!valores.nombre.trim()}>
            {textoGuardar}
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}