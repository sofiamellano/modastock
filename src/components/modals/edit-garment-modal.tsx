"use client"

import type React from "react"

import { useState, useEffect, type FormEvent } from "react"
import { getGarmentById, updateGarment } from "@/src/lib/data"

interface EditGarmentModalProps {
  garmentId: number
  onClose: () => void
  onUpdate: () => void
}

export default function EditGarmentModal({ garmentId, onClose, onUpdate }: EditGarmentModalProps) {
  const [formData, setFormData] = useState({
    type: "",
    size: "",
    stock: "",
    salePrice: "",
  })

  useEffect(() => {
    const garment = getGarmentById(garmentId)
    if (garment) {
      setFormData({
        type: garment.type,
        size: garment.size || "",
        stock: garment.stock.toString(),
        salePrice: garment.salePrice.toFixed(2),
      })
    }
  }, [garmentId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id.replace("edit", "").toLowerCase()]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const success = updateGarment(
      garmentId,
      formData.type,
      formData.size,
      Number.parseInt(formData.stock),
      Number.parseFloat(formData.salePrice),
    )

    if (success) {
      alert("Prenda actualizada exitosamente!")
      onUpdate()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Editar Prenda</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="editType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Prenda*
            </label>
            <select
              id="editType"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Seleccionar...</option>
              <option value="Camisa">Camisa</option>
              <option value="Pantalón">Pantalón</option>
              <option value="Vestido">Vestido</option>
              <option value="Chaqueta">Chaqueta</option>
              <option value="Falda">Falda</option>
              <option value="Blusa">Blusa</option>
              <option value="Short">Short</option>
              <option value="Abrigo">Abrigo</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="editSize" className="block text-sm font-medium text-gray-700 mb-1">
              Talle
            </label>
            <input
              type="text"
              id="editSize"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="editStock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock*
            </label>
            <input
              type="number"
              id="editStock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="editSalePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Precio de Venta*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                type="number"
                id="editSalePrice"
                min="0"
                step="0.01"
                value={formData.salePrice}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <i className="fas fa-save mr-2"></i>Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
