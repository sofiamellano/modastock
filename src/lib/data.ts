// Interfaces
export interface Proveedor {
  id: number
  nombre: string
  direccion: string
  telefono: string
}

export interface Prenda {
  id: number
  tipo: string
  talle: string | null
  stock: number
  precioCompra: number
  precioVenta: number
  proveedorId: number
}

export interface ItemVenta {
  prendaId: number
  cantidad: number
  precio: number
}

export interface Venta {
  id: number
  fecha: string
  items: ItemVenta[]
  total: number
}

export interface BaseDeDatos {
  proveedores: Proveedor[]
  prendas: Prenda[]
  ventas: Venta[]
}

// Simulación de base de datos (sin datos)
export const baseDeDatos: BaseDeDatos = {
  proveedores: [],
  prendas: [],
  ventas: [],
}

// Funciones auxiliares
export function obtenerProveedorPorId(id: number): Proveedor | undefined {
  return baseDeDatos.proveedores.find((p) => p.id === id)
}

export function obtenerPrendaPorId(id: number): Prenda | undefined {
  return baseDeDatos.prendas.find((p) => p.id === id)
}

export function obtenerVentasDeHoy(): Venta[] {
  const hoy = new Date().toISOString().split("T")[0]
  return baseDeDatos.ventas.filter((venta) => venta.fecha === hoy)
}

export function calcularIngresosHoy(): number {
  const ventasHoy = obtenerVentasDeHoy()
  return ventasHoy.reduce((total, venta) => total + venta.total, 0)
}

export function obtenerStockTotal(): number {
  return baseDeDatos.prendas.reduce((total, prenda) => total + prenda.stock, 0)
}

export function obtenerPrendasConPocoStock(): Prenda[] {
  return baseDeDatos.prendas.filter((prenda) => prenda.stock < 5)
}

export function obtenerPrendasPorTipo(): Record<string, number> {
  const tipos: Record<string, number> = {}
  baseDeDatos.prendas.forEach((prenda) => {
    if (!tipos[prenda.tipo]) {
      tipos[prenda.tipo] = 0
    }
    tipos[prenda.tipo] += prenda.stock
  })
  return tipos
}

export function obtenerVentasPorDia(): Record<string, number> {
  const ventasPorDia: Record<string, number> = {}
  const ultimos7Dias: string[] = []
  const hoy = new Date()

  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(hoy)
    fecha.setDate(fecha.getDate() - i)
    const fechaStr = fecha.toISOString().split("T")[0]
    ultimos7Dias.push(fechaStr)
    ventasPorDia[fechaStr] = 0
  }

  baseDeDatos.ventas.forEach((venta) => {
    if (ultimos7Dias.includes(venta.fecha)) {
      ventasPorDia[venta.fecha] += venta.total
    }
  })

  return ventasPorDia
}

export function formatearFecha(fechaStr: string, corta = false): string {
  const fecha = new Date(fechaStr)
  if (corta) {
    return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
  }
  return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
}

export function registrarNuevaPrenda(
  tipoPrenda: string,
  cantidad: number,
  precioCompra: number,
  precioVenta: number,
  talle: string,
  nombreProveedor: string,
  direccionProveedor: string,
  telefonoProveedor: string,
): void {
  let proveedor = baseDeDatos.proveedores.find(
    (p) => p.nombre.toLowerCase() === nombreProveedor.toLowerCase(),
  )
  if (!proveedor) {
    const nuevoProveedorId = baseDeDatos.proveedores.length > 0
      ? Math.max(...baseDeDatos.proveedores.map((p) => p.id)) + 1
      : 1
    proveedor = {
      id: nuevoProveedorId,
      nombre: nombreProveedor,
      direccion: direccionProveedor,
      telefono: telefonoProveedor,
    }
    baseDeDatos.proveedores.push(proveedor)
  }

  const nuevaPrendaId = baseDeDatos.prendas.length > 0
    ? Math.max(...baseDeDatos.prendas.map((p) => p.id)) + 1
    : 1

  const nuevaPrenda = {
    id: nuevaPrendaId,
    tipo: tipoPrenda,
    talle: talle || null,
    stock: cantidad,
    precioCompra,
    precioVenta,
    proveedorId: proveedor.id,
  }
  baseDeDatos.prendas.push(nuevaPrenda)
}

export function registrarNuevaVenta(itemsVenta: ItemVenta[]): boolean {
  for (const item of itemsVenta) {
    const prenda = obtenerPrendaPorId(item.prendaId)
    if (!prenda || prenda.stock < item.cantidad) {
      return false
    }
  }

  const total = itemsVenta.reduce((suma, item) => suma + item.cantidad * item.precio, 0)

  const nuevaVentaId = baseDeDatos.ventas.length > 0
    ? Math.max(...baseDeDatos.ventas.map((v) => v.id)) + 1
    : 1

  const nuevaVenta = {
    id: nuevaVentaId,
    fecha: new Date().toISOString().split("T")[0],
    items: itemsVenta,
    total,
  }
  baseDeDatos.ventas.push(nuevaVenta)

  itemsVenta.forEach((item) => {
    const prenda = obtenerPrendaPorId(item.prendaId)
    if (prenda) {
      prenda.stock -= item.cantidad
    }
  })

  return true
}

export function actualizarPrenda(
  prendaId: number,
  tipo: string,
  talle: string,
  stock: number,
  precioVenta: number,
): boolean {
  const prenda = obtenerPrendaPorId(prendaId)
  if (!prenda) return false

  prenda.tipo = tipo
  prenda.talle = talle || null
  prenda.stock = stock
  prenda.precioVenta = precioVenta

  return true
}

export function eliminarPrenda(prendaId: number): boolean {
  const cantidadInicial = baseDeDatos.prendas.length
  baseDeDatos.prendas = baseDeDatos.prendas.filter((p) => p.id !== prendaId)

  baseDeDatos.ventas = baseDeDatos.ventas.filter((venta) =>
    !venta.items.some((item) => item.prendaId === prendaId)
  )

  return baseDeDatos.prendas.length < cantidadInicial
}
