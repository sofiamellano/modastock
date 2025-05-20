"use client";

import { useEffect, useState } from "react";
import { obtenerPrendas, obtenerMayoristas } from "@/src/lib/api";

export default function Mayoristas() {
  const [mayoristas, setMayoristas] = useState<any[]>([]);
  const [prendas, setPrendas] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [mayoristasRes, prendasRes] = await Promise.all([
        obtenerMayoristas(),
        obtenerPrendas(),
      ]);
      setMayoristas(mayoristasRes);
      setPrendas(prendasRes);
    };
    fetchData();
  }, []);

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
            {mayoristas.map((proveedor) => {
              const cantidadPrendas = prendas.filter((p) => p.mayoristaid === proveedor.idmayorista).length;

              return (
                <tr key={proveedor.idmayorista}>
                  <td className="px-6 py-4 whitespace-nowrap">{proveedor.mayorista}</td>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
