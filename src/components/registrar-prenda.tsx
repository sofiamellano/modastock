"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { registerNewGarment } from "@/src/lib/data"

interface RegistrarPrendaProps {
  onRegister: () => void
}

export default function RegistrarPrenda({ onRegister }: RegistrarPrendaProps) {
  const [formData, setFormData] = useState({
    tipoPrenda: "",
    cantidad: "",
    precioCompra: "",
    precioVenta: "",
    talle: "",
    totalCompra: "",
    nombreMayorista: "",
    direccionMayorista: "",
    telefonoMayorista: "",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    // Calculate total purchase when quantity or price changes
    if (id === "cantidad" || id === "precioCompra") {
      const cantidad = id === "cantidad" ? Number.parseInt(value) || 0 : Number.parseInt(formData.cantidad) || 0
      const precioCompra =
        id === "precioCompra" ? Number.parseFloat(value) || 0 : Number.parseFloat(formData.precioCompra) || 0
      const total = cantidad * precioCompra
      setFormData((prev) => ({ ...prev, totalCompra: total.toFixed(2) }))
    }

    // Calculate unit price when total is changed manually
    if (id === "totalCompra") {
      const total = Number.parseFloat(value) || 0
      const cantidad = Number.parseInt(formData.cantidad) || 0
      if (cantidad > 0) {
        const precioUnitario = total / cantidad
        setFormData((prev) => ({ ...prev, precioCompra: precioUnitario.toFixed(2) }))
      }
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    registerNewGarment(
      formData.tipoPrenda,
      Number.parseInt(formData.cantidad),
      Number.parseFloat(formData.precioCompra),
      Number.parseFloat(formData.precioVenta),
      formData.talle,
      formData.nombreMayorista,
      formData.direccionMayorista,
      formData.telefonoMayorista,
    )

    // Reset form
    setFormData({
      tipoPrenda: "",
      cantidad: "",
      precioCompra: "",
      precioVenta: "",
      talle: "",
      totalCompra: "",
      nombreMayorista: "",
      direccionMayorista: "",
      telefonoMayorista: "",
    })

    // Show success message
    alert("Prenda registrada exitosamente!")

    // Update parent component
    onRegister()
  }

  const handleCancel = () => {
    setFormData({
      tipoPrenda: "",
      cantidad: "",
      precioCompra: "",
      precioVenta: "",
      talle: "",
      totalCompra: "",
      nombreMayorista: "",
      direccionMayorista: "",
      telefonoMayorista: "",
    })
  }

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Registrar Nueva Prenda</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="tipoPrenda" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Prenda*
            </label>
            <select
              id="tipoPrenda"
              value={formData.tipoPrenda}
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
          <div>
            <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad*
            </label>
            <input
              type="number"
              id="cantidad"
              min="1"
              value={formData.cantidad}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="precioCompra" className="block text-sm font-medium text-gray-700 mb-1">
              Precio de Compra*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                type="number"
                id="precioCompra"
                min="0"
                step="0.01"
                value={formData.precioCompra}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="precioVenta" className="block text-sm font-medium text-gray-700 mb-1">
              Precio de Venta*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                type="number"
                id="precioVenta"
                min="0"
                step="0.01"
                value={formData.precioVenta}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="talle" className="block text-sm font-medium text-gray-700 mb-1">
              Talle (opcional)
            </label>
            <input
              type="text"
              id="talle"
              placeholder="Ej: 38, 40, 42 o 38-42"
              value={formData.talle}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="totalCompra" className="block text-sm font-medium text-gray-700 mb-1">
              Total Compra
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                type="number"
                id="totalCompra"
                min="0"
                step="0.01"
                value={formData.totalCompra}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Mayorista*</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="nombreMayorista" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre*
              </label>
              <input
                type="text"
                id="nombreMayorista"
                value={formData.nombreMayorista}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="direccionMayorista" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección*
              </label>
              <input
                type="text"
                id="direccionMayorista"
                value={formData.direccionMayorista}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="telefonoMayorista" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefonoMayorista"
                value={formData.telefonoMayorista}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <i className="fas fa-save mr-2"></i>Guardar Prenda
          </button>
        </div>
      </form>
    </div>
  )
}
