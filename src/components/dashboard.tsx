"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { getLowStockItems, getGarmentsByType, getSalesByDay, getSupplierById, formatDate } from "@/src/lib/data"

Chart.register(...registerables)

interface DashboardProps {
  stats: {
    totalStock: number
    salesToday: number
    totalSuppliers: number
    incomeToday: number
  }
}

export default function Dashboard({ stats }: DashboardProps) {
  const stockChartRef = useRef<HTMLCanvasElement>(null)
  const salesChartRef = useRef<HTMLCanvasElement>(null)
  const stockChartInstance = useRef<Chart | null>(null)
  const salesChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    initCharts()
    return () => {
      if (stockChartInstance.current) {
        stockChartInstance.current.destroy()
      }
      if (salesChartInstance.current) {
        salesChartInstance.current.destroy()
      }
    }
  }, [])

  const initCharts = () => {
    if (stockChartRef.current && salesChartRef.current) {
      // Stock by type chart
      const stockCtx = stockChartRef.current.getContext("2d")
      if (stockCtx) {
        if (stockChartInstance.current) {
          stockChartInstance.current.destroy()
        }

        const garmentsByType = getGarmentsByType()
        stockChartInstance.current = new Chart(stockCtx, {
          type: "bar",
          data: {
            labels: Object.keys(garmentsByType),
            datasets: [
              {
                label: "Prendas en Stock",
                data: Object.values(garmentsByType),
                backgroundColor: "rgba(79, 70, 229, 0.7)",
                borderColor: "rgba(79, 70, 229, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        })
      }

      // Sales by day chart
      const salesCtx = salesChartRef.current.getContext("2d")
      if (salesCtx) {
        if (salesChartInstance.current) {
          salesChartInstance.current.destroy()
        }

        const salesByDay = getSalesByDay()
        salesChartInstance.current = new Chart(salesCtx, {
          type: "line",
          data: {
            labels: Object.keys(salesByDay).map((date) => formatDate(date, true)),
            datasets: [
              {
                label: "Ventas por Día ($)",
                data: Object.values(salesByDay),
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                borderColor: "rgba(16, 185, 129, 1)",
                borderWidth: 2,
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        })
      }
    }
  }

  const lowStockItems = getLowStockItems()

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="highlight-card bg-white rounded-xl shadow p-6 flex items-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            <i className="fas fa-tshirt text-xl"></i>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Prendas en Stock</p>
            <p className="text-2xl font-bold">{stats.totalStock}</p>
          </div>
        </div>
        <div className="highlight-card bg-white rounded-xl shadow p-6 flex items-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <i className="fas fa-cash-register text-xl"></i>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Ventas Hoy</p>
            <p className="text-2xl font-bold">{stats.salesToday}</p>
          </div>
        </div>
        <div className="highlight-card bg-white rounded-xl shadow p-6 flex items-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <i className="fas fa-truck text-xl"></i>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Mayoristas</p>
            <p className="text-2xl font-bold">{stats.totalSuppliers}</p>
          </div>
        </div>
        <div className="highlight-card bg-white rounded-xl shadow p-6 flex items-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <i className="fas fa-dollar-sign text-xl"></i>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Ingresos Hoy</p>
            <p className="text-2xl font-bold">${stats.incomeToday.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Dashboard Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Prendas en Stock por Tipo</h2>
          <div className="chart-container h-[300px]">
            <canvas ref={stockChartRef}></canvas>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ventas por Día (Últimos 7 días)</h2>
          <div className="chart-container h-[300px]">
            <canvas ref={salesChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Low Stock Items */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Prendas con Stock Bajo</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tipo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Talle
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stock Actual
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Precio Venta
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mayorista
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No hay prendas con stock bajo
                  </td>
                </tr>
              ) : (
                lowStockItems.map((garment) => {
                  const supplier = getSupplierById(garment.supplierId)
                  return (
                    <tr key={garment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{garment.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{garment.size || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-red-600 font-semibold">{garment.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${garment.salePrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{supplier?.name}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
