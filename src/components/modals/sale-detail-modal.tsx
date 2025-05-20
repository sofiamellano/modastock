"use client";

import { useEffect, useState } from "react";
import { obtenerVentas, obtenerPrendas } from "@/src/lib/api";

interface ModalDetalleVentaProps {
  idVenta: number;
  alCerrar: () => void;
}

export default function ModalDetalleVenta({ idVenta, alCerrar }: ModalDetalleVentaProps) {
  const [venta, setVenta] = useState<any | null>(null);
  const [prenda, setPrenda] = useState<any | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const [ventas, prendas] = await Promise.all([
        obtenerVentas(),
        obtenerPrendas()
      ]);

      const ventaEncontrada = ventas.find((v: any) => v.idventa === idVenta);
      if (ventaEncontrada) {
        setVenta(ventaEncontrada);
        const prendaEncontrada = prendas.find((p: any) => p.idprenda === ventaEncontrada.prendaid);
        setPrenda(prendaEncontrada);
      }
    };

    cargarDatos();
  }, [idVenta]);

  if (!venta || !prenda) return null;

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const manejarImpresion = () => {
    window.print();
  };

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
            <h4 className="text-lg font-semibold mb-2">Venta #{venta.idventa}</h4>
            <p>
              <strong>Fecha:</strong> {formatearFecha(venta.fecha)}
            </p>
            <p>
              <strong>Total:</strong> ${Number(venta.total_venta).toFixed(2)}
            </p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Prenda Vendida</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prenda</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">{prenda.prenda}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{prenda.talle || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{venta.cantidad_vendida}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${(Number(venta.total_venta) / venta.cantidad_vendida).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${Number(venta.total_venta).toFixed(2)}
                  </td>
                </tr>
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
  );
}
