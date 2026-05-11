// ============================================================
// App.jsx — Routeur principal : site public + panneau admin
// ============================================================

import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'

// Composants du site public
import Navbar        from './components/Navbar'
import Footer        from './components/Footer'
import ScrollToTop   from './components/ScrollToTop'
import LoadingSpinner from './components/LoadingSpinner'

// Contextes globaux
import { AuthAdminProvider, useAuthAdmin } from './admin/context/AuthAdminContext'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import { ContenuProvider }      from './context/ContenuContext'

// Pages publiques (lazy loading)
const Accueil      = lazy(() => import('./pages/Accueil'))
const APropos      = lazy(() => import('./pages/APropos'))
const Services     = lazy(() => import('./pages/Services'))
const Realisations = lazy(() => import('./pages/Realisations'))
const Formation    = lazy(() => import('./pages/Formation'))
const Contact      = lazy(() => import('./pages/Contact'))
const NotFound     = lazy(() => import('./pages/NotFound'))

// Pages admin (lazy loading)
const AdminLogin       = lazy(() => import('./admin/pages/AdminLogin'))
const AdminDashboard   = lazy(() => import('./admin/pages/AdminDashboard'))
const AdminContacts    = lazy(() => import('./admin/pages/AdminContacts'))
const AdminServices    = lazy(() => import('./admin/pages/AdminServices'))
const AdminRealisations= lazy(() => import('./admin/pages/AdminRealisations'))
const AdminFormations  = lazy(() => import('./admin/pages/AdminFormations'))
const AdminInscriptions= lazy(() => import('./admin/pages/AdminInscriptions'))
const AdminTemoignages = lazy(() => import('./admin/pages/AdminTemoignages'))
const AdminNewsletter  = lazy(() => import('./admin/pages/AdminNewsletter'))
const AdminSettings    = lazy(() => import('./admin/pages/AdminSettings'))
const AdminContenu     = lazy(() => import('./admin/pages/AdminContenu'))
const AdminVideos      = lazy(() => import('./admin/pages/AdminVideos'))

// ---- Guard : redirige vers /admin/login si non connecté ----
const AdminGuard = ({ children }) => {
  const { isAuth, loading } = useAuthAdmin()
  if (loading) return <LoadingSpinner />
  return isAuth ? children : <Navigate to="/admin/login" replace />
}

// ---- Guard : redirige vers /admin si déjà connecté ----
const PublicAdminGuard = ({ children }) => {
  const { isAuth, loading } = useAuthAdmin()
  if (loading) return <LoadingSpinner />
  return !isAuth ? children : <Navigate to="/admin" replace />
}

function App() {
  return (
    <SiteSettingsProvider>
    <ContenuProvider>
    <AuthAdminProvider>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* ================================================
              SITE PUBLIC — avec Navbar et Footer
              ================================================ */}
          <Route path="/" element={<><Navbar /><main><Accueil /></main><Footer /></>} />
          <Route path="/a-propos"    element={<><Navbar /><main><APropos /></main><Footer /></>} />
          <Route path="/services"    element={<><Navbar /><main><Services /></main><Footer /></>} />
          <Route path="/realisations"element={<><Navbar /><main><Realisations /></main><Footer /></>} />
          <Route path="/formation"   element={<><Navbar /><main><Formation /></main><Footer /></>} />
          <Route path="/contact"     element={<><Navbar /><main><Contact /></main><Footer /></>} />

          {/* ================================================
              PANNEAU ADMIN — sans Navbar/Footer public
              ================================================ */}
          <Route path="/admin/login" element={
            <PublicAdminGuard><AdminLogin /></PublicAdminGuard>
          } />
          <Route path="/admin" element={
            <AdminGuard><AdminDashboard /></AdminGuard>
          } />
          <Route path="/admin/contacts" element={
            <AdminGuard><AdminContacts /></AdminGuard>
          } />
          <Route path="/admin/services" element={
            <AdminGuard><AdminServices /></AdminGuard>
          } />
          <Route path="/admin/realisations" element={
            <AdminGuard><AdminRealisations /></AdminGuard>
          } />
          <Route path="/admin/formations" element={
            <AdminGuard><AdminFormations /></AdminGuard>
          } />
          <Route path="/admin/inscriptions" element={
            <AdminGuard><AdminInscriptions /></AdminGuard>
          } />
          <Route path="/admin/temoignages" element={
            <AdminGuard><AdminTemoignages /></AdminGuard>
          } />
          <Route path="/admin/newsletter" element={
            <AdminGuard><AdminNewsletter /></AdminGuard>
          } />
          <Route path="/admin/settings" element={
            <AdminGuard><AdminSettings /></AdminGuard>
          } />
          <Route path="/admin/contenu" element={
            <AdminGuard><AdminContenu /></AdminGuard>
          } />
          <Route path="/admin/videos" element={
            <AdminGuard><AdminVideos /></AdminGuard>
          } />

          {/* 404 */}
          <Route path="*" element={<><Navbar /><main><NotFound /></main><Footer /></>} />
        </Routes>
      </Suspense>
    </AuthAdminProvider>
    </ContenuProvider>
    </SiteSettingsProvider>
  )
}

export default App
