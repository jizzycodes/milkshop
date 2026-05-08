import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Locations from './pages/Locations'
import Franchise from './pages/Franchise'
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import LeadsPage from './admin/pages/LeadsPage'
import QrAndEmail from './admin/pages/QrAndEmail'
import AccountSettings from './admin/pages/AccountSettings'
import Monitor from './admin/pages/Monitor'
import LeadDetails from './admin/pages/LeadDetails'
import AdminLayout from './admin/components/AdminLayout'
import ProtectedRoute from './admin/components/ProtectedRoute'
import { AdminAuthProvider } from './admin/context/AdminAuthContext'
import TrackingBootstrap from './tracking/TrackingBootstrap'
import RouteLoader from './components/RouteLoader'
import FranchiseCTAFloating from './components/FranchiseCTAFloating'
import './App.css'

// Preload loader assets so they're cached before RouteLoader mounts
const PRELOAD_ASSETS = ['/milkshop-mark.png']

function PreloadAssets() {
  useEffect(() => {
    PRELOAD_ASSETS.forEach((href) => {
      if (document.querySelector(`link[rel="preload"][href="${href}"]`)) return
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = href
      document.head.appendChild(link)
    })
  }, [])
  return null
}

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
    <>
      <RouteLoader />
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
        path="/admin/account-settings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AccountSettings />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/monitor"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Monitor />
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
            <TrackingBootstrap />
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
            <FranchiseCTAFloating />
          </>
        }
      />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <PreloadAssets />
        <AppRoutes />
      </AdminAuthProvider>
    </BrowserRouter>
  )
}

export default App