"use client";

import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import {
  obtenerPrendas,
  obtenerVentas,
  obtenerMayoristas,
} from "@/src/lib/api";

Chart.register(...registerables);

interface DashboardProps {
  stats: {
    prendasTotales: number;
    ventasHoy: number;
    mayoristasTotales: number;
    ingresosHoy: number;
  };
}

export default function Dashboard({ stats }: DashboardProps) {
  const stockChartRef = useRef<HTMLCanvasElement>(null);
  const salesChartRef = useRef<HTMLCanvasElement>(null);
  const stockChartInstance = useRef<Chart | null>(null);
  const salesChartInstance = useRef<Chart | null>(null);

  const [prendas, setPrendas] = useState<any[]>([]);
  const [ventas, setVentas] = useState<any[]>([]);
  const [mayoristas, setMayoristas] = useState<any[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const [prendasRes, ventasRes, mayoristasRes] = await Promise.all([
        obtenerPrendas(),
        obtenerVentas(),
        obtenerMayoristas(),
      ]);
      setPrendas(prendasRes);
      setVentas(ventasRes);
      setMayoristas(mayoristasRes);
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    if (prendas.length > 0) inicializarGraficoStock();
    if (ventas.length > 0) inicializarGraficoVentas();

    return () => {
      stockChartInstance.current?.destroy();
      salesChartInstance.current?.destroy();
    };
  }, [prendas, ventas]);

  const inicializarGraficoStock = () => {
    if (!stockChartRef.current) return;

    const ctx = stockChartRef.current.getContext("2d");
    if (!ctx) return;

    const agrupadas = prendas.reduce((acc: any, p: any) => {
      acc[p.prenda] = (acc[p.prenda] || 0) + Number(p.stockactual);
      return acc;
    }, {});

    stockChartInstance.current?.destroy();
    stockChartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(agrupadas),
        datasets: [
          {
            label: "Prendas en Stock",
            data: Object.values(agrupadas),
            backgroundColor: "rgba(79, 70, 229, 0.7)",
            borderColor: "rgba(79, 70, 229, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  const inicializarGraficoVentas = () => {
    if (!salesChartRef.current) return;

    const ctx = salesChartRef.current.getContext("2d");
    if (!ctx) return;

    const agrupadas = ventas.reduce((acc: any, v: any) => {
      const fecha = v.fecha.split("T")[0];
      acc[fecha] = (acc[fecha] || 0) + Number(v.total_venta);
      return acc;
    }, {});

    const labels = Object.keys(agrupadas).sort();
    const datos = labels.map((fecha) => agrupadas[fecha]);

    salesChartInstance.current?.destroy();
    salesChartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels.map(formatearFecha),
        datasets: [
          {
            label: "Ventas por Día ($)",
            data: datos,
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  const prendasBajoStock = prendas.filter((p) => p.stockactual < 5);

  return (
    <>
      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <CardEstadistica icono="fas fa-tshirt" color="indigo" titulo="Prendas en Stock" valor={stats.prendasTotales} />
        <CardEstadistica icono="fas fa-cash-register" color="green" titulo="Ventas Hoy" valor={stats.ventasHoy} />
        <CardEstadistica icono="fas fa-truck" color="blue" titulo="Mayoristas" valor={stats.mayoristasTotales} />
        <CardEstadistica icono="fas fa-dollar-sign" color="purple" titulo="Ingresos Hoy" valor={`$${stats.ingresosHoy.toFixed(2)}`} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Prendas en Stock por Tipo</h2>
          <div className="chart-container h-[300px]">
            <canvas ref={stockChartRef}></canvas>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ventas por Día (Últimos 7 días)</h2>
          <div className="chart-container h-[300px]">
            <canvas ref={salesChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Bajo stock */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Prendas con Stock Bajo</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <EncabezadoTabla texto="Tipo" />
                <EncabezadoTabla texto="Talle" />
                <EncabezadoTabla texto="Stock Actual" />
                <EncabezadoTabla texto="Precio Venta" />
                <EncabezadoTabla texto="Mayorista" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prendasBajoStock.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No hay prendas con stock bajo
                  </td>
                </tr>
              ) : (
                prendasBajoStock.map((p) => {
                  const mayorista = mayoristas.find((m) => m.idmayorista === p.mayoristaid);
                  return (
                    <tr key={p.idprenda}>
                      <td className="px-6 py-4 whitespace-nowrap">{p.prenda}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{p.talle || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-red-600 font-semibold">{p.stockactual}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${Number(p.precioventa).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{mayorista?.mayorista || "N/A"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// Utilidades
const formatearFecha = (fecha: string) => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function CardEstadistica({ icono, color, titulo, valor }: { icono: string; color: string; titulo: string; valor: string | number }) {
  return (
    <div className="highlight-card bg-white rounded-xl shadow p-6 flex items-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
      <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600 mr-4`}>
        <i className={`${icono} text-xl`}></i>
      </div>
      <div>
        <p className="text-gray-500 text-sm">{titulo}</p>
        <p className="text-2xl font-bold">{valor}</p>
      </div>
    </div>
  );
}

function EncabezadoTabla({ texto }: { texto: string }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{texto}</th>
  );
}
