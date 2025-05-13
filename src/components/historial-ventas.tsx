"use client"

import { useState } from "react"
import { database, getGarmentById, formatDate } from "@/src/lib/data"

interface HistorialVentasProps {
  onViewSaleDetails: (saleId: number) => void
}

export default function HistorialVentas({ onViewSaleDetails }: HistorialVentasProps) {
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split("T")[0])
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split("T")[0])

  const filteredSales = database.sales
    .filter((sale) => {
      if (fechaInicio && sale.date < fechaInicio) return false
      if (fechaFin && sale.date > fechaFin) return false
      return true
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="lg:col-span-3 bg-white rounded-xl shadow p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Historial de Ventas</h2>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <div>
            <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-1">
              Desde
            </label>
            <input
              type="date"
              id="fechaInicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-1">
              Hasta
            </label>
            <input
              type="date"
              id="fechaFin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <i className="fas fa-filter mr-2"></i>Filtrar
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Prendas
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Cantidad Total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Venta
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSales.map((sale) => {
              const totalQuantity = sale.items.reduce((sum, item) => sum + item.quantity, 0)
              const garmentNames = sale.items
                .map((item) => {
                  const garment = getGarmentById(item.garmentId)
                  return `${garment?.type} (${garment?.size || "N/A"}) x${item.quantity}`
                })
                .join(", ")

              return (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(sale.date)}</td>
                  <td className="px-6 py-4">{garmentNames}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{totalQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${sale.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onViewSaleDetails(sale.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <i className="fas fa-eye"></i> Ver Detalles
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
