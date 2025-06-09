

export const transactionHistory = {
  summary: {
    totalTransactions: 7,
    totalRevenue: "Rp 675.500",
    averageTransaction: "Rp 96.500",
    completionRate: "57.1%"
  },
  transactions: [
    { date: "9 Mei 2025 pukul 14.30", id: "TBX: 009", customer: "Audi", items: 4, total: "Rp 40.000", user_id: "kasir1", paymentMethod: "Cash" },
  ]
};

export const salesReport = {
  overview: {
    growthRate: "7.4%",
    currentRevenue: "Rp 13.100.000",
    previousRevenue: "Rp 12.500.000",
    currentOrders: 210,
    previousOrders: 195,
    bestSeller: "Nasi Goreng Spesial",
    bestSellerSales: "224 penjualan",
    averageOrderValue: "Rp 62.381",
    monthlyRevenue: "Rp 3.510.000"
  },
  monthlyData: [
    { month: "Januari", bestSeller: "Nasi Goreng Spesial", salesCount: "234 penjualan" },
    { month: "Februari", bestSeller: "Nasi Goreng Spesial", salesCount: "210 penjualan" },
    { month: "Maret", bestSeller: "Nasi Goreng Spesial", salesCount: "245 penjualan" },
    { month: "April", bestSeller: "Nasi Goreng Spesial", salesCount: "228 penjualan" },
    { month: "Mei", bestSeller: "Nasi Goreng Spesial", salesCount: "224 penjualan" }
  ]
};

export const mockMonthlyData = [
  { month: "Januari", revenue: 9500000, orders: 142, avgOrder: 66901 },
  { month: "Februari", revenue: 10200000, orders: 156, avgOrder: 65385 },
  { month: "Maret", revenue: 11800000, orders: 178, avgOrder: 66292 },
  { month: "April", revenue: 12500000, orders: 195, avgOrder: 64103 },
  { month: "Mei", revenue: 13100000, orders: 210, avgOrder: 62381 }
];

export const mockTopProducts = [
  { name: "Nasi Goreng Spesial", sold: 234, revenue: 3510000 },
  { name: "Ayam Bakar Madu", sold: 189, revenue: 3402000 },
  { name: "Soto Ayam", sold: 176, revenue: 2640000 },
  { name: "Es Teh Manis", sold: 100, revenue: 1248000 },
  { name: "Mie Goreng Seafood", sold: 143, revenue: 2288000 }
];

export const businessInfo = {
  name: "Warung Sekre",
  address: "SEKRE HIMATIF, GEDUNG GB",
  phone: "+62 812-3456-7890",
  email: "warungsekre@example.com",
  operatingHours: {
    open: "08:00",
    close: "18:00",
    days: "Senin - Jumat"
  },
  taxIdentificationNumber: "12.345.678.9-123.456",
  foundedYear: 2020
};