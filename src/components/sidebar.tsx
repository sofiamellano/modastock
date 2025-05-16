"use client"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  onNavigate: (section: string) => void
  activeSection: string
}

export default function Sidebar({ collapsed, onToggle, onNavigate, activeSection }: SidebarProps) {
  return (
    <div
      className={`sidebar bg-indigo-800 text-white flex flex-col transition-all duration-300 ${collapsed ? "w-[70px]" : "w-64"}`}
    >
      <div className="p-4 flex items-center justify-between border-b border-indigo-700">
        <div className="flex items-center">
          <i className="fas fa-tshirt text-2xl mr-3"></i>
          <span className={`sidebar-text font-bold text-xl ${collapsed ? "hidden" : ""}`}>ModaStock</span>
        </div>
        <button onClick={onToggle} className="text-white focus:outline-none">
          <i className="fas fa-bars"></i>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4">
          <div className="mb-8">
            <p
              className={`sidebar-text uppercase text-xs font-semibold text-indigo-300 mb-4 ${collapsed ? "hidden" : ""}`}
            >
              Principal
            </p>
            <ul>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate("dashboard")
                  }}
                  className={`flex items-center py-2 px-3 rounded-lg ${activeSection === "dashboard" ? "bg-indigo-700 text-white" : "hover:bg-indigo-700 text-white"} mb-2`}
                >
                  <i className="fas fa-tachometer-alt mr-3"></i>
                  <span className={`sidebar-text ${collapsed ? "hidden" : ""}`}>Dashboard</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="mb-8">
            <p
              className={`sidebar-text uppercase text-xs font-semibold text-indigo-300 mb-4 ${collapsed ? "hidden" : ""}`}
            >
              Operaciones
            </p>
            <ul>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate("registrarPrenda")
                  }}
                  className={`flex items-center py-2 px-3 rounded-lg ${activeSection === "registrarPrenda" ? "bg-indigo-700 text-white" : "hover:bg-indigo-700 text-white"} mb-2`}
                >
                  <i className="fas fa-plus-circle mr-3"></i>
                  <span className={`sidebar-text ${collapsed ? "hidden" : ""}`}>Registrar Prenda</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate("registrarVenta")
                  }}
                  className={`flex items-center py-2 px-3 rounded-lg ${activeSection === "registrarVenta" ? "bg-indigo-700 text-white" : "hover:bg-indigo-700 text-white"} mb-2`}
                >
                  <i className="fas fa-cash-register mr-3"></i>
                  <span className={`sidebar-text ${collapsed ? "hidden" : ""}`}>Registrar Venta</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate("mayoristas")
                  }}
                  className={`flex items-center py-2 px-3 rounded-lg ${activeSection === "mayoristas" ? "bg-indigo-700 text-white" : "hover:bg-indigo-700 text-white"} mb-2`}
                >
                  <i className="fas fa-truck mr-3"></i>
                  <span className={`sidebar-text ${collapsed ? "hidden" : ""}`}>Mayoristas</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="mb-8">
            <p
              className={`sidebar-text uppercase text-xs font-semibold text-indigo-300 mb-4 ${collapsed ? "hidden" : ""}`}
            >
              Reportes
            </p>
            <ul>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate("inventario")
                  }}
                  className={`flex items-center py-2 px-3 rounded-lg ${activeSection === "inventario" ? "bg-indigo-700 text-white" : "hover:bg-indigo-700 text-white"} mb-2`}
                >
                  <i className="fas fa-boxes mr-3"></i>
                  <span className={`sidebar-text ${collapsed ? "hidden" : ""}`}>Inventario</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate("historialVentas")
                  }}
                  className={`flex items-center py-2 px-3 rounded-lg ${activeSection === "historialVentas" ? "bg-indigo-700 text-white" : "hover:bg-indigo-700 text-white"} mb-2`}
                >
                  <i className="fas fa-history mr-3"></i>
                  <span className={`sidebar-text ${collapsed ? "hidden" : ""}`}>Historial Ventas</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      
    </div>
  )
}
