"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/src/components/sidebar"
import Header from "@/src/components/header"
import Dashboard from "@/src/components/dashboard"
import RegistrarPrenda from "@/src/components/registrar-prenda"
import RegistrarVenta from "@/src/components/registrar-venta"
import Mayoristas from "@/src/components/mayoristas"
import Inventario from "@/src/components/inventario"
import HistorialVentas from "@/src/components/historial-ventas"
import SaleDetailModal from "@/src/components/modals/sale-detail-modal"
import EditGarmentModal from "@/src/components/modals/edit-garment-modal"
import { database, getSalesToday, calculateIncomeToday, getTotalStock } from "@/src/lib/data"

export default function StockControlPage() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null)
  const [selectedGarmentId, setSelectedGarmentId] = useState<number | null>(null)
  const [stats, setStats] = useState({
    totalStock: 0,
    salesToday: 0,
    totalSuppliers: 0,
    incomeToday: 0,
  })

  useEffect(() => {
    updateStats()
  }, [])

  const updateStats = () => {
    setStats({
      totalStock: getTotalStock(),
      salesToday: getSalesToday().length,
      totalSuppliers: database.suppliers.length,
      incomeToday: calculateIncomeToday(),
    })
  }

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleViewSaleDetails = (saleId: number) => {
    setSelectedSaleId(saleId)
  }

  const handleEditGarment = (garmentId: number) => {
    setSelectedGarmentId(garmentId)
  }

  const handleDataUpdate = () => {
    updateStats()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onNavigate={handleSectionChange}
        activeSection={activeSection}
      />

      <div
        className={`main-content flex-1 overflow-auto transition-all duration-300 ${sidebarCollapsed ? "ml-[70px]" : "ml-64"}`}
      >
        <Header title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} />

        <main className="p-6">
          {activeSection === "dashboard" && <Dashboard stats={stats} />}

          {activeSection === "registrarPrenda" && <RegistrarPrenda onRegister={handleDataUpdate} />}

          {activeSection === "registrarVenta" && <RegistrarVenta onRegister={handleDataUpdate} />}

          {activeSection === "mayoristas" && <Mayoristas />}

          {activeSection === "inventario" && (
            <Inventario onEditGarment={handleEditGarment} onDataUpdate={handleDataUpdate} />
          )}

          {activeSection === "historialVentas" && <HistorialVentas onViewSaleDetails={handleViewSaleDetails} />}
        </main>
      </div>

      {selectedSaleId !== null && <SaleDetailModal saleId={selectedSaleId} onClose={() => setSelectedSaleId(null)} />}

      {selectedGarmentId !== null && (
        <EditGarmentModal
          garmentId={selectedGarmentId}
          onClose={() => setSelectedGarmentId(null)}
          onUpdate={handleDataUpdate}
        />
      )}
    </div>
  )
}
