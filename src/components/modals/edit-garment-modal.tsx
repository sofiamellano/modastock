"use client";

import { useState, useEffect } from "react";
import { obtenerPrendas, actualizarPrenda, PrendaPayload } from "@/src/lib/api";

interface ModalEditarPrendaProps {
  prendaId: number;
  alCerrar: () => void;
  alActualizar: () => void;
}

export default function ModalEditarPrenda({
  prendaId,
  alCerrar,
  alActualizar,
}: ModalEditarPrendaProps) {
  const [datosFormulario, setDatosFormulario] = useState({
    tipo: "",
    talle: "",
    stock: "",
    precioVenta: "",
  });
  const [prendaOriginal, setPrendaOriginal] = useState<any | null>(null);

  useEffect(() => {
    const cargarPrenda = async () => {
      const prendas = await obtenerPrendas();
      const prenda = prendas.find((p: any) => p.idprenda === prendaId);
      if (prenda) {
        setPrendaOriginal(prenda);
        setDatosFormulario({
          tipo: prenda.prenda,
          talle: prenda.talle || "",
          stock: prenda.stockactual.toString(),
          precioVenta: prenda.precioventa.toFixed(2),
        });
      }
    };
    cargarPrenda();
  }, [prendaId]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setDatosFormulario((prev) => ({
      ...prev,
      [id.replace("editar", "").toLowerCase()]: value,
    }));
  };

  const manejarGuardar = async () => {
    if (!prendaOriginal) return;

    const data: PrendaPayload = {
      prenda: datosFormulario.tipo,
      cantidad: prendaOriginal.cantidad,
      mayoristaid: prendaOriginal.mayoristaid,
      preciocompra: parseFloat(prendaOriginal.preciocompra),
      precioventa: parseFloat(datosFormulario.precioVenta),
      stockactual: parseInt(datosFormulario.stock),
      talle: datosFormulario.talle,
      totalcompra: parseFloat(prendaOriginal.totalcompra),
    };

    try {
      await actualizarPrenda(prendaId, data);
      alert("¡Prenda actualizada exitosamente!");
      alActualizar();
      alCerrar();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la prenda.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Editar Prenda</h3>
          <button onClick={alCerrar} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Ya no es <form>, es un div */}
        <div>
          <div className="mb-4">
            <label htmlFor="editarTipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Prenda*
            </label>
            <input
              type="text"
              id="editarTipo"
              value={datosFormulario.tipo}
              onChange={manejarCambio}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="editarTalle" className="block text-sm font-medium text-gray-700 mb-1">
              Talle
            </label>
            <input
              type="text"
              id="editarTalle"
              value={datosFormulario.talle}
              onChange={manejarCambio}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="editarStock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock*
            </label>
            <input
              type="number"
              id="editarStock"
              min="0"
              value={datosFormulario.stock}
              onChange={manejarCambio}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="editarPrecioVenta" className="block text-sm font-medium text-gray-700 mb-1">
              Precio de Venta*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                type="number"
                id="editarPrecioVenta"
                min="0"
                step="0.01"
                value={datosFormulario.precioVenta}
                onChange={manejarCambio}
                className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={alCerrar}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={manejarGuardar}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <i className="fas fa-save mr-2"></i>Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
