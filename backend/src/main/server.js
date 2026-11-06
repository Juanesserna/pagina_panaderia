import 'dotenv/config'
import { createApp } from './app.js'

const port = process.env.PORT || 3000
const app = await createApp()

app.listen(port, () => {
  console.log(`🚀 Servidor AL HORNO ejecutándose en http://localhost:${port}`)
  console.log(`📡 Endpoint de prueba DB: http://localhost:${port}/api/test-db`)
})
