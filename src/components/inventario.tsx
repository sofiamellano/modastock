"use client"

import { useState } from "react"
import { database, getSupplierById, deleteGarment } from "@/src/lib/data"

interface InventarioProps {
  onEditGarment: (garmentId: number) => void
  onDataUpdate: () => void
}

export default function Inventario({ onEditGarment, onDataUpdate }: InventarioProps) {
  const [filterType, setFilterType] = useState("")
  const [searchText, setSearchText] = useState("")

  const handleDeleteGarment = (garmentId: number) => {
    if (window.confirm("¿Está seguro que desea eliminar esta prenda?")) {
      const success = deleteGarment(garmentId)
      if (success) {
        alert("Prenda eliminada exitosamente!")
        onDataUpdate()
      }
    }
  }

  const filteredGarments = database.garments.filter((garment) => {
    if (filterType && garment.type !== filterType) return false
    if (
      searchText &&
      !garment.type.toLowerCase().includes(searchText.toLowerCase()) &&
      !(garment.size && garment.size.toLowerCase().includes(searchText.toLowerCase()))
    )
      return false
    return true
  })

  return (
    <div className="lg:col-span-3 bg-white rounded-xl shadow p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Inventario de Prendas</h2>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar prendas..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todas las prendas</option>
            <option value="Camisa">Camisas</option>
            <option value="Pantalón">Pantalones</option>
            <option value="Vestido">Vestidos</option>
            <option value="Chaqueta">Chaquetas</option>
            <option value="Falda">Faldas</option>
            <option value="Blusa">Blusas</option>
            <option value="Short">Shorts</option>
            <option value="Abrigo">Abrigos</option>
          </select>
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
                Stock
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Precio Compra
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGarments.map((garment) => {
              const supplier = getSupplierById(garment.supplierId)

              return (
                <tr key={garment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{garment.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{garment.size || "N/A"}</td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap ${garment.stock < 5 ? "text-red-600 font-semibold" : ""}`}
                  >
                    {garment.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${garment.purchasePrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${garment.salePrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{supplier?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onEditGarment(garment.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={() => handleDeleteGarment(garment.id)} className="text-red-600 hover:text-red-900">
                      <i className="fas fa-trash"></i>
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
