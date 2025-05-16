"use client"

import { baseDeDatos } from "@/src/lib/data"

export default function Mayoristas() {
  return (
    <div className="lg:col-span-3 bg-white rounded-xl shadow p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Lista de Mayoristas</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prendas Suministradas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {baseDeDatos.proveedores.map((proveedor) => {
              const cantidadPrendas = baseDeDatos.prendas.filter((p) => p.proveedorId === proveedor.id).length

              return (
                <tr key={proveedor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{proveedor.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{proveedor.direccion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{proveedor.telefono || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{cantidadPrendas}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-600 hover:text-red-900">
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
