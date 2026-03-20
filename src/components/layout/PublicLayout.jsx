// PublicLayout — wraps all public (unauthenticated) pages.
// Provides: bg-slate-50 page background, centred content area,
// and the shared Footer. Login and Register import this instead
// of defining their own shell + inline footer.

export default function PublicLayout({ children }) {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        {children}
      </main>

      <footer
        className="w-full py-6 text-center"
        style={{ backgroundColor: 'white', borderTop: '1px solid #e2e8f0' }}
      >
        <p className="text-sm text-slate-600">
          © 2026 Rentoo - Sistema de Gestión de Contratos de Alquileres
        </p>
        <p className="text-sm text-slate-600 mt-0.5">
          Desarrollado por Flavio De Souza
        </p>
      </footer>
    </div>
  )
}
