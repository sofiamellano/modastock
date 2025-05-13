"use client"

import { useState, useEffect, type FormEvent } from "react"
import { database, getGarmentById, registerNewSale, type SaleItem } from "@/src/lib/data"

interface GarmentRow {
  id: string
  garmentId: string
  quantity: string
  price: string
}

interface RegistrarVentaProps {
  onRegister: () => void
}

export default function RegistrarVenta({ onRegister }: RegistrarVentaProps) {
  const [garmentRows, setGarmentRows] = useState<GarmentRow[]>([{ id: "1", garmentId: "", quantity: "", price: "" }])
  const [totalVenta, setTotalVenta] = useState("0.00")

  useEffect(() => {
    calculateTotalSale()
  }, [garmentRows])

  const addGarmentRow = () => {
    const newId = (garmentRows.length + 1).toString()
    setGarmentRows([...garmentRows, { id: newId, garmentId: "", quantity: "", price: "" }])
  }

  const removeGarmentRow = (id: string) => {
    if (garmentRows.length > 1) {
      setGarmentRows(garmentRows.filter((row) => row.id !== id))
    }
  }

  const handleGarmentChange = (id: string, field: keyof GarmentRow, value: string) => {
    setGarmentRows(
      garmentRows.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value }

          // Auto-fill price when garment is selected
          if (field === "garmentId" && value) {
            const garment = getGarmentById(Number.parseInt(value))
            if (garment) {
              updatedRow.price = garment.salePrice.toFixed(2)
            }
          }

          return updatedRow
        }
        return row
      }),
    )
  }

  const calculateTotalSale = () => {
    let total = 0
    garmentRows.forEach((row) => {
      const quantity = Number.parseFloat(row.quantity) || 0
      const price = Number.parseFloat(row.price) || 0
      total += quantity * price
    })
    setTotalVenta(total.toFixed(2))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Validate rows
    const saleItems: SaleItem[] = []
    let isValid = true

    garmentRows.forEach((row) => {
      if (!row.garmentId || !row.quantity || !row.price) {
        isValid = false
        return
      }

      const garmentId = Number.parseInt(row.garmentId)
      const quantity = Number.parseInt(row.quantity)
      const price = Number.parseFloat(row.price)

      // Check stock
      const garment = getGarmentById(garmentId)
      if (!garment || garment.stock < quantity) {
        alert(
          `No hay suficiente stock de ${garment?.type} (${garment?.size || "N/A"}). Stock disponible: ${garment?.stock}`,
        )
        isValid = false
        return
      }

      saleItems.push({
        garmentId,
        quantity,
        price,
      })
    })

    if (!isValid || saleItems.length === 0) {
      alert("Por favor complete todos los campos correctamente.")
      return
    }

    // Register sale
    const success = registerNewSale(saleItems)

    if (success) {
      // Reset form
      setGarmentRows([{ id: "1", garmentId: "", quantity: "", price: "" }])
      setTotalVenta("0.00")

      // Show success message
      alert("Venta registrada exitosamente!")

      // Update parent component
      onRegister()
    }
  }

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Registrar Nueva Venta</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Prendas Vendidas</label>
          <div>
            {garmentRows.map((row) => (
              <div key={row.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-3">
                <div className="md:col-span-5">
                  <select
                    value={row.garmentId}
                    onChange={(e) => handleGarmentChange(row.id, "garmentId", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Seleccionar Prenda...</option>
                    {database.garments.map((garment) => (
                      <option key={garment.id} value={garment.id}>
                        {garment.type} ({garment.size || "N/A"}) - Stock: {garment.stock}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-3">
                  <input
                    type="number"
                    min="1"
                    value={row.quantity}
                    onChange={(e) => handleGarmentChange(row.id, "quantity", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Cantidad"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <div className="relative">
                    <span className="absolute left-3 top-2">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.price}
                      onChange={(e) => handleGarmentChange(row.id, "price", e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Precio"
                      required
                    />
                  </div>
                </div>
                <div className="md:col-span-1 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeGarmentRow(row.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={garmentRows.length === 1}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addGarmentRow}
            className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
          >
            <i className="fas fa-plus mr-1"></i>Añadir otra prenda
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="totalVenta" className="block text-sm font-medium text-gray-700 mb-1">
              Total Venta
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                type="number"
                id="totalVenta"
                value={totalVenta}
                readOnly
                className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setGarmentRows([{ id: "1", garmentId: "", quantity: "", price: "" }])}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <i className="fas fa-cash-register mr-2"></i>Registrar Venta
          </button>
        </div>
      </form>
    </div>
  )
}
