"use client";

import { useState, useEffect } from "react";
import { obtenerPrendas, obtenerMayoristas } from "@/src/lib/api";

interface InventarioProps {
  onEditPrenda: (prendaId: number) => void;
  onDataUpdate: () => void;
}

export default function Inventario({ onEditPrenda, onDataUpdate }: InventarioProps) {
  const [filtroTipo, setFiltroTipo] = useState("");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [prendas, setPrendas] = useState<any[]>([]);
  const [mayoristas, setMayoristas] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [prendasRes, mayoristasRes] = await Promise.all([
        obtenerPrendas(),
        obtenerMayoristas(),
      ]);
      setPrendas(prendasRes);
      setMayoristas(mayoristasRes);
    };
    fetchData();
  }, [onDataUpdate]);

  const obtenerProveedorPorId = (id: number) => mayoristas.find((m) => m.idmayorista === id);

  const prendasFiltradas = prendas.filter((prenda) => {
    if (filtroTipo && prenda.prenda !== filtroTipo) return false;
    if (
      textoBusqueda &&
      !prenda.prenda.toLowerCase().includes(textoBusqueda.toLowerCase()) &&
      !(prenda.talle && prenda.talle.toLowerCase().includes(textoBusqueda.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

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
              const proveedor = obtenerProveedorPorId(prenda.mayoristaid);

              return (
                <tr key={prenda.idprenda}>
                  <td className="px-6 py-4 whitespace-nowrap">{prenda.prenda}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{prenda.talle || "N/A"}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${prenda.stockactual < 5 ? "text-red-600 font-semibold" : ""}`}>
                    {prenda.stockactual}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${Number(prenda.preciocompra).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${Number(prenda.precioventa).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{proveedor?.mayorista || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onEditPrenda(prenda.idprenda)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    {/* Lógica de eliminación puede ir aquí si se implementa en la API */}
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
