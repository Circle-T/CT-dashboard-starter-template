import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "@/components/layout/AppLayout"
import Dashboard from "@/pages/Dashboard"
import Analytics from "@/pages/Analytics"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          {/* Catch-all: redirect unknown paths to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
