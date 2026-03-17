import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FranchiseCTAFloating from './components/FranchiseCTAFloating'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Locations from './pages/Locations'
import Franchise from './pages/Franchise'
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import LeadsPage from './admin/pages/LeadsPage'
import QrAndEmail from './admin/pages/QrAndEmail'
import LeadDetails from './admin/pages/LeadDetails'
import AdminLayout from './admin/components/AdminLayout'
import ProtectedRoute from './admin/components/ProtectedRoute'
import { AdminAuthProvider } from './admin/context/AdminAuthContext'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}

function AppRoutes() {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/leads"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <LeadsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/qr-email"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <QrAndEmail />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/leads/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <LeadDetails />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <>
            <ScrollToTop />
            <Navbar />
            <div className="animate-page-in mt-0 pt-0">
              <Routes>
                <Route path="/"          element={<Home />} />
                <Route path="/products"  element={<Products />} />
                <Route path="/about"     element={<About />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/franchise" element={<Franchise />} />
              </Routes>
            </div>
            <Footer />
            {/* ── FLOATING FRANCHISE CTA — visible on all public pages ── */}
            <FranchiseCTAFloating />
          </>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AppRoutes />
      </AdminAuthProvider>
    </BrowserRouter>
  )
}

export default App