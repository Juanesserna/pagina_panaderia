import { createApp } from './app.js'
const port = process.env.PORT ?? 3000
createApp().listen(port, () => console.log(`API Al Horno en http://localhost:${port}`))
