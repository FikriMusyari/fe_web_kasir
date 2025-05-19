export const menuItems = [
  { id: 1, name: "Ayam Cabe Ijo", price: 25000, costPrice: 15000, category: "Ayam", image: "/ayamcabeijo.jpg" },
  { id: 2, name: "Ayam Cabe Merah", price: 23000, costPrice: 13000, category: "Ayam", image: "/ayamcabemerah.jpg" },
  { id: 3, name: "Ayam Kecap", price: 20000, costPrice: 12000, category: "Ayam", image: "/ayamkecap.jpg" },
  { id: 4, name: "Batagor", price: 15000, costPrice: 8000, category: "Snack", image: "/ayamkecap.jpg" },
  { id: 5, name: "Lontong Pecal Telur", price: 18000, costPrice: 10000, category: "Main Course", image: "/ayamkecap.jpg" },
  { id: 6, name: "Nasi Goreng Spesial", price: 22000, costPrice: 12000, category: "Main Course", image: "/nasigoreng.jpg" },
  { id: 7, name: "Es Teh Manis", price: 5000, costPrice: 2000, category: "Minuman", image: "/ayamkecap.jpg" },
  { id: 8, name: "Air Mineral", price: 3000, costPrice: 1000, category: "Minuman", image: "/nasigoreng.jpg" },
  { id: 9, name: "Nasi Goreng", price: 18000, costPrice: 10000, category: "Nasi", image: "/nasigoreng.jpg" },
  { id: 10, name: "Minas", price: 25000, costPrice: 15000, category: "Nasi", image: "/minas.jpeg" },
  { id: 11, name: "Sate", price: 20000, costPrice: 12000, category: "Sate", image: "/ayamkecap.jpg" },
  { id: 12, name: "Lontong Pecal", price: 15000, costPrice: 8000, category: "Sarapan Pagi", image: "/ayamkecap.jpg" }
];

export const transactionHistory = {
  summary: {
    totalTransactions: 7,
    totalRevenue: "Rp 675.500",
    averageTransaction: "Rp 96.500",
    completionRate: "57.1%"
  },
  transactions: [
    { date: "9 Mei 2025 pukul 14.30", id: "TBX: 009", customer: "Audi", items: 4, total: "Rp 40.000", user_id: "kasir1", paymentMethod: "Cash" },
    { date: "4 Mei 2025 pukul 17.20", id: "TBX: 008", customer: "PKBIII", items: 4, total: "Rp 64.000", user_id: "kasir1", paymentMethod: "Digital Wallet" },
    { date: "3 Mei 2025 pukul 11.30", id: "TBX: 006", customer: "DILE", items: 4, total: "Rp 110.000", user_id: "admin", paymentMethod: "Bank Transfer" },
    { date: "3 Mei 2025 pukul 09.15", id: "TBX: 005", customer: "ALUP3", items: 7, total: "Rp 155.000", user_id: "kasir1", paymentMethod: "Credit Card" },
    { date: "2 Mei 2025 pukul 10.45", id: "TBX: 003", customer: "ALUP2", items: 3, total: "Rp 95.000", user_id: "admin", paymentMethod: "Bank Transfer" },
    { date: "1 Mei 2025 pukul 16.15", id: "TBX: 002", customer: "DLACNTI", items: 2, total: "Rp 57.000", user_id: "kasir1", paymentMethod: "Cash" },
    { date: "1 Mei 2025 pukul 14.30", id: "TBX: 001", customer: "PikrrI", items: 5, total: "Rp 124.500", user_id: "kasir1", paymentMethod: "Credit Card" }
  ]
};

export const mockTransactions = [
  {
    id: 'TRX-001',
    date: '2025-05-01T14:30:00',
    customer: 'PikrrI',
    items: [
      { name: 'Nasi Goreng', quantity: 2, price: 18000 },
      { name: 'Es Teh Manis', quantity: 3, price: 5000 }
    ],
    itemCount: 5,
    total: 124500,
    cashier: 'Pikri',
    paymentMethod: 'Credit Card',
    status: 'completed'
  },
  {
    id: 'TRX-002',
    date: '2025-05-01T16:15:00',
    customer: 'DLACNTI',
    items: [
      { name: 'Nasi Goreng', quantity: 1, price: 18000 },
      { name: 'Es Teh Manis', quantity: 1, price: 5000 }
    ],
    itemCount: 2,
    total: 57000,
    cashier: 'Pikri',
    paymentMethod: 'Cash',
    status: 'completed'
  },
  {
    id: 'TRX-003',
    date: '2025-05-02T10:45:00',
    customer: 'ALUP2',
    items: [
      { name: 'Ayam Kecap', quantity: 1, price: 20000 },
      { name: 'Air Mineral', quantity: 1, price: 3000 },
      { name: 'Es Teh Manis', quantity: 1, price: 5000 }
    ],
    itemCount: 3,
    total: 95000,
    cashier: 'Dila',
    paymentMethod: 'Bank Transfer',
    status: 'pending'
  },
  {
    id: 'TRX-005',
    date: '2025-05-03T09:15:00',
    customer: 'ALUP3',
    items: [
      { name: 'Ayam Bakar Madu', quantity: 3, price: 22000 },
      { name: 'Es Teh Manis', quantity: 4, price: 5000 }
    ],
    itemCount: 7,
    total: 155000,
    cashier: 'Pikri',
    paymentMethod: 'Credit Card',
    status: 'cancelled'
  },
  {
    id: 'TRX-006',
    date: '2025-05-03T11:30:00',
    customer: 'DILE',
    items: [
      { name: 'Nasi Goreng Spesial', quantity: 2, price: 22000 },
      { name: 'Es Teh Manis', quantity: 2, price: 5000 }
    ],
    itemCount: 4,
    total: 110000,
    cashier: 'Dila',
    paymentMethod: 'Bank Transfer',
    status: 'processing'
  },
  {
    id: 'TRX-008',
    date: '2025-05-04T17:20:00',
    customer: 'PKBIII',
    items: [
      { name: 'Nasi Goreng', quantity: 2, price: 18000 },
      { name: 'Es Teh Manis', quantity: 2, price: 5000 }
    ],
    itemCount: 4,
    total: 64000,
    cashier: 'Pikri',
    paymentMethod: 'Digital Wallet',
    status: 'completed'
  },
  {
    id: 'TRX-009',
    date: '2025-05-09T14:30:00',
    customer: 'Audi',
    items: [
      { name: 'Nasi Goreng', quantity: 2, price: 18000 },
      { name: 'Es Teh Manis', quantity: 2, price: 5000 }
    ],
    itemCount: 4,
    total: 40000,
    cashier: 'Pikri',
    paymentMethod: 'Cash',
    status: 'completed'
  }
];

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

export const userCredentials = [
  { user_id: "admin_01", username: "admin", password: "admin123", role: "admin", name: "Dila" },
  { user_id: "kasir_01", username: "kasir1", password: "pikri123", role: "kasir", name: "Pikri" },
  { user_id: "kasir_02", username: "kasir2", password: "alup123", role: "kasir", name: "Alup" }
];

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
    close: "22:00",
    days: "Senin - Minggu"
  },
  taxIdentificationNumber: "12.345.678.9-123.456",
  foundedYear: 2020
};