"use client";

import { useState, useEffect, type FormEvent } from "react";
import { obtenerPrendas, crearVenta } from "@/src/lib/api";

interface FilaPrenda {
  id: string;
  prendaId: string;
  cantidad: string;
  precio: string;
}

interface RegistrarVentaProps {
  onRegister: () => void;
}

export default function RegistrarVenta({ onRegister }: RegistrarVentaProps) {
  const [filasPrenda, setFilasPrenda] = useState<FilaPrenda[]>([
    { id: "1", prendaId: "", cantidad: "", precio: "" },
  ]);
  const [totalVenta, setTotalVenta] = useState("0.00");
  const [prendas, setPrendas] = useState<any[]>([]);

  useEffect(() => {
    const fetchPrendas = async () => {
      const res = await obtenerPrendas();
      setPrendas(res);
    };
    fetchPrendas();
  }, []);

  useEffect(() => {
    calcularTotalVenta();
  }, [filasPrenda]);

  const agregarFilaPrenda = () => {
    const nuevoId = (filasPrenda.length + 1).toString();
    setFilasPrenda([...filasPrenda, { id: nuevoId, prendaId: "", cantidad: "", precio: "" }]);
  };

  const eliminarFilaPrenda = (id: string) => {
    if (filasPrenda.length > 1) {
      setFilasPrenda(filasPrenda.filter((fila) => fila.id !== id));
    }
  };

  const manejarCambio = (id: string, campo: keyof FilaPrenda, valor: string) => {
    setFilasPrenda((prev) =>
      prev.map((fila) => {
        if (fila.id === id) {
          const actualizada = { ...fila, [campo]: valor };

          if (campo === "prendaId") {
            const prenda = prendas.find((p) => p.idprenda === parseInt(valor));
            if (prenda) {
              actualizada.precio = prenda.precioventa.toFixed(2);
            }
          }

          return actualizada;
        }
        return fila;
      })
    );
  };

  const calcularTotalVenta = () => {
    let total = 0;
    filasPrenda.forEach((fila) => {
      const cantidad = parseFloat(fila.cantidad) || 0;
      const precio = parseFloat(fila.precio) || 0;
      total += cantidad * precio;
    });
    setTotalVenta(total.toFixed(2));
  };

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();

    let esValido = true;

    for (const fila of filasPrenda) {
      if (!fila.prendaId || !fila.cantidad || !fila.precio) {
        esValido = false;
        break;
      }

      const prenda = prendas.find((p) => p.idprenda === parseInt(fila.prendaId));
      if (!prenda || prenda.stockactual < parseInt(fila.cantidad)) {
        alert(`No hay suficiente stock de ${prenda?.prenda} (${prenda?.talle || "N/A"}). Stock: ${prenda?.stockactual}`);
        esValido = false;
        break;
      }
    }

    if (!esValido) {
      alert("Por favor complete todos los campos correctamente.");
      return;
    }

    try {
      for (const fila of filasPrenda) {
        await crearVenta({
          prendaid: parseInt(fila.prendaId),
          cantidad_vendida: parseInt(fila.cantidad),
          total_venta: parseFloat(fila.precio) * parseInt(fila.cantidad),
          fecha: new Date().toISOString(),
        });
      }

      setFilasPrenda([{ id: "1", prendaId: "", cantidad: "", precio: "" }]);
      setTotalVenta("0.00");
      alert("¡Venta registrada exitosamente!");
      onRegister();
    } catch (err) {
      console.error(err);
      alert("Error al registrar la venta.");
    }
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 fade-in">
      <form onSubmit={manejarEnvio}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Prendas Vendidas</label>
          <div>
            {filasPrenda.map((fila) => (
              <div key={fila.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-3">
                <div className="md:col-span-5">
                  <select
                    value={fila.prendaId}
                    onChange={(e) => manejarCambio(fila.id, "prendaId", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Seleccionar Prenda.</option>
                    {prendas.map((prenda) => (
                      <option key={prenda.idprenda} value={prenda.idprenda}>
                        {prenda.prenda} ({prenda.talle || "N/A"}) - Stock: {prenda.stockactual}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-3">
                  <input
                    type="number"
                    min="1"
                    value={fila.cantidad}
                    onChange={(e) => manejarCambio(fila.id, "cantidad", e.target.value)}
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
                      value={fila.precio}
                      onChange={(e) => manejarCambio(fila.id, "precio", e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Precio"
                      required
                    />
                  </div>
                </div>
                <div className="md:col-span-1 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => eliminarFilaPrenda(fila.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={filasPrenda.length === 1}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={agregarFilaPrenda}
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
            onClick={() => setFilasPrenda([{ id: "1", prendaId: "", cantidad: "", precio: "" }])}
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
  );
}
