import { useState, useMemo } from "react"
import { baseDeDatos, obtenerPrendaPorId, formatearFecha } from "@/src/lib/data"

interface HistorialVentasProps {
  alVerDetalleVenta: (idVenta: number) => void
}

const HistorialVentas = ({ alVerDetalleVenta }: HistorialVentasProps) => {
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  const ventasFiltradas = useMemo(() => {
    return baseDeDatos.ventas
      .filter((venta) => {
        if (fechaInicio && venta.fecha < fechaInicio) return false
        if (fechaFin && venta.fecha > fechaFin) return false
        return true
      })
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }, [fechaInicio, fechaFin])

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Historial de Ventas</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="fechaInicio" className="text-sm font-medium mb-1">
            Desde
          </label>
          <input
            type="date"
            id="fechaInicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="fechaFin" className="text-sm font-medium mb-1">
            Hasta
          </label>
          <input
            type="date"
            id="fechaFin"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <th className="px-6 py-3 border-b">ID</th>
              <th className="px-6 py-3 border-b">Fecha</th>
              <th className="px-6 py-3 border-b">Prendas</th>
              <th className="px-6 py-3 border-b">Total ($)</th>
              <th className="px-6 py-3 border-b">Acción</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron ventas en el rango seleccionado.
                </td>
              </tr>
            ) : (
              ventasFiltradas.map((venta) => {
                const nombresPrendas = venta.items
                  .map((item) => {
                    const prenda = obtenerPrendaPorId(item.prendaId)
                    return prenda ? `${prenda.tipo} (x${item.cantidad})` : `Prenda ID ${item.prendaId}`
                  })
                  .join(", ")

                return (
                  <tr key={venta.id} className="hover:bg-gray-50 text-sm">
                    <td className="px-6 py-4 border-b">{venta.id}</td>
                    <td className="px-6 py-4 border-b">{formatearFecha(venta.fecha)}</td>
                    <td className="px-6 py-4 border-b">{nombresPrendas}</td>
                    <td className="px-6 py-4 border-b">${venta.total.toFixed(2)}</td>
                    <td className="px-6 py-4 border-b">
                      <button
                        onClick={() => alVerDetalleVenta(venta.id)}
                        className="text-indigo-600 hover:underline"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HistorialVentas
