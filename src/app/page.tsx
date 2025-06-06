"use client";

import { useState, useEffect } from "react";
import BarraLateral from "@/src/components/sidebar";
import Encabezado from "@/src/components/header";
import PanelPrincipal from "@/src/components/dashboard";
import RegistrarPrenda from "@/src/components/registrar-prenda";
import RegistrarVenta from "@/src/components/registrar-venta";
import Mayoristas from "@/src/components/mayoristas";
import Inventario from "@/src/components/inventario";
import HistorialVentas from "@/src/components/historial-ventas";
import ModalDetalleVenta from "@/src/components/modals/sale-detail-modal";
import ModalEditarPrenda from "@/src/components/modals/edit-garment-modal";
import { obtenerPrendas, obtenerVentas, obtenerMayoristas } from "@/src/lib/api";

export default function PaginaControlStock() {
  const [seccionActiva, setSeccionActiva] = useState("panel");
  const [barraColapsada, setBarraColapsada] = useState(false);
  const [ventaSeleccionadaId, setVentaSeleccionadaId] = useState<number | null>(null);
  const [prendaSeleccionadaId, setPrendaSeleccionadaId] = useState<number | null>(null);
  const [estadisticas, setEstadisticas] = useState({
    prendasTotales: 0,
    ventasHoy: 0,
    mayoristasTotales: 0,
    ingresosHoy: 0,
  });

  const actualizarEstadisticas = async () => {
    const [prendas, ventas, mayoristas] = await Promise.all([
      obtenerPrendas(),
      obtenerVentas(),
      obtenerMayoristas(),
    ]);

    const hoy = new Date().toISOString().split("T")[0];

    const ventasHoyLista = ventas.filter((v: any) => v.fecha.startsWith(hoy));
    const ingresosHoy = ventasHoyLista.reduce((total: number, v: any) => total + Number(v.total_venta), 0);
    const stockTotal = prendas.reduce((total: number, p: any) => total + Number(p.stockactual), 0);

    setEstadisticas({
      prendasTotales: stockTotal,
      ventasHoy: ventasHoyLista.length,
      mayoristasTotales: mayoristas.length,
      ingresosHoy,
    });
  };

  useEffect(() => {
    actualizarEstadisticas();
  }, []);

  const cambiarSeccion = (seccion: string) => setSeccionActiva(seccion);
  const alternarBarraLateral = () => setBarraColapsada(!barraColapsada);
  const verDetalleVenta = (idVenta: number) => setVentaSeleccionadaId(idVenta);
  const editarPrenda = (idPrenda: number) => setPrendaSeleccionadaId(idPrenda);
  const manejarActualizacion = () => actualizarEstadisticas();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">
      <BarraLateral
        collapsed={barraColapsada}
        onToggle={alternarBarraLateral}
        onNavigate={cambiarSeccion}
        activeSection={seccionActiva}
      />

      <div
        className={`main-content flex-1 overflow-auto transition-all duration-300 ${
          barraColapsada ? "ml-[70px]" : "ml-64"
        }`}
      >
        <Encabezado title={seccionActiva.charAt(0).toUpperCase() + seccionActiva.slice(1)} />

        <main className="p-6">
          {seccionActiva === "panel" && <PanelPrincipal stats={estadisticas} />}
          {seccionActiva === "registrarPrenda" && <RegistrarPrenda onRegister={manejarActualizacion} />}
          {seccionActiva === "registrarVenta" && <RegistrarVenta onRegister={manejarActualizacion} />}
          {seccionActiva === "mayoristas" && <Mayoristas />}
          {seccionActiva === "inventario" && (
            <Inventario onEditPrenda={editarPrenda} onDataUpdate={manejarActualizacion} />
          )}
          {seccionActiva === "historialVentas" && (
            <HistorialVentas alVerDetalleVenta={verDetalleVenta} />
          )}
        </main>
      </div>

      {ventaSeleccionadaId !== null && (
        <ModalDetalleVenta
          idVenta={ventaSeleccionadaId}
          alCerrar={() => setVentaSeleccionadaId(null)}
        />
      )}

      {prendaSeleccionadaId !== null && (
        <ModalEditarPrenda
          prendaId={prendaSeleccionadaId}
          alCerrar={() => setPrendaSeleccionadaId(null)}
          alActualizar={manejarActualizacion}
        />
      )}
    </div>
  );
}
