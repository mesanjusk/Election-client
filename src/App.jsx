import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <Routes>
      {/* Default route goes directly to dashboard */}
      <Route path="/" element={<Dashboard />} />
      {/* Redirect everything else to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
