import AppRouter from './router/AppRouter'
import AppProviders from './providers/AppProviders'
import './App.css'

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

export default App