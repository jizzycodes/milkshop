import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FranchiseCTAFloating from './components/FranchiseCTAFloating'
import ScrollPerformance from './components/ScrollPerformance'
import { FranchiseInquiryProvider, useFranchiseInquiry } from './context/FranchiseInquiryContext'
import { FRANCHISE_INQUIRY_ID, scheduleScrollToFranchiseInquiry } from './utils/franchiseInquiry'
import './App.css'

const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const About = lazy(() => import('./pages/About'))
const Locations = lazy(() => import('./pages/Locations'))
const Franchise = lazy(() => import('./pages/Franchise'))
const AdminApp = lazy(() => import('./admin/AdminApp'))

const PRELOAD_ASSETS = ['/milkshop-logo-removebg-preview.webp']

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
      <Suspense fallback={null}>
      <Routes location={location} key={location.pathname}>
      <Route
        path="/admin/*"
        element={<AdminApp />}
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
        <PreloadAssets />
        <AppRoutes />
      </FranchiseInquiryProvider>
    </BrowserRouter>
  )
}

export default App