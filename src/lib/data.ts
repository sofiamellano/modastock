export interface Supplier {
  id: number
  name: string
  address: string
  phone: string
}

export interface Garment {
  id: number
  type: string
  size: string | null
  stock: number
  purchasePrice: number
  salePrice: number
  supplierId: number
}

export interface SaleItem {
  garmentId: number
  quantity: number
  price: number
}

export interface Sale {
  id: number
  date: string
  items: SaleItem[]
  total: number
}

export interface Database {
  suppliers: Supplier[]
  garments: Garment[]
  sales: Sale[]
}

// Database simulation
export const database: Database = {
  suppliers: [
    { id: 1, name: "Moda Mayorista S.A.", address: "Av. Principal 123, Ciudad", phone: "555-1234" },
    { id: 2, name: "Textiles del Norte", address: "Calle Secundaria 456, Ciudad", phone: "555-5678" },
  ],
  garments: [
    { id: 1, type: "Camisa", size: "M", stock: 15, purchasePrice: 12.5, salePrice: 25.99, supplierId: 1 },
    { id: 2, type: "Pantalón", size: "32", stock: 8, purchasePrice: 18.75, salePrice: 39.99, supplierId: 1 },
    { id: 3, type: "Vestido", size: "S", stock: 5, purchasePrice: 22.0, salePrice: 45.5, supplierId: 2 },
    { id: 4, type: "Chaqueta", size: "L", stock: 3, purchasePrice: 35.0, salePrice: 79.99, supplierId: 2 },
    { id: 5, type: "Falda", size: "38", stock: 10, purchasePrice: 15.25, salePrice: 32.5, supplierId: 1 },
  ],
  sales: [
    {
      id: 1,
      date: new Date().toISOString().split("T")[0],
      items: [
        { garmentId: 1, quantity: 2, price: 25.99 },
        { garmentId: 5, quantity: 1, price: 32.5 },
      ],
      total: 84.48,
    },
    {
      id: 2,
      date: new Date().toISOString().split("T")[0],
      items: [
        { garmentId: 2, quantity: 1, price: 39.99 },
        { garmentId: 3, quantity: 1, price: 45.5 },
      ],
      total: 85.49,
    },
    {
      id: 3,
      date: new Date().toISOString().split("T")[0],
      items: [{ garmentId: 4, quantity: 1, price: 79.99 }],
      total: 79.99,
    },
  ],
}

// Helper functions
export function getSupplierById(id: number): Supplier | undefined {
  return database.suppliers.find((s) => s.id === id)
}

export function getGarmentById(id: number): Garment | undefined {
  return database.garments.find((g) => g.id === id)
}

export function getSalesToday(): Sale[] {
  const today = new Date().toISOString().split("T")[0]
  return database.sales.filter((sale) => sale.date === today)
}

export function calculateIncomeToday(): number {
  const salesToday = getSalesToday()
  return salesToday.reduce((total, sale) => total + sale.total, 0)
}

export function getTotalStock(): number {
  return database.garments.reduce((total, garment) => total + garment.stock, 0)
}

export function getLowStockItems(): Garment[] {
  return database.garments.filter((garment) => garment.stock < 5)
}

export function getGarmentsByType(): Record<string, number> {
  const types: Record<string, number> = {}
  database.garments.forEach((garment) => {
    if (!types[garment.type]) {
      types[garment.type] = 0
    }
    types[garment.type] += garment.stock
  })
  return types
}

export function getSalesByDay(): Record<string, number> {
  const salesByDay: Record<string, number> = {}
  const last7Days: string[] = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    last7Days.push(dateStr)
    salesByDay[dateStr] = 0
  }

  database.sales.forEach((sale) => {
    if (last7Days.includes(sale.date)) {
      salesByDay[sale.date] += sale.total
    }
  })

  return salesByDay
}

export function formatDate(dateStr: string, short = false): string {
  const date = new Date(dateStr)
  if (short) {
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
  }
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
}

export function registerNewGarment(
  tipoPrenda: string,
  cantidad: number,
  precioCompra: number,
  precioVenta: number,
  talle: string,
  nombreMayorista: string,
  direccionMayorista: string,
  telefonoMayorista: string,
): void {
  // Find or create supplier
  let supplier = database.suppliers.find((s) => s.name.toLowerCase() === nombreMayorista.toLowerCase())
  if (!supplier) {
    const newSupplierId = database.suppliers.length > 0 ? Math.max(...database.suppliers.map((s) => s.id)) + 1 : 1
    supplier = {
      id: newSupplierId,
      name: nombreMayorista,
      address: direccionMayorista,
      phone: telefonoMayorista,
    }
    database.suppliers.push(supplier)
  }

  // Create new garment
  const newGarmentId = database.garments.length > 0 ? Math.max(...database.garments.map((g) => g.id)) + 1 : 1
  const newGarment = {
    id: newGarmentId,
    type: tipoPrenda,
    size: talle || null,
    stock: cantidad,
    purchasePrice: precioCompra,
    salePrice: precioVenta,
    supplierId: supplier.id,
  }
  database.garments.push(newGarment)
}

export function registerNewSale(saleItems: SaleItem[]): boolean {
  // Validate stock
  for (const item of saleItems) {
    const garment = getGarmentById(item.garmentId)
    if (!garment || garment.stock < item.quantity) {
      return false
    }
  }

  // Calculate total
  const total = saleItems.reduce((sum, item) => sum + item.quantity * item.price, 0)

  // Create new sale
  const newSaleId = database.sales.length > 0 ? Math.max(...database.sales.map((s) => s.id)) + 1 : 1
  const newSale = {
    id: newSaleId,
    date: new Date().toISOString().split("T")[0],
    items: saleItems,
    total,
  }
  database.sales.push(newSale)

  // Update garment stocks
  saleItems.forEach((item) => {
    const garment = getGarmentById(item.garmentId)
    if (garment) {
      garment.stock -= item.quantity
    }
  })

  return true
}

export function updateGarment(
  garmentId: number,
  type: string,
  size: string,
  stock: number,
  salePrice: number,
): boolean {
  const garment = getGarmentById(garmentId)
  if (!garment) return false

  garment.type = type
  garment.size = size || null
  garment.stock = stock
  garment.salePrice = salePrice

  return true
}

export function deleteGarment(garmentId: number): boolean {
  const initialLength = database.garments.length
  database.garments = database.garments.filter((g) => g.id !== garmentId)

  // Remove any sales that include this garment
  database.sales = database.sales.filter((sale) => {
    return !sale.items.some((item) => item.garmentId === garmentId)
  })

  return database.garments.length < initialLength
}
