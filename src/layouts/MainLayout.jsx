import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: (theme) => theme.alhorno.bg }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header />
        <Box component="main" sx={{ flex: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
