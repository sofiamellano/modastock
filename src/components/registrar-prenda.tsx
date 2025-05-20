"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { crearMayorista, crearPrenda } from "@/src/lib/api";

interface RegistrarPrendaProps {
  onRegister: () => void;
}

export default function RegistrarPrenda({ onRegister }: RegistrarPrendaProps) {
  const [formulario, setFormulario] = useState({
    tipoPrenda: "",
    cantidad: "",
    precioCompra: "",
    precioVenta: "",
    talle: "",
    totalCompra: "",
    nombreMayorista: "",
    direccionMayorista: "",
    telefonoMayorista: "",
  });

  const manejarCambio = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormulario((prev) => ({ ...prev, [id]: value }));

    if (id === "cantidad" || id === "precioCompra") {
      const cantidad = id === "cantidad" ? Number.parseInt(value) || 0 : Number.parseInt(formulario.cantidad) || 0;
      const precioCompra = id === "precioCompra" ? Number.parseFloat(value) || 0 : Number.parseFloat(formulario.precioCompra) || 0;
      const total = cantidad * precioCompra;
      setFormulario((prev) => ({ ...prev, totalCompra: total.toFixed(2) }));
    }

    if (id === "totalCompra") {
      const total = Number.parseFloat(value) || 0;
      const cantidad = Number.parseInt(formulario.cantidad) || 0;
      if (cantidad > 0) {
        const precioUnitario = total / cantidad;
        setFormulario((prev) => ({ ...prev, precioCompra: precioUnitario.toFixed(2) }));
      }
    }
  };

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const mayorista = await crearMayorista({
        mayorista: formulario.nombreMayorista,
        direccion: formulario.direccionMayorista,
        telefono: formulario.telefonoMayorista,
      });

      await crearPrenda({
        prenda: formulario.tipoPrenda,
        cantidad: parseInt(formulario.cantidad),
        mayoristaid: mayorista.idmayorista,
        preciocompra: parseFloat(formulario.precioCompra),
        precioventa: parseFloat(formulario.precioVenta),
        stockactual: parseInt(formulario.cantidad),
        talle: formulario.talle,
        totalcompra: parseFloat(formulario.totalCompra),
      });

      setFormulario({
        tipoPrenda: "",
        cantidad: "",
        precioCompra: "",
        precioVenta: "",
        talle: "",
        totalCompra: "",
        nombreMayorista: "",
        direccionMayorista: "",
        telefonoMayorista: "",
      });

      alert("¡Prenda registrada exitosamente!");
      onRegister();
    } catch (err) {
      console.error(err);
      alert("Error al registrar la prenda");
    }
  };

  const manejarCancelacion = () => {
    setFormulario({
      tipoPrenda: "",
      cantidad: "",
      precioCompra: "",
      precioVenta: "",
      talle: "",
      totalCompra: "",
      nombreMayorista: "",
      direccionMayorista: "",
      telefonoMayorista: "",
    });
  };

  return (
    // ✅ El JSX del formulario permanece igual
    // ... usa el mismo HTML/JSX original, solo se actualizó la lógica
    <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
  <h2 className="text-xl font-bold text-gray-800">Registrar Nueva Prenda</h2>
</div>
<form onSubmit={manejarEnvio}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div>
      <label htmlFor="tipoPrenda" className="block text-sm font-medium text-gray-700 mb-1">
        Tipo de Prenda*
      </label>
      <input
  type="text"
  id="tipoPrenda"
  value={formulario.tipoPrenda}
  onChange={manejarCambio}
  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
  required
  placeholder="Ej: Camisa, Jean, etc."
/>

    </div>
    <div>
      <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1">
        Cantidad*
      </label>
      <input
        type="number"
        id="cantidad"
        min="1"
        value={formulario.cantidad}
        onChange={manejarCambio}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div>
      <label htmlFor="precioCompra" className="block text-sm font-medium text-gray-700 mb-1">
        Precio de Compra*
      </label>
      <div className="relative">
        <span className="absolute left-3 top-2">$</span>
        <input
          type="number"
          id="precioCompra"
          min="0"
          step="0.01"
          value={formulario.precioCompra}
          onChange={manejarCambio}
          className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
    </div>
    <div>
      <label htmlFor="precioVenta" className="block text-sm font-medium text-gray-700 mb-1">
        Precio de Venta*
      </label>
      <div className="relative">
        <span className="absolute left-3 top-2">$</span>
        <input
          type="number"
          id="precioVenta"
          min="0"
          step="0.01"
          value={formulario.precioVenta}
          onChange={manejarCambio}
          className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div>
      <label htmlFor="talle" className="block text-sm font-medium text-gray-700 mb-1">
        Talle (opcional)
      </label>
      <input
        type="text"
        id="talle"
        placeholder="Ej: 38, 40, 42 o 38-42"
        value={formulario.talle}
        onChange={manejarCambio}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label htmlFor="totalCompra" className="block text-sm font-medium text-gray-700 mb-1">
        Total Compra
      </label>
      <div className="relative">
        <span className="absolute left-3 top-2">$</span>
        <input
          type="number"
          id="totalCompra"
          min="0"
          step="0.01"
          value={formulario.totalCompra}
          onChange={manejarCambio}
          className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  </div>

  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">Mayorista*</label>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="nombreMayorista" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre*
        </label>
        <input
          type="text"
          id="nombreMayorista"
          value={formulario.nombreMayorista}
          onChange={manejarCambio}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label htmlFor="direccionMayorista" className="block text-sm font-medium text-gray-700 mb-1">
          Dirección*
        </label>
        <input
          type="text"
          id="direccionMayorista"
          value={formulario.direccionMayorista}
          onChange={manejarCambio}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label htmlFor="telefonoMayorista" className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono
        </label>
        <input
          type="tel"
          id="telefonoMayorista"
          value={formulario.telefonoMayorista}
          onChange={manejarCambio}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  </div>

  <div className="flex justify-end">
    <button
      type="button"
      onClick={manejarCancelacion}
      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-50"
    >
      Cancelar
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <i className="fas fa-save mr-2"></i>Guardar Prenda
    </button>
  </div>
</form>

    </div>
  );
}
