import Navbar from '@/components/layout/Navbar'

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6">
      <div className="text-center text-sm text-slate-600 space-y-1">
        <p>© 2026 Rentoo - Sistema de Gestión de Contratos de Alquileres</p>
        <p>Desarrollado por Flavio De Souza</p>
      </div>
    </footer>
  )
}

/**
 * Layout wrapper for all authenticated pages.
 *
 * Renders: <Navbar /> + <main> (centred, max 1100px) + <Footer />
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main
        className="flex-1 px-6 py-8"
        style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
