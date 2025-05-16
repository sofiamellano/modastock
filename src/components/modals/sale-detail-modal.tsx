"use client"

import { baseDeDatos, obtenerPrendaPorId, formatearFecha } from "@/src/lib/data"

interface ModalDetalleVentaProps {
  idVenta: number
  alCerrar: () => void
}

export default function ModalDetalleVenta({ idVenta, alCerrar }: ModalDetalleVentaProps) {
  const venta = baseDeDatos.ventas.find((v) => v.id === idVenta)

  if (!venta) {
    return null
  }

  const manejarImpresion = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Detalles de la Venta</h3>
          <button onClick={alCerrar} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Venta #{venta.id}</h4>
            <p>
              <strong>Fecha:</strong> {formatearFecha(venta.fecha)}
            </p>
            <p>
              <strong>Total:</strong> ${venta.total.toFixed(2)}
            </p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Prendas Vendidas</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prenda
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Talle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Unitario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {venta.items.map((item, index) => {
                  const prenda = obtenerPrendaPorId(item.prendaId)
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{prenda?.tipo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{prenda?.talle || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.cantidad}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${item.precio.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${(item.cantidad * item.precio).toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <button
              onClick={manejarImpresion}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mr-2"
            >
              <i className="fas fa-print mr-2"></i>Imprimir
            </button>
            <button
              onClick={alCerrar}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}