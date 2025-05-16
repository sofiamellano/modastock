"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import {
  obtenerPrendasConPocoStock,
  obtenerPrendasPorTipo,
  obtenerVentasPorDia,
  obtenerProveedorPorId,
  formatearFecha
} from "@/src/lib/data"

Chart.register(...registerables)

interface DashboardProps {
  stats: {
    prendasTotales: number
    ventasHoy: number
    mayoristasTotales: number
    ingresosHoy: number
  }
}

export default function Dashboard({ stats }: DashboardProps) {
  const stockChartRef = useRef<HTMLCanvasElement>(null)
  const salesChartRef = useRef<HTMLCanvasElement>(null)
  const stockChartInstance = useRef<Chart | null>(null)
  const salesChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    inicializarGraficos()
    return () => {
      stockChartInstance.current?.destroy()
      salesChartInstance.current?.destroy()
    }
  }, [])

  const inicializarGraficos = () => {
    if (stockChartRef.current && salesChartRef.current) {
      const stockCtx = stockChartRef.current.getContext("2d")
      if (stockCtx) {
        stockChartInstance.current?.destroy()

        const prendasPorTipo = obtenerPrendasPorTipo()
        stockChartInstance.current = new Chart(stockCtx, {
          type: "bar",
          data: {
            labels: Object.keys(prendasPorTipo),
            datasets: [
              {
                label: "Prendas en Stock",
                data: Object.values(prendasPorTipo),
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

      const salesCtx = salesChartRef.current.getContext("2d")
      if (salesCtx) {
        salesChartInstance.current?.destroy()

        const ventasPorDia = obtenerVentasPorDia()
        salesChartInstance.current = new Chart(salesCtx, {
          type: "line",
          data: {
            labels: Object.keys(ventasPorDia).map((fecha) => formatearFecha(fecha, true)),
            datasets: [
              {
                label: "Ventas por Día ($)",
                data: Object.values(ventasPorDia),
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

  const prendasBajoStock = obtenerPrendasConPocoStock()

  return (
    <>
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <CardEstadistica icono="fas fa-tshirt" color="indigo" titulo="Prendas en Stock" valor={stats.prendasTotales} />
        <CardEstadistica icono="fas fa-cash-register" color="green" titulo="Ventas Hoy" valor={stats.ventasHoy} />
        <CardEstadistica icono="fas fa-truck" color="blue" titulo="Mayoristas" valor={stats.mayoristasTotales} />
        <CardEstadistica
          icono="fas fa-dollar-sign"
          color="purple"
          titulo="Ingresos Hoy"
          valor={`$${stats.ingresosHoy.toFixed(2)}`}
        />
      </div>

      {/* Gráficos */}
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

      {/* Prendas con stock bajo */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Prendas con Stock Bajo</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <EncabezadoTabla texto="Tipo" />
                <EncabezadoTabla texto="Talle" />
                <EncabezadoTabla texto="Stock Actual" />
                <EncabezadoTabla texto="Precio Venta" />
                <EncabezadoTabla texto="Mayorista" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prendasBajoStock.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No hay prendas con stock bajo
                  </td>
                </tr>
              ) : (
                prendasBajoStock.map((prenda) => {
                  const mayorista = obtenerProveedorPorId(prenda.proveedorId)
                  return (
                    <tr key={prenda.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{prenda.tipo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{prenda.talle || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-red-600 font-semibold">{prenda.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${prenda.precioVenta.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{mayorista?.nombre}</td>
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

// Componente reutilizable para tarjetas de estadísticas
function CardEstadistica({
  icono,
  color,
  titulo,
  valor,
}: {
  icono: string
  color: string
  titulo: string
  valor: string | number
}) {
  return (
    <div className="highlight-card bg-white rounded-xl shadow p-6 flex items-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
      <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600 mr-4`}>
        <i className={`${icono} text-xl`}></i>
      </div>
      <div>
        <p className="text-gray-500 text-sm">{titulo}</p>
        <p className="text-2xl font-bold">{valor}</p>
      </div>
    </div>
  )
}

// Componente reutilizable para encabezado de tabla
function EncabezadoTabla({ texto }: { texto: string }) {
  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
    >
      {texto}
    </th>
  )
}
