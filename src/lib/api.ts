const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Interfaces tipadas
export interface PrendaPayload {
  prenda: string;
  cantidad: number;
  mayoristaid?: number;
  preciocompra: number;
  precioventa: number;
  stockactual: number;
  talle?: string;
  totalcompra: number;
}

export interface MayoristaPayload {
  mayorista: string;
  direccion?: string;
  telefono: string;
}

export interface VentaPayload {
  prendaid: number;
  cantidad_vendida: number;
  total_venta: number;
  fecha: string;
}

// Funciones de consulta
export async function obtenerPrendas() {
  const res = await fetch(`${API_URL}/prendas/`);
  if (!res.ok) throw new Error("Error al obtener prendas");
  return res.json();
}

export async function obtenerMayoristas() {
  const res = await fetch(`${API_URL}/mayoristas/`);
  if (!res.ok) throw new Error("Error al obtener mayoristas");
  return res.json();
}

export async function obtenerVentas() {
  const res = await fetch(`${API_URL}/ventas/`);
  if (!res.ok) throw new Error("Error al obtener ventas");
  return res.json();
}

// Funciones de creación
export async function crearVenta(data: VentaPayload) {
  const res = await fetch(`${API_URL}/ventas/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al registrar venta");
  return res.json();
}

export async function crearPrenda(data: PrendaPayload) {
  const res = await fetch(`${API_URL}/prendas/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al registrar prenda");
  return res.json();
}

export async function crearMayorista(data: MayoristaPayload) {
  const res = await fetch(`${API_URL}/mayoristas/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al registrar mayorista");
  return res.json();
}

// Función para actualizar prenda
export async function actualizarPrenda(id: number, data: PrendaPayload) {
  const res = await fetch(`${API_URL}/prendas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar prenda");
  return res.json();
}

export async function obtenerPrendasConPocoStock() {
  const prendas: PrendaPayload[] = await obtenerPrendas(); // 👈 asegurás el tipo
  return prendas.filter((p) => p.stockactual < 5);
}
