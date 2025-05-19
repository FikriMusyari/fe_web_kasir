import axios from 'axios';

const BASE_URL = 'https://api-kantin-hono.up.railway.app/api';

// Fungsi untuk mengambil semua pengguna
export const getUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data pengguna:', error);
    return [];
  }
};

// Fungsi untuk mengambil data pengguna berdasarkan ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Terjadi kesalahan saat mengambil data pengguna dengan ID ${userId}:`, error);
    return null;
  }
};

// Fungsi untuk mengambil data pengguna yang sedang login
export const getCurrentUser = async () => {
  try {
    // Ambil token dari localStorage
    const token = localStorage.getItem("token");

    // Jika token ada, kirimkan di header Authorization
    const response = await axios.get(`${BASE_URL}/users/current`, {
      headers: {
        "Authorization": `Bearer ${token}`, // Menyertakan token di header
      },
    });

    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data pengguna yang sedang login:', error);
    return null;
  }
};

// Fungsi untuk login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login gagal:', error);
    return null;
  }
};

// Fungsi untuk mengambil semua produk
export const getProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data produk:', error);
    return [];
  }
};

export const buatProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data produk:', error);
    return [];
  }
};

// Fungsi untuk mengambil semua transaksi
export const getTransactions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data transaksi:', error);
    return [];
  }
};

// Fungsi untuk mengambil laporan
export const getReports = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/reports`);
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data laporan:', error);
    return [];
  }
};
