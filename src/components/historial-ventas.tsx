"use client";

import { useEffect, useState, useMemo } from "react";
import { obtenerVentas, obtenerPrendas } from "@/src/lib/api";

interface HistorialVentasProps {
  alVerDetalleVenta: (idVenta: number) => void;
}

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const HistorialVentas = ({ alVerDetalleVenta }: HistorialVentasProps) => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ventas, setVentas] = useState<any[]>([]);
  const [prendas, setPrendas] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [ventasRes, prendasRes] = await Promise.all([
        obtenerVentas(),
        obtenerPrendas(),
      ]);
      setVentas(ventasRes);
      setPrendas(prendasRes);
    };
    fetchData();
  }, []);

  const obtenerPrendaPorId = (id: number) => prendas.find((p) => p.idprenda === id);

  const ventasFiltradas = useMemo(() => {
    return ventas
      .filter((venta) => {
        const fecha = venta.fecha?.slice(0, 10);
        if (fechaInicio && fecha < fechaInicio) return false;
        if (fechaFin && fecha > fechaFin) return false;
        return true;
      })
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [ventas, fechaInicio, fechaFin]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Historial de Ventas</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="fechaInicio" className="text-sm font-medium mb-1">Desde</label>
          <input
            type="date"
            id="fechaInicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="fechaFin" className="text-sm font-medium mb-1">Hasta</label>
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
              <th className="px-6 py-3 border-b">Prenda</th>
              <th className="px-6 py-3 border-b">Cantidad</th>
              <th className="px-6 py-3 border-b">Total ($)</th>
              <th className="px-6 py-3 border-b">Acción</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron ventas en el rango seleccionado.
                </td>
              </tr>
            ) : (
              ventasFiltradas.map((venta) => {
                const prenda = obtenerPrendaPorId(venta.prendaid);
                return (
                  <tr key={venta.idventa} className="hover:bg-gray-50 text-sm">
                    <td className="px-6 py-4 border-b">{venta.idventa}</td>
                    <td className="px-6 py-4 border-b">{formatearFecha(venta.fecha)}</td>
                    <td className="px-6 py-4 border-b">{prenda ? prenda.prenda : `ID ${venta.prendaid}`}</td>
                    <td className="px-6 py-4 border-b">{venta.cantidad_vendida}</td>
                    <td className="px-6 py-4 border-b">${venta.total_venta.toFixed(2)}</td>
                    <td className="px-6 py-4 border-b">
                      <button
                        onClick={() => alVerDetalleVenta(venta.idventa)}
                        className="text-indigo-600 hover:underline"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialVentas;
