import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminLayout from './admin/components/AdminLayout'
import ProtectedRoute from './admin/components/ProtectedRoute'
import { AdminAuthProvider } from './admin/context/AdminAuthContext'
import RouteLoader from './components/RouteLoader'
import FranchiseCTAFloating from './components/FranchiseCTAFloating'
import ScrollPerformance from './components/ScrollPerformance'
import { FranchiseInquiryProvider, useFranchiseInquiry } from './context/FranchiseInquiryContext'
import { FRANCHISE_INQUIRY_ID, scheduleScrollToFranchiseInquiry } from './utils/franchiseInquiry'
import './App.css'

import Home from './pages/Home'
const Products = lazy(() => import('./pages/Products'))
const About = lazy(() => import('./pages/About'))
const Locations = lazy(() => import('./pages/Locations'))
const Franchise = lazy(() => import('./pages/Franchise'))

const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'))
const LeadsPage = lazy(() => import('./admin/pages/LeadsPage'))
const QrAndEmail = lazy(() => import('./admin/pages/QrAndEmail'))
const AccountSettings = lazy(() => import('./admin/pages/AccountSettings'))
const LeadDetails = lazy(() => import('./admin/pages/LeadDetails'))

// Preload loader assets so they're cached before RouteLoader mounts
const PRELOAD_ASSETS = ['/milkshop-logo-removebg-preview.png']

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
  const { pathname, hash } = useLocation()
  const { open } = useFranchiseInquiry()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (hash) {
        const id = hash.replace('#', '')
        if (id === FRANCHISE_INQUIRY_ID) {
          if (pathname === '/franchise') {
            scheduleScrollToFranchiseInquiry()
          } else {
            open()
          }
          return
        }
        const tryScroll = () => {
          const el = document.getElementById(id)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            return true
          }
          return false
        }

        if (tryScroll()) return
        requestAnimationFrame(() => {
          if (tryScroll()) return
          setTimeout(() => { tryScroll() }, 250)
        })
      } else {
        window.scrollTo(0, 0)
      }
    }
  }, [pathname, hash, open])

  return null
}

function AppRoutes() {
  const location = useLocation()

  return (
    <>
      <RouteLoader />
      <Suspense fallback={null}>
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
          <ProtectedRoute adminOnly>
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
            <ScrollPerformance />
            <div className="site-shell flex min-h-screen w-full flex-col">
              <Navbar />
              <main className="animate-page-in mt-0 flex-1 pt-0">
                <Suspense fallback={null}>
                <Routes>
                  <Route path="/"          element={<Home />} />
                  <Route path="/products"  element={<Products />} />
                  <Route path="/about"     element={<About />} />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/franchise" element={<Franchise />} />
                </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
            <FranchiseCTAFloating />
          </>
        }
      />
      </Routes>
      </Suspense>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <FranchiseInquiryProvider>
        <AdminAuthProvider>
          <PreloadAssets />
          <AppRoutes />
        </AdminAuthProvider>
      </FranchiseInquiryProvider>
    </BrowserRouter>
  )
}

export default App