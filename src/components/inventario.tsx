"use client"

import { useState } from "react"
import { baseDeDatos, obtenerProveedorPorId, eliminarPrenda } from "@/src/lib/data"

interface InventarioProps {
  onEditPrenda: (prendaId: number) => void
  onDataUpdate: () => void
}

export default function Inventario({ onEditPrenda, onDataUpdate }: InventarioProps) {
  const [filtroTipo, setFiltroTipo] = useState("")
  const [textoBusqueda, setTextoBusqueda] = useState("")

  const handleEliminarPrenda = (prendaId: number) => {
    if (window.confirm("¿Está seguro que desea eliminar esta prenda?")) {
      const success = eliminarPrenda(prendaId)
      if (success) {
        alert("¡Prenda eliminada exitosamente!")
        onDataUpdate()
      }
    }
  }

  const prendasFiltradas = baseDeDatos.prendas.filter((prenda) => {
    if (filtroTipo && prenda.tipo !== filtroTipo) return false
    if (
      textoBusqueda &&
      !prenda.tipo.toLowerCase().includes(textoBusqueda.toLowerCase()) &&
      !(prenda.talle && prenda.talle.toLowerCase().includes(textoBusqueda.toLowerCase()))
    ) {
      return false
    }
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
            value={textoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
            placeholder="Buscar prendas..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
        <div>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Compra</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Venta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prendasFiltradas.map((prenda) => {
              const proveedor = obtenerProveedorPorId(prenda.proveedorId)

              return (
                <tr key={prenda.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{prenda.tipo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{prenda.talle || "N/A"}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${prenda.stock < 5 ? "text-red-600 font-semibold" : ""}`}>
                    {prenda.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${prenda.precioCompra.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${prenda.precioVenta.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{proveedor?.nombre || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onEditPrenda(prenda.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleEliminarPrenda(prenda.id)}
                      className="text-red-600 hover:text-red-900"
                    >
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
